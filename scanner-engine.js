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
  const oiScore = oiConfirmationScore(analysis);
  const coin = clampScore(
    38 +
    (analysis.emaAligned ? 14 : 0) +
    (analysis.volumeRatio >= profile.volumeNeed ? 10 : -8) +
    (analysis.adx >= profile.adxNeed ? 8 : -4) +
    (analysis.btcAligned ? 8 : -8) +
    (room >= profile.roomNeed ? 10 : -12) +
    (Math.abs(analysis.funding) < 0.04 ? 5 : -6) +
    oiScore.coin
  );
  const setup = clampScore(
    35 +
    (setupType !== SetupType.NO_TRADE ? 22 : -12) +
    (analysis.vwapDistanceAtr <= profile.maxVwapAtr ? 12 : analysis.vwapDistanceAtr <= profile.softVwapAtr ? 2 : -18) +
    (analysis.volumeRatio >= profile.volumeNeed ? 8 : 0) +
    (room >= profile.roomNeed * 1.25 ? 8 : 0) +
    oiScore.setup
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
    Math.max(0, analysis.vwapDistanceAtr - profile.softVwapAtr) * 12 +
    oiScore.risk
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

function oiConfirmationScore(analysis) {
  if (!analysis.oiAvailable) return { coin: -4, setup: -3, risk: -4 };
  if (analysis.oiLabel === "rising") return { coin: 6, setup: 4, risk: 0 };
  if (analysis.oiLabel === "falling") return { coin: -3, setup: -2, risk: -2 };
  if (analysis.oiLabel === "current only") return { coin: 0, setup: 0, risk: -1 };
  return { coin: 1, setup: 0, risk: 0 };
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
  if (analysis.oiAvailable && analysis.oiLabel === "rising") reasons.push(`OI rising ${analysis.oiChange.toFixed(2)}%`);
  if (analysis.emaAligned) reasons.push("EMA kontext je zarovnaný");
  if (setupType !== SetupType.NO_TRADE) reasons.push(setupType);
  return reasons;
}

function reasonsAgainst(analysis) {
  const reasons = [];
  if (analysis.vwapDistanceAtr > 1.8) reasons.push("Cena je ďaleko od VWAP");
  if (Math.abs(analysis.funding) > 0.04) reasons.push("Funding je crowded");
  if (!analysis.oiAvailable) reasons.push("OI dáta chýbajú");
  if (analysis.oiAvailable && analysis.oiLabel === "falling") reasons.push(`OI falling ${analysis.oiChange.toFixed(2)}%`);
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
    tradePlans: tradePlansFromAnalysis(analysis, direction, style),
  });
}

function tradePlansFromAnalysis(analysis, direction, style = TradeStyle.INTRADAY) {
  const base = Number(analysis.price);
  if (!Number.isFinite(base) || base <= 0) return mockTradePlans(analysis.pair, direction);
  const sign = direction === Direction.LONG ? 1 : -1;
  const atrPct = Math.max(Number(analysis.atrPct) || 0.8, 0.25) / 100;
  const atrAbs = Number.isFinite(analysis.atr) && analysis.atr > 0 ? analysis.atr : base * atrPct;
  const vwap = finiteOr(analysis.vwap, base);
  const support = finiteOr(analysis.support, base - atrAbs * 2);
  const resistance = finiteOr(analysis.resistance, base + atrAbs * 2);
  const levels = {
    ma7: finiteOr(analysis.ma7, base),
    ma25: finiteOr(analysis.ma25, vwap),
    ma99: finiteOr(analysis.ma99, direction === Direction.LONG ? support : resistance),
    ma200: finiteOr(analysis.ma200, direction === Direction.LONG ? support : resistance),
    vwap,
    support,
    resistance,
    highs: Array.isArray(analysis.swingHighs) ? analysis.swingHighs : [],
    lows: Array.isArray(analysis.swingLows) ? analysis.swingLows : [],
  };
  const plan = (style, zone, stop, targets, note, invalidation, scenario) => {
    const entry = midpoint(zone.from, zone.to);
    return createTradePlan({
      style,
      direction,
      entry,
      entryFrom: zone.from,
      entryTo: zone.to,
      stop: Math.max(0, stop),
      target1: Math.max(0, targets[0]),
      target2: Math.max(0, targets[1]),
      target3: Math.max(0, targets[2]),
      invalidation,
      note,
      scenario,
    });
  };

  const selectedStyle = [TradeStyle.SCALP, TradeStyle.INTRADAY, TradeStyle.SWING].includes(style) ? style : TradeStyle.INTRADAY;
  const zone = entryZoneForStyle(selectedStyle, direction, base, atrAbs, levels);
  const stopBuffer = {
    [TradeStyle.SCALP]: 0.65,
    [TradeStyle.INTRADAY]: 0.95,
    [TradeStyle.SWING]: 1.6,
  }[selectedStyle];
  const fallbackR = {
    [TradeStyle.SCALP]: [1.15, 1.8, 2.4],
    [TradeStyle.INTRADAY]: [1.6, 2.5, 3.4],
    [TradeStyle.SWING]: [2.0, 3.4, 4.8],
  }[selectedStyle];
  const note = {
    [TradeStyle.SCALP]: "15m MA7/MA25 alebo VWAP retest zóna.",
    [TradeStyle.INTRADAY]: "1h pullback k MA25/VWAP/support zóne.",
    [TradeStyle.SWING]: "4h štrukturálna zóna pri MA99/MA200 alebo hlbšom supporte/rezistencii.",
  }[selectedStyle];
  const invalidation = {
    [TradeStyle.SCALP]: "Strata 15m trigger zóny alebo rýchle odmietnutie späť proti smeru.",
    [TradeStyle.INTRADAY]: "Close späť cez invalidáciu zóny alebo strata vyššieho low/lower high.",
    [TradeStyle.SWING]: "4h štruktúra stratí trendový kontext.",
  }[selectedStyle];
  const scenario = {
    [TradeStyle.SCALP]: "Scalp pullback/retest",
    [TradeStyle.INTRADAY]: "Intraday pullback scenario",
    [TradeStyle.SWING]: "Swing structure scenario",
  }[selectedStyle];
  const stop = stopForZone(zone, direction, atrAbs, stopBuffer);
  return [
    plan(
      selectedStyle,
      zone,
      stop,
      targetsFromLevels(midpoint(zone.from, zone.to), stop, direction, atrAbs, levels, fallbackR),
      note,
      invalidation,
      scenario
    ),
  ];
}

function finiteOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function midpoint(from, to) {
  return (from + to) / 2;
}

function normalizeZone(a, b) {
  return { from: Math.min(a, b), to: Math.max(a, b) };
}

function entryZoneForStyle(style, direction, price, atr, levels) {
  const width = {
    [TradeStyle.SCALP]: 0.25,
    [TradeStyle.INTRADAY]: 0.55,
    [TradeStyle.SWING]: 0.95,
  }[style] * atr;

  const anchor = zoneAnchor(style, direction, price, atr, levels);
  return normalizeZone(anchor - width, anchor + width);
}

function sideSortedLevels(direction, price, levels) {
  const below = (value) => Number.isFinite(value) && value < price;
  const above = (value) => Number.isFinite(value) && value > price;
  const sideFilter = direction === Direction.LONG ? below : above;
  return (direction === Direction.LONG ? levels.lows : levels.highs)
    .filter(sideFilter)
    .sort((a, b) => direction === Direction.LONG ? b - a : a - b);
}

function zoneAnchor(style, direction, price, atr, levels) {
  const below = (value) => Number.isFinite(value) && value < price;
  const above = (value) => Number.isFinite(value) && value > price;
  const sideFilter = direction === Direction.LONG ? below : above;
  const sideLevels = sideSortedLevels(direction, price, levels);
  const sign = direction === Direction.LONG ? -1 : 1;
  const fallback = (multiple) => price + sign * atr * multiple;

  if (style === TradeStyle.SCALP) {
    return nearestAnchor([levels.ma7, levels.ma25, levels.vwap, sideLevels[0]].filter(sideFilter), price, fallback(0.45));
  }

  if (style === TradeStyle.INTRADAY) {
    const candidates = [sideLevels[0], levels.ma25, levels.vwap, direction === Direction.LONG ? levels.support : levels.resistance].filter(sideFilter);
    return anchorAtLeastDistance(candidates, price, atr * 1.15, fallback(1.35), direction);
  }

  const candidates = [levels.ma99, levels.ma200, sideLevels[1], sideLevels[2], direction === Direction.LONG ? levels.support : levels.resistance].filter(sideFilter);
  return anchorAtLeastDistance(candidates, price, atr * 2.4, fallback(3.2), direction);
}

function nearestAnchor(values, price, fallback) {
  if (!values.length) return fallback;
  return values.sort((a, b) => Math.abs(a - price) - Math.abs(b - price))[0];
}

function anchorAtLeastDistance(values, price, minDistance, fallback, direction) {
  if (!values.length) return fallback;
  const sorted = values.sort((a, b) => Math.abs(a - price) - Math.abs(b - price));
  const qualified = sorted.find((value) => Math.abs(value - price) >= minDistance);
  if (qualified) return qualified;
  const extreme = direction === Direction.LONG ? Math.min(...values) : Math.max(...values);
  return Math.abs(extreme - price) > Math.abs(fallback - price) * 0.7 ? extreme : fallback;
}

function stopForZone(zone, direction, atr, buffer) {
  return direction === Direction.LONG ? zone.from - atr * buffer : zone.to + atr * buffer;
}

function targetsFromLevels(entry, stop, direction, atr, levels, rFallbacks) {
  const risk = Math.max(Math.abs(entry - stop), atr * 0.5);
  const minTargetDistance = risk * (rFallbacks[0] > 1.8 ? 1.25 : rFallbacks[0] > 1.4 ? 0.95 : 0.65);
  const structural = (direction === Direction.LONG ? levels.highs.concat(levels.resistance) : levels.lows.concat(levels.support))
    .filter((level) => Number.isFinite(level) && (direction === Direction.LONG ? level > entry : level < entry))
    .sort((a, b) => direction === Direction.LONG ? a - b : b - a);
  const targets = [];
  structural.forEach((level) => {
    if (targets.length >= 3) return;
    const farEnough = Math.abs(level - entry) >= minTargetDistance;
    const distinct = targets.every((target) => Math.abs(target - level) > atr * 0.35);
    if (farEnough && distinct) targets.push(level);
  });
  rFallbacks.forEach((r) => {
    if (targets.length >= 3) return;
    targets.push(entry + (direction === Direction.LONG ? 1 : -1) * risk * r);
  });
  return targets.slice(0, 3);
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
