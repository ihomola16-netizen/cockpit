function cloneTargets(plan) {
  return (plan?.targets || []).map((target) => ({ ...target }));
}

function planForStyle(candidate, style = candidate.style) {
  return candidate.tradePlans.find((plan) => plan.style === style) || candidate.tradePlans[0];
}

function createPaperTradeFromTrigger(candidate, trigger, options = {}) {
  const plan = planForStyle(candidate, trigger.style);
  const shouldActivate = options.forceActive === true;
  return createPaperTrade({
    candidateId: candidate.id,
    triggerId: trigger.id,
    pair: candidate.pair,
    direction: candidate.direction,
    style: trigger.style,
    status: shouldActivate ? PaperTradeStatus.ACTIVE : PaperTradeStatus.WAITING_TRIGGER,
    setupType: candidate.setupType,
    triggerType: trigger.triggerType,
    margin: options.margin ?? 10,
    leverage: options.leverage ?? 10,
    plannedEntry: plan.entry,
    entryZone: plan.entryZone ?? null,
    entry: shouldActivate ? plan.entry : null,
    live: shouldActivate ? options.live ?? plan.entry : null,
    stop: plan.stop,
    targets: cloneTargets(plan),
    openedAt: shouldActivate ? nowIso() : null,
  });
}

function priceMovePct(entry, live, direction) {
  if (!Number.isFinite(entry) || !Number.isFinite(live) || entry === 0) return 0;
  return ((live - entry) / entry) * 100 * (direction === Direction.LONG ? 1 : -1);
}

function updatePaperTradeSnapshot(trade, livePrice) {
  if (trade.status !== PaperTradeStatus.ACTIVE) return trade;
  const resultPct = priceMovePct(trade.entry, livePrice, trade.direction);
  const leveragedPct = resultPct * trade.leverage;
  const tpHits = [...trade.tpHits];
  const targets = trade.targets.map((target) => {
    const hit = trade.direction === Direction.LONG ? livePrice >= target.price : livePrice <= target.price;
    if (hit && !tpHits.includes(target.id)) tpHits.push(target.id);
    return { ...target, hit: target.hit || hit };
  });
  const hitStop = trade.direction === Direction.LONG ? livePrice <= trade.stop : livePrice >= trade.stop;
  const finalTarget = targets.at(-1);
  const hitFinalTarget = finalTarget ? finalTarget.hit : false;
  return {
    ...trade,
    live: livePrice,
    targets,
    tpHits,
    resultPct,
    leveragedPct,
    maxFavorablePct: Math.max(trade.maxFavorablePct, resultPct),
    maxAdversePct: Math.min(trade.maxAdversePct, resultPct),
    status: hitStop ? PaperTradeStatus.STOPPED : hitFinalTarget ? PaperTradeStatus.TARGET : trade.status,
    closedAt: hitStop || hitFinalTarget ? nowIso() : trade.closedAt,
    exitPrice: hitStop || hitFinalTarget ? livePrice : trade.exitPrice,
    exitReason: hitStop ? "SL" : hitFinalTarget ? "Final TP" : trade.exitReason,
  };
}

function journalFromPaperTrade(trade, candidate) {
  return createJournalEntry({
    paperTradeId: trade.id,
    pair: trade.pair,
    direction: trade.direction,
    style: trade.style,
    setupType: trade.setupType,
    triggerType: trade.triggerType,
    marketRegime: candidate?.marketRegime ?? "unknown",
    entry: trade.entry,
    exit: trade.exitPrice ?? trade.live,
    resultPct: trade.resultPct,
    leveragedPct: trade.leveragedPct,
    score: candidate?.score?.final ?? null,
    exitReason: trade.exitReason ?? trade.status,
    failureReason: trade.status === PaperTradeStatus.STOPPED ? "Trigger zlyhal alebo trh zmenil režim" : null,
  });
}

