const MODEL_VERSION = "v3-models-0.1";

const CandidateState = Object.freeze({
  WATCH: "watch",
  FORMING: "forming",
  ARMED: "armed",
  TRIGGERED: "triggered",
  REJECTED: "rejected",
  INVALIDATED: "invalidated",
});

const TradeStyle = Object.freeze({
  SCALP: "scalp",
  INTRADAY: "intraday",
  SWING: "swing",
});

const Direction = Object.freeze({
  LONG: "long",
  SHORT: "short",
});

const TriggerStatus = Object.freeze({
  WAITING: "waiting",
  ARMED: "armed",
  TRIGGERED: "triggered",
  INVALIDATED: "invalidated",
  EXPIRED: "expired",
});

const PaperTradeStatus = Object.freeze({
  WAITING_TRIGGER: "waiting_trigger",
  ACTIVE: "active",
  STOPPED: "stopped",
  TARGET: "target",
  INVALIDATED: "invalidated",
  CANCELLED: "cancelled",
});

const RealTradeStatus = Object.freeze({
  OPEN: "open",
  CLOSED: "closed",
});

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function createScoreBreakdown(values = {}) {
  return {
    market: values.market ?? 70,
    coin: values.coin ?? 70,
    setup: values.setup ?? 70,
    trigger: values.trigger ?? 40,
    risk: values.risk ?? 70,
    edge: values.edge ?? 25,
    conflictPenalty: values.conflictPenalty ?? 0,
    final: values.final ?? 70,
  };
}

function createTradePlan({ style, direction, entry, entryFrom, entryTo, stop, target1, target2, target3, invalidation, note, scenario }) {
  const targets = [
    { id: uid("tp1"), label: "TP1", price: target1, hit: false },
    { id: uid("tp2"), label: "TP2", price: target2, hit: false },
  ];
  if (Number.isFinite(target3)) targets.push({ id: uid("tp3"), label: "TP3", price: target3, hit: false });
  return {
    id: uid("plan"),
    style,
    direction,
    entry,
    entryZone: {
      from: Number.isFinite(entryFrom) ? entryFrom : entry,
      to: Number.isFinite(entryTo) ? entryTo : entry,
    },
    stop,
    targets,
    invalidation,
    note,
    scenario: scenario ?? note,
  };
}

function createCandidate(input) {
  return {
    id: input.id ?? uid("candidate"),
    pair: input.pair,
    direction: input.direction,
    style: input.style,
    state: input.state ?? CandidateState.WATCH,
    setupType: input.setupType,
    timeframe: input.timeframe,
    createdAt: input.createdAt ?? nowIso(),
    updatedAt: input.updatedAt ?? nowIso(),
    marketRegime: input.marketRegime ?? "mixed",
    score: createScoreBreakdown(input.score),
    reasonsFor: input.reasonsFor ?? [],
    reasonsAgainst: input.reasonsAgainst ?? [],
    metrics: input.metrics ?? {},
    tradePlans: input.tradePlans ?? [],
    triggerId: input.triggerId ?? null,
  };
}

function createTrigger(input) {
  return {
    id: input.id ?? uid("trigger"),
    candidateId: input.candidateId,
    pair: input.pair,
    direction: input.direction,
    style: input.style,
    status: input.status ?? TriggerStatus.WAITING,
    triggerType: input.triggerType,
    timeframe: input.timeframe,
    createdAt: input.createdAt ?? nowIso(),
    expiresAt: input.expiresAt ?? null,
    checklist: input.checklist ?? [],
    entryZone: input.entryZone ?? null,
    invalidation: input.invalidation ?? null,
    lastCheck: input.lastCheck ?? null,
  };
}

