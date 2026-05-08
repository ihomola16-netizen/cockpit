function analyzeMockCoin(raw) {
  const directionBias = raw.directionBias ?? (raw.aboveVwap ? Direction.LONG : Direction.SHORT);
  const roomLongAtr = raw.roomLongAtr ?? 1.5;
  const roomShortAtr = raw.roomShortAtr ?? 1.5;
  const extensionRisk = raw.vwapDistanceAtr > 2 ? "high" : raw.vwapDistanceAtr > 1.3 ? "medium" : "low";
  const liquidityRisk = raw.spread > 0.08 ? "high" : raw.spread > 0.04 ? "medium" : "low";
  const crowdedRisk = Math.abs(raw.funding) > 0.05 ? "high" : Math.abs(raw.funding) > 0.03 ? "medium" : "low";
  const room = directionBias === Direction.LONG ? roomLongAtr : roomShortAtr;

  return {
    ...raw,
    directionBias,
    qualityFlags: {
      trendAligned: Boolean(raw.emaAligned),
      volumeConfirmed: raw.volumeRatio >= 1.2,
      btcAligned: Boolean(raw.btcAligned),
      hasRoom: room >= 1.5,
      notChase: raw.vwapDistanceAtr <= 1.8,
    },
    risks: {
      extension: extensionRisk,
      liquidity: liquidityRisk,
      crowded: crowdedRisk,
    },
    normalized: {
      room,
      fundingAbs: Math.abs(raw.funding),
      trendStrength: raw.adx,
      executionQuality: Math.max(0, 100 - raw.spread * 500),
    },
  };
}

function buildCoinAnalyses(universe = window.CockpitScanner.mockCoinUniverse) {
  return universe.map(analyzeMockCoin);
}

function coinAnalysisSummary(analysis) {
  const flags = analysis.qualityFlags;
  const positives = [
    flags.trendAligned ? "trend aligned" : null,
    flags.volumeConfirmed ? "volume confirmed" : null,
    flags.btcAligned ? "BTC aligned" : null,
    flags.hasRoom ? "enough room" : null,
    flags.notChase ? "not chase" : null,
  ].filter(Boolean);
  const risks = Object.entries(analysis.risks)
    .filter(([, value]) => value !== "low")
    .map(([key, value]) => `${key}: ${value}`);
  return {
    positives,
    risks,
    text: `${analysis.pair}: ${positives.join(", ") || "few positives"}. ${risks.length ? `Risks: ${risks.join(", ")}.` : "Risks are acceptable."}`,
  };
}

function selectedCoinAnalysis(pair, analyses = buildCoinAnalyses()) {
  return analyses.find((analysis) => analysis.pair === pair) || analyses[0];
}

window.CockpitCoinAnalysis = {
  analyzeMockCoin,
  buildCoinAnalyses,
  coinAnalysisSummary,
  selectedCoinAnalysis,
};