function buildMockPaperState(candidates) {
  const triggers = window.CockpitTriggerEngine.buildTriggerBoard(candidates);
  const triggered = triggers.find((trigger) => trigger.status === TriggerStatus.TRIGGERED) || triggers[0];
  const candidate = candidates.find((item) => item.id === triggered?.candidateId) || candidates[0];
  const active = createPaperTradeFromTrigger(candidate, triggered, { forceActive: true, live: planForStyle(candidate).entry * 1.009 });
  const updated = updatePaperTradeSnapshot(active, active.live);
  return {
    waiting: triggers
      .filter((trigger) => trigger.id !== triggered?.id)
      .slice(0, 2)
      .map((trigger) => {
        const item = candidates.find((candidateItem) => candidateItem.id === trigger.candidateId);
        return createPaperTradeFromTrigger(item, trigger);
      }),
    active: [updated],
    closed: [],
    journal: [],
  };
}

function emptyPaperState() {
  return {
    waiting: [],
    active: [],
    closed: [],
    journal: [],
  };
}

function addPaperFromCandidate(state, candidate, trigger, options = {}) {
  const current = state || emptyPaperState();
  const exists = [...current.waiting, ...current.active].some((trade) => trade.candidateId === candidate.id && trade.style === trigger.style);
  if (exists) return current;
  const trade = createPaperTradeFromTrigger(candidate, trigger, options);
  const bucket = trade.status === PaperTradeStatus.ACTIVE ? "active" : "waiting";
  return {
    ...current,
    [bucket]: [trade, ...current[bucket]],
  };
}

function shouldTriggerTrade(trade, price) {
  if (!Number.isFinite(price)) return false;
  if (trade.entryZone && Number.isFinite(trade.entryZone.from) && Number.isFinite(trade.entryZone.to)) {
    const from = Math.min(trade.entryZone.from, trade.entryZone.to);
    const to = Math.max(trade.entryZone.from, trade.entryZone.to);
    return price >= from && price <= to;
  }
  const plannedEntry = trade.plannedEntry;
  if (!Number.isFinite(plannedEntry)) return false;
  return trade.direction === Direction.LONG ? price <= plannedEntry : price >= plannedEntry;
}

function activateWaitingTrade(trade, price) {
  return {
    ...trade,
    status: PaperTradeStatus.ACTIVE,
    entry: price,
    live: price,
    openedAt: nowIso(),
  };
}

function updatePaperStateWithPrices(state, priceMap, candidates = []) {
  const current = state || emptyPaperState();
  const nextWaiting = [];
  const nextActive = [];
  const nextClosed = [...current.closed];
  const nextJournal = [...(current.journal || [])];

  current.waiting.forEach((trade) => {
    const price = priceMap[trade.pair];
    const plan = planForStyle(candidates.find((candidate) => candidate.id === trade.candidateId) || { tradePlans: [] }, trade.style);
    const hydrated = Number.isFinite(trade.plannedEntry) ? trade : { ...trade, plannedEntry: plan?.entry ?? trade.plannedEntry, entryZone: plan?.entryZone ?? trade.entryZone };
    if (shouldTriggerTrade(hydrated, price)) nextActive.push(activateWaitingTrade(hydrated, price));
    else nextWaiting.push(hydrated);
  });

  current.active.forEach((trade) => {
    const price = priceMap[trade.pair];
    const updated = Number.isFinite(price) ? updatePaperTradeSnapshot(trade, price) : trade;
    if ([PaperTradeStatus.STOPPED, PaperTradeStatus.TARGET, PaperTradeStatus.INVALIDATED, PaperTradeStatus.CANCELLED].includes(updated.status)) {
      nextClosed.unshift(updated);
      const candidate = candidates.find((item) => item.id === updated.candidateId);
      nextJournal.unshift(journalFromPaperTrade(updated, candidate));
    } else {
      nextActive.push(updated);
    }
  });

  return {
    waiting: nextWaiting,
    active: nextActive,
    closed: nextClosed,
    journal: nextJournal,
  };
}

window.CockpitPaperSimulator = {
  planForStyle,
  createPaperTradeFromTrigger,
  updatePaperTradeSnapshot,
  journalFromPaperTrade,
  buildMockPaperState,
  emptyPaperState,
  addPaperFromCandidate,
  updatePaperStateWithPrices,
};
