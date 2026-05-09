const SetupType = Object.freeze({
  VWAP_RECLAIM: "VWAP reclaim",
  VWAP_REJECT: "VWAP reject",
  PULLBACK_RETEST: "Pullback retest",
  RANGE_BOUNCE: "Range bounce",
  RANGE_REJECTION: "Range rejection",
  TREND_CONTINUATION: "Trend continuation",
  SQUEEZE_RISK: "Squeeze risk",
  NO_TRADE: "No trade",
});

function mockCoinAnalysis(input) {
  return {
    pair: input.pair,
    price: input.price,
    directionBias: input.directionBias,
    timeframe: input.timeframe ?? "1h",
    aboveVwap: input.aboveVwap ?? true,
    vwapDistanceAtr: input.vwapDistanceAtr ?? 0.7,
    emaAligned: input.emaAligned ?? true,
    rsi: input.rsi ?? 56,
    macd: input.macd ?? 0.01,
    adx: input.adx ?? 22,
    atrPct: input.atrPct ?? 0.8,
    volumeRatio: input.volumeRatio ?? 1.2,
    oiLabel: input.oiLabel ?? "rising",
    oiChange: input.oiChange ?? 0.8,
    funding: input.funding ?? 0.012,
    spread: input.spread ?? 0.025,
    roomLongAtr: input.roomLongAtr ?? 1.8,
    roomShortAtr: input.roomShortAtr ?? 1.4,
    nearSupport: input.nearSupport ?? false,
    nearResistance: input.nearResistance ?? false,
    btcAligned: input.btcAligned ?? true,
  };
}

const mockCoinUniverse = [
  mockCoinAnalysis({ pair: "SOLUSDT", price: 142.2, directionBias: "long", aboveVwap: true, vwapDistanceAtr: 0.6, emaAligned: true, volumeRatio: 1.4, roomLongAtr: 2.1, btcAligned: true }),
  mockCoinAnalysis({ pair: "APTUSDT", price: 8.64, directionBias: "short", aboveVwap: false, vwapDistanceAtr: 0.9, emaAligned: false, volumeRatio: 1.1, roomShortAtr: 1.9, nearResistance: true, btcAligned: false }),
  mockCoinAnalysis({ pair: "NEARUSDT", price: 7.18, directionBias: "long", aboveVwap: true, vwapDistanceAtr: 1.4, emaAligned: true, volumeRatio: 0.9, roomLongAtr: 1.5, nearSupport: true }),
  mockCoinAnalysis({ pair: "WLDUSDT", price: 0.256, directionBias: "long", aboveVwap: true, vwapDistanceAtr: 2.4, emaAligned: true, volumeRatio: 1.7, roomLongAtr: 0.8, funding: 0.045 }),
  mockCoinAnalysis({ pair: "RAVEUSDT", price: 0.7345, directionBias: "short", aboveVwap: false, vwapDistanceAtr: 3.1, emaAligned: false, volumeRatio: 2.3, roomShortAtr: 3.8, spread: 0.12, funding: -0.055 }),
  mockCoinAnalysis({ pair: "SUIUSDT", price: 3.42, directionBias: "long", aboveVwap: true, vwapDistanceAtr: 0.3, emaAligned: true, volumeRatio: 1.8, roomLongAtr: 2.5, btcAligned: true, adx: 29 }),
];

function classifySetup(analysis) {
  if (analysis.vwapDistanceAtr > 2.3 && analysis.volumeRatio > 1.5) return SetupType.SQUEEZE_RISK;
  if (analysis.directionBias === "long" && analysis.aboveVwap && analysis.vwapDistanceAtr <= 1) return SetupType.VWAP_RECLAIM;
  if (analysis.directionBias === "short" && !analysis.aboveVwap && analysis.vwapDistanceAtr <= 1) return SetupType.VWAP_REJECT;
  if (analysis.nearSupport && analysis.directionBias === "long") return SetupType.PULLBACK_RETEST;
  if (analysis.nearResistance && analysis.directionBias === "short") return SetupType.RANGE_REJECTION;
  if (analysis.emaAligned && analysis.adx >= 24) return SetupType.TREND_CONTINUATION;
  return SetupType.NO_TRADE;
}