function createPaperTrade(input) {
  return {
    id: input.id ?? uid("paper"),
    candidateId: input.candidateId,
    triggerId: input.triggerId,
    pair: input.pair,
    direction: input.direction,
    style: input.style,
    status: input.status ?? PaperTradeStatus.WAITING_TRIGGER,
    setupType: input.setupType,
    triggerType: input.triggerType,
    margin: input.margin ?? 10,
    leverage: input.leverage ?? 10,
    plannedEntry: input.plannedEntry ?? null,
    entryZone: input.entryZone ?? null,
    entry: input.entry ?? null,
    live: input.live ?? null,
    stop: input.stop ?? null,
    targets: input.targets ?? [],
    tpHits: input.tpHits ?? [],
    pnl: input.pnl ?? 0,
    resultPct: input.resultPct ?? 0,
    leveragedPct: input.leveragedPct ?? 0,
    maxFavorablePct: input.maxFavorablePct ?? 0,
    maxAdversePct: input.maxAdversePct ?? 0,
    openedAt: input.openedAt ?? null,
    closedAt: input.closedAt ?? null,
    exitPrice: input.exitPrice ?? null,
    exitReason: input.exitReason ?? null,
  };
}

function createJournalEntry(input) {
  return {
    id: input.id ?? uid("journal"),
    paperTradeId: input.paperTradeId,
    pair: input.pair,
    direction: input.direction,
    style: input.style,
    setupType: input.setupType,
    triggerType: input.triggerType,
    marketRegime: input.marketRegime,
    entry: input.entry,
    exit: input.exit,
    resultPct: input.resultPct,
    leveragedPct: input.leveragedPct,
    score: input.score,
    exitReason: input.exitReason,
    failureReason: input.failureReason ?? null,
    createdAt: input.createdAt ?? nowIso(),
  };
}

function createRealTrade(input) {
  return {
    id: input.id ?? uid("real"),
    pair: input.pair,
    direction: input.direction,
    status: input.status ?? RealTradeStatus.OPEN,
    style: input.style ?? TradeStyle.INTRADAY,
    entry: input.entry,
    live: input.live ?? null,
    margin: input.margin ?? 10,
    leverage: input.leverage ?? 10,
    stop: input.stop,
    target: input.target,
    createdAt: input.createdAt ?? nowIso(),
    closedAt: input.closedAt ?? null,
    note: input.note ?? "",
  };
}

function mockTradePlans(pair, direction) {
  const base = {
    SOLUSDT: 142.2,
    APTUSDT: 8.64,
    NEARUSDT: 7.18,
    WLDUSDT: 0.256,
    RAVEUSDT: 0.7345,
    SUIUSDT: 3.42,
  }[pair] ?? 1;
  const sign = direction === Direction.LONG ? 1 : -1;
  return [
    createTradePlan({
      style: TradeStyle.SCALP,
      direction,
      entry: base,
      stop: base * (1 - sign * 0.006),
      target1: base * (1 + sign * 0.008),
      target2: base * (1 + sign * 0.013),
      invalidation: "Strata 15m trigger sviečky.",
      note: "Rýchly výstup, nečakať swing reakciu.",
    }),
    createTradePlan({
      style: TradeStyle.INTRADAY,
      direction,
      entry: base,
      stop: base * (1 - sign * 0.012),
      target1: base * (1 + sign * 0.018),
      target2: base * (1 + sign * 0.03),
      invalidation: "Close späť pod/nad VWAP.",
      note: "Primárny plán pre 15m/1h.",
    }),
    createTradePlan({
      style: TradeStyle.SWING,
      direction,
      entry: base * (1 - sign * 0.004),
      stop: base * (1 - sign * 0.045),
      target1: base * (1 + sign * 0.065),
      target2: base * (1 + sign * 0.105),
      invalidation: "4h štruktúra stratí higher low / lower high.",
      note: "Samostatný 4h scenár, nie škálovanie intraday TP.",
    }),
  ];
}

