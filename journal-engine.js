function summarizeJournal(entries) {
  const total = entries.length;
  const wins = entries.filter((entry) => Number(entry.resultPct) > 0).length;
  const losses = entries.filter((entry) => Number(entry.resultPct) <= 0).length;
  const avgPct = total ? entries.reduce((sum, entry) => sum + Number(entry.resultPct || 0), 0) / total : 0;
  const avgLeveragedPct = total ? entries.reduce((sum, entry) => sum + Number(entry.leveragedPct || 0), 0) / total : 0;
  return {
    total,
    wins,
    losses,
    winrate: total ? (wins / total) * 100 : 0,
    avgPct,
    avgLeveragedPct,
  };
}

function groupStats(entries, key) {
  const groups = new Map();
  entries.forEach((entry) => {
    const value = entry[key] || "unknown";
    const list = groups.get(value) || [];
    list.push(entry);
    groups.set(value, list);
  });
  return [...groups.entries()].map(([label, list]) => ({
    label,
    ...summarizeJournal(list),
  })).sort((a, b) => b.total - a.total);
}

function detectFailurePattern(entry) {
  if (entry.exitReason === "SL" && entry.failureReason) return entry.failureReason;
  if (entry.exitReason === "SL") return "SL bez špecifikovaného dôvodu";
  if (Number(entry.resultPct) > 0) return "Validný výstup do profitu";
  return "Neutrálne / manuálne zatvorenie";
}

function buildMockJournalState(candidates) {
  const paperState = window.CockpitPaperSimulator.buildMockPaperState(candidates);
  const closed = [
    createPaperTrade({
      id: "paper-wld-closed",
      candidateId: candidates.find((candidate) => candidate.pair === "WLDUSDT")?.id,
      pair: "WLDUSDT",
      direction: Direction.LONG,
      style: TradeStyle.INTRADAY,
      status: PaperTradeStatus.STOPPED,
      setupType: "Trend continuation",
      triggerType: "Weak retest",
      entry: 0.256,
      live: 0.2548,
      stop: 0.2548,
      exitPrice: 0.2548,
      resultPct: -0.47,
      leveragedPct: -4.7,
      exitReason: "SL",
      closedAt: nowIso(),
    }),
    createPaperTrade({
      id: "paper-sui-closed",
      candidateId: candidates.find((candidate) => candidate.pair === "SUIUSDT")?.id,
      pair: "SUIUSDT",
      direction: Direction.LONG,
      style: TradeStyle.SCALP,
      status: PaperTradeStatus.TARGET,
      setupType: "EMA reclaim",
      triggerType: "Continuation close",
      entry: 3.42,
      live: 3.48,
      exitPrice: 3.48,
      resultPct: 1.75,
      leveragedPct: 17.5,
      exitReason: "TP1",
      closedAt: nowIso(),
    }),
  ];
  const entries = [
    ...mockJournal,
    ...closed.map((trade) => {
      const candidate = candidates.find((item) => item.id === trade.candidateId);
      return journalFromPaperTrade(trade, candidate);
    }),
  ].map((entry) => ({ ...entry, failurePattern: detectFailurePattern(entry) }));

  return {
    entries,
    summary: summarizeJournal(entries),
    bySetup: groupStats(entries, "setupType"),
    byStyle: groupStats(entries, "style"),
    byTrigger: groupStats(entries, "triggerType"),
    activePaper: paperState.active,
  };
}

window.CockpitJournalEngine = {
  summarizeJournal,
  groupStats,
  detectFailurePattern,
  buildMockJournalState,
};