function styleProfile(style) {
  return {
    [TradeStyle.SCALP]: {
      maxVwapAtr: 0.95,
      softVwapAtr: 1.35,
      volumeNeed: 1.25,
      roomNeed: 0.9,
      adxNeed: 14,
      spreadLimit: 0.05,
      weights: { coin: 0.22, setup: 0.26, trigger: 0.34, risk: 0.14, edge: 0.04 },
    },
    [TradeStyle.INTRADAY]: {
      maxVwapAtr: 1.25,
      softVwapAtr: 1.85,
      volumeNeed: 1.05,
      roomNeed: 1.5,
      adxNeed: 18,
      spreadLimit: 0.08,
      weights: { coin: 0.34, setup: 0.28, trigger: 0.20, risk: 0.13, edge: 0.05 },
    },
    [TradeStyle.SWING]: {
      maxVwapAtr: 1.8,
      softVwapAtr: 2.4,
      volumeNeed: 0.85,
      roomNeed: 2.4,
      adxNeed: 22,
      spreadLimit: 0.12,
      weights: { coin: 0.42, setup: 0.22, trigger: 0.10, risk: 0.16, edge: 0.10 },
    },
  }[style] || {
    maxVwapAtr: 1.25,
    softVwapAtr: 1.85,
    volumeNeed: 1.05,
    roomNeed: 1.5,
    adxNeed: 18,
    spreadLimit: 0.08,
    weights: { coin: 0.34, setup: 0.28, trigger: 0.20, risk: 0.13, edge: 0.05 },
  };
}

function scoreCoin(analysis, regime, style = TradeStyle.INTRADAY) {
  const profile = styleProfile(style);
  const direction = analysis.directionBias === "short" ? Direction.SHORT : Direction.LONG;
  const room = direction === Direction.LONG ? analysis.roomLongAtr : analysis.roomShortAtr;
  const setupType = classifySetup(analysis);
  const coin = clampScore(
    38 +
    (analysis.emaAligned ? 14 : 0) +
    (analysis.volumeRatio >= profile.volumeNeed ? 10 : -8) +
    (analysis.adx >= profile.adxNeed ? 8 : -4) +
    (analysis.btcAligned ? 8 : -8) +
    (room >= profile.roomNeed ? 10 : -12) +
    (Math.abs(analysis.funding) < 0.04 ? 5 : -6)
  );
  const setup = clampScore(
    35 +
    (setupType !== SetupType.NO_TRADE ? 22 : -12) +
    (analysis.vwapDistanceAtr <= profile.maxVwapAtr ? 12 : analysis.vwapDistanceAtr <= profile.softVwapAtr ? 2 : -18) +
    (analysis.volumeRatio >= profile.volumeNeed ? 8 : 0) +
    (room >= profile.roomNeed * 1.25 ? 8 : 0)
  );
  const trigger = clampScore(
    20 +
    (analysis.vwapDistanceAtr <= profile.maxVwapAtr * 0.75 ? 22 : analysis.vwapDistanceAtr <= profile.maxVwapAtr ? 10 : -8) +
    (analysis.volumeRatio >= profile.volumeNeed ? 14 : 0) +
    (analysis.btcAligned ? 10 : -8) +
    (setupType === SetupType.SQUEEZE_RISK ? -20 : 0)
  );
  const risk = clampScore(
    82 -
    Math.abs(analysis.funding) * 240 -
    Math.max(0, analysis.spread - profile.spreadLimit) * 260 -
    Math.max(0, analysis.vwapDistanceAtr - profile.softVwapAtr) * 12
  );
  const edge = clampScore(Math.abs(coin - 50) + (setupType !== SetupType.NO_TRADE ? 18 : 0));
  const final = clampScore(
    coin * profile.weights.coin +
    setup * profile.weights.setup +
    trigger * profile.weights.trigger +
    risk * profile.weights.risk +
    edge * profile.weights.edge
  );
  const candidateShell = { direction, score: { final }, state: trigger >= 75 ? "triggered" : trigger >= 55 ? "armed" : trigger >= 35 ? "forming" : "watch" };
  const regimePenalty = window.CockpitMarketRegime.regimePenaltyForCandidate(regime, candidateShell);
  return { market: regime.score, coin, setup, trigger, risk, edge, conflictPenalty: 0, final: clampScore(final - regimePenalty) };
}

function candidateStateFromScores(score, setupType) {
  if (setupType === SetupType.SQUEEZE_RISK || setupType === SetupType.NO_TRADE) return CandidateState.REJECTED;
  if (score.trigger >= 78) return CandidateState.TRIGGERED;
  if (score.trigger >= 58 && score.final >= 70) return CandidateState.ARMED;
  if (score.trigger >= 35) return CandidateState.FORMING;
  return CandidateState.WATCH;
}

