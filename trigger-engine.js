function createChecklistItem(label, status, detail = "") {
  return { label, status, detail };
}

function triggerTypeForCandidate(candidate) {
  if (candidate.setupType.includes("VWAP reclaim")) return "VWAP close reclaim";
  if (candidate.setupType.includes("VWAP reject")) return "VWAP close reject";
  if (candidate.setupType.includes("Pullback")) return "Support retest hold";
  if (candidate.setupType.includes("Range rejection")) return "Resistance rejection";
  if (candidate.setupType.includes("Trend")) return "Continuation close";
  return "Manual confirmation";
}

function buildTriggerChecklist(candidate) {
  const metrics = candidate.metrics || {};
  return [
    createChecklistItem("Market režim neblokuje smer", candidate.regimePenalty > 10 ? "fail" : "done", `Regime penalty ${candidate.regimePenalty || 0}`),
    createChecklistItem("Cena je blízko entry zóny", metrics.vwapDistanceAtr <= 1.2 ? "done" : metrics.vwapDistanceAtr <= 1.8 ? "pending" : "fail", `${metrics.vwapDistanceAtr?.toFixed?.(2) ?? "-"} ATR od VWAP`),
    createChecklistItem("Volume potvrdzuje pohyb", metrics.volumeRatio >= 1.2 ? "done" : "pending", `${metrics.volumeRatio?.toFixed?.(2) ?? "-"}x`),
    createChecklistItem("BTC súhlasí so smerom", metrics.btcAligned ? "done" : "fail", metrics.btcAligned ? "aligned" : "against"),
    createChecklistItem("Risk/exekúcia je prijateľná", candidate.score.risk >= 65 ? "done" : candidate.score.risk >= 50 ? "pending" : "fail", `Risk ${candidate.score.risk}`),
  ];
}

function triggerStatusFromChecklist(candidate, checklist) {
  if (candidate.state === CandidateState.REJECTED || checklist.some((item) => item.status === "fail" && item.label.includes("Risk"))) return TriggerStatus.INVALIDATED;
  const done = checklist.filter((item) => item.status === "done").length;
  const pending = checklist.filter((item) => item.status === "pending").length;
  const failed = checklist.filter((item) => item.status === "fail").length;
  if (failed >= 2) return TriggerStatus.INVALIDATED;
  if (done === checklist.length) return TriggerStatus.TRIGGERED;
  if (done >= 3 && pending <= 2) return TriggerStatus.ARMED;
  return TriggerStatus.WAITING;
}

function entryZoneFromPlan(plan) {
  if (plan.entryZone && Number.isFinite(plan.entryZone.from) && Number.isFinite(plan.entryZone.to)) {
    return {
      from: Math.min(plan.entryZone.from, plan.entryZone.to),
      to: Math.max(plan.entryZone.from, plan.entryZone.to),
    };
  }
  const width = Math.abs(plan.entry - plan.stop) * 0.18;
  return {
    from: Math.min(plan.entry - width, plan.entry + width),
    to: Math.max(plan.entry - width, plan.entry + width),
  };
}

function createTriggerFromCandidate(candidate) {
  const activePlan = candidate.tradePlans.find((plan) => plan.style === candidate.style) || candidate.tradePlans[0];
  const checklist = buildTriggerChecklist(candidate);
  const status = triggerStatusFromChecklist(candidate, checklist);
  return createTrigger({
    candidateId: candidate.id,
    pair: candidate.pair,
    direction: candidate.direction,
    style: candidate.style,
    status,
    triggerType: triggerTypeForCandidate(candidate),
    timeframe: candidate.style === TradeStyle.SCALP ? "15m" : candidate.style === TradeStyle.SWING ? "4h" : "1h",
    checklist,
    entryZone: activePlan ? entryZoneFromPlan(activePlan) : null,
    invalidation: activePlan?.invalidation ?? "Setup prestal platiť.",
    lastCheck: nowIso(),
  });
}

function buildTriggerBoard(candidates) {
  return candidates
    .filter((candidate) => candidate.state !== CandidateState.REJECTED)
    .map(createTriggerFromCandidate)
    .sort((a, b) => {
      const order = {
        [TriggerStatus.TRIGGERED]: 0,
        [TriggerStatus.ARMED]: 1,
        [TriggerStatus.WAITING]: 2,
        [TriggerStatus.INVALIDATED]: 3,
        [TriggerStatus.EXPIRED]: 4,
      };
      return (order[a.status] ?? 9) - (order[b.status] ?? 9);
    });
}

window.CockpitTriggerEngine = {
  createChecklistItem,
  triggerTypeForCandidate,
  buildTriggerChecklist,
  triggerStatusFromChecklist,
  createTriggerFromCandidate,
  buildTriggerBoard,
};