const mockCandidates = [
  createCandidate({
    pair: "SOLUSDT",
    direction: Direction.LONG,
    style: TradeStyle.INTRADAY,
    state: CandidateState.ARMED,
    setupType: "VWAP reclaim",
    timeframe: "1h",
    marketRegime: "risk_on",
    score: { market: 74, coin: 82, setup: 79, trigger: 68, risk: 76, edge: 41, final: 82 },
    reasonsFor: ["BTC podporuje risk", "Cena reclaimuje VWAP", "Volume rastie"],
    reasonsAgainst: ["4h rezistencia je blízko", "Funding mierne crowded"],
    metrics: { vwap: "above", oi: "rising", funding: "0.012%", volumeRatio: "1.4x", atrPct: "0.82%" },
    tradePlans: mockTradePlans("SOLUSDT", Direction.LONG),
  }),
  createCandidate({
    pair: "APTUSDT",
    direction: Direction.SHORT,
    style: TradeStyle.INTRADAY,
    state: CandidateState.FORMING,
    setupType: "Range high rejection",
    timeframe: "1h",
    score: { market: 62, coin: 78, setup: 72, trigger: 44, risk: 67, edge: 32, final: 78 },
    reasonsFor: ["Blízko rezistencie", "Room na short"],
    reasonsAgainst: ["BTC nie je bearish", "Trigger ešte nepotvrdený"],
    tradePlans: mockTradePlans("APTUSDT", Direction.SHORT),
  }),
  createCandidate({
    pair: "SUIUSDT",
    direction: Direction.LONG,
    style: TradeStyle.SCALP,
    state: CandidateState.TRIGGERED,
    setupType: "EMA reclaim",
    timeframe: "15m",
    score: { market: 77, coin: 86, setup: 81, trigger: 82, risk: 80, edge: 48, final: 86 },
    reasonsFor: ["EMA reclaim potvrdený", "Volume expansion"],
    reasonsAgainst: ["Rýchly scalp, nepreháňať target"],
    tradePlans: mockTradePlans("SUIUSDT", Direction.LONG),
  }),
  createCandidate({
    pair: "WLDUSDT",
    direction: Direction.LONG,
    style: TradeStyle.INTRADAY,
    state: CandidateState.REJECTED,
    setupType: "Trend continuation",
    timeframe: "1h",
    score: { market: 58, coin: 79, setup: 63, trigger: 18, risk: 42, edge: 21, final: 54 },
    reasonsFor: ["Trend stále drží"],
    reasonsAgainst: ["Chase nad VWAP", "Trigger slabý", "Risk/reward zlý"],
    tradePlans: mockTradePlans("WLDUSDT", Direction.LONG),
  }),
];

const mockTriggers = [
  createTrigger({
    candidateId: mockCandidates[0].id,
    pair: "SOLUSDT",
    direction: Direction.LONG,
    style: TradeStyle.INTRADAY,
    status: TriggerStatus.ARMED,
    triggerType: "VWAP close reclaim",
    timeframe: "15m",
    checklist: [
      { label: "Cena je v entry zóne", status: "done" },
      { label: "1h bias súhlasí", status: "done" },
      { label: "Close nad VWAP", status: "pending" },
      { label: "Volume nad 1.2x", status: "pending" },
      { label: "Extension pod 1.8 ATR", status: "done" },
    ],
    entryZone: { from: 141.8, to: 142.4 },
    invalidation: "15m close späť pod VWAP.",
  }),
];

const mockPaperTrades = [
  createPaperTrade({
    candidateId: mockCandidates[0].id,
    triggerId: mockTriggers[0].id,
    pair: "SOLUSDT",
    direction: Direction.LONG,
    style: TradeStyle.INTRADAY,
    status: PaperTradeStatus.ACTIVE,
    setupType: "VWAP reclaim",
    triggerType: "VWAP close reclaim",
    entry: 142.2,
    live: 143.1,
    stop: 140.8,
    targets: mockCandidates[0].tradePlans[1].targets,
    tpHits: [mockCandidates[0].tradePlans[1].targets[0].id],
    resultPct: 0.63,
    leveragedPct: 6.3,
    openedAt: nowIso(),
  }),
];

const mockJournal = [
  createJournalEntry({
    paperTradeId: "paper-closed-wld",
    pair: "WLDUSDT",
    direction: Direction.LONG,
    style: TradeStyle.INTRADAY,
    setupType: "Pullback retest",
    triggerType: "Weak retest",
    marketRegime: "mixed",
    entry: 0.256,
    exit: 0.2548,
    resultPct: -0.47,
    leveragedPct: -4.7,
    score: 78,
    exitReason: "SL",
    failureReason: "BTC weakness + weak trigger",
  }),
];

window.CockpitModels = {
  MODEL_VERSION,
  CandidateState,
  TradeStyle,
  Direction,
  TriggerStatus,
  PaperTradeStatus,
  RealTradeStatus,
  createCandidate,
  createTrigger,
  createPaperTrade,
  createJournalEntry,
  createRealTrade,
  mockCandidates,
  mockTriggers,
  mockPaperTrades,
  mockJournal,
};