function reasonsFor(analysis, setupType) {
  const reasons = [];
  if (analysis.btcAligned) reasons.push("BTC režim súhlasí so smerom");
  if (analysis.volumeRatio >= 1.2) reasons.push(`Volume ${analysis.volumeRatio.toFixed(1)}x`);
  if (analysis.emaAligned) reasons.push("EMA kontext je zarovnaný");
  if (setupType !== SetupType.NO_TRADE) reasons.push(setupType);
  return reasons;
}

function reasonsAgainst(analysis) {
  const reasons = [];
  if (analysis.vwapDistanceAtr > 1.8) reasons.push("Cena je ďaleko od VWAP");
  if (Math.abs(analysis.funding) > 0.04) reasons.push("Funding je crowded");
  if (analysis.spread > 0.08) reasons.push("Spread zhoršuje exekúciu");
  if (!analysis.btcAligned) reasons.push("BTC nesúhlasí so smerom");
  if ((analysis.directionBias === "long" ? analysis.roomLongAtr : analysis.roomShortAtr) < 1.2) reasons.push("Málo priestoru k targetu");
  return reasons;
}

function buildCandidateFromAnalysis(analysis, regime, style = TradeStyle.INTRADAY) {
  const direction = analysis.directionBias === "short" ? Direction.SHORT : Direction.LONG;
  const setupType = classifySetup(analysis);
  const score = scoreCoin(analysis, regime, style);
  return createCandidate({
    pair: analysis.pair,
    direction,
    style,
    state: candidateStateFromScores(score, setupType),
    setupType,
    timeframe: analysis.timeframe,
    marketRegime: regime.type,
    score,
    reasonsFor: reasonsFor(analysis, setupType),
    reasonsAgainst: reasonsAgainst(analysis),
    metrics: analysis,
    tradePlans: tradePlansFromAnalysis(analysis, direction),
  });
}

function tradePlansFromAnalysis(analysis, direction) {
  const base = Number(analysis.price);
  if (!Number.isFinite(base) || base <= 0) return mockTradePlans(analysis.pair, direction);
  const sign = direction === Direction.LONG ? 1 : -1;
  const atrPct = Math.max(Number(analysis.atrPct) || 0.8, 0.25) / 100;
  const scalpRisk = Math.max(atrPct * 0.65, 0.0035);
  const intraRisk = Math.max(atrPct * 1.15, 0.0075);
  const swingRisk = Math.max(atrPct * 3.2, 0.028);
  const plan = (style, risk, r1, r2, note, invalidation) => createTradePlan({
    style,
    direction,
    entry: base,
    stop: base * (1 - sign * risk),
    target1: base * (1 + sign * risk * r1),
    target2: base * (1 + sign * risk * r2),
    invalidation,
    note,
  });
  return [
    plan(TradeStyle.SCALP, scalpRisk, 1.1, 1.6, "Rýchly plán podľa lokálnej volatility.", "Strata 5m trigger sviečky."),
    plan(TradeStyle.INTRADAY, intraRisk, 1.5, 2.4, "Primárny plán podľa 15m/1h volatility.", "Close späť cez VWAP alebo invalidácia štruktúry."),
    plan(TradeStyle.SWING, swingRisk, 1.8, 3.0, "Samostatný 4h scenár, nie škálovanie intraday TP.", "4h štruktúra stratí trendový kontext."),
  ];
}

function runMockScanner(regime = window.CockpitMarketRegime.mockMarketRegime, style = TradeStyle.INTRADAY) {
  const analyses = window.CockpitCoinAnalysis?.buildCoinAnalyses(mockCoinUniverse) ?? mockCoinUniverse;
  return runScannerFromAnalyses(analyses, regime, style);
}

function runScannerFromAnalyses(analyses, regime = window.CockpitMarketRegime.mockMarketRegime, style = TradeStyle.INTRADAY) {
  return analyses
    .map((analysis) => buildCandidateFromAnalysis(analysis, regime, style))
    .sort((a, b) => b.score.final - a.score.final);
}

window.CockpitScanner = {
  SetupType,
  mockCoinUniverse,
  classifySetup,
  scoreCoin,
  styleProfile,
  buildCandidateFromAnalysis,
  tradePlansFromAnalysis,
  runScannerFromAnalyses,
  runMockScanner,
};
