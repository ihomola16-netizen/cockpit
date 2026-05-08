const RegimeType = Object.freeze({
  RISK_ON: "risk_on",
  MIXED: "mixed",
  RISK_OFF: "risk_off",
  CHOP: "chop",
});

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function createMarketInput(input = {}) {
  return {
    btcBias1h: input.btcBias1h ?? "bullish",
    btcBias4h: input.btcBias4h ?? "bullish",
    ethBias1h: input.ethBias1h ?? "mixed",
    ethBias4h: input.ethBias4h ?? "bullish",
    btcAboveVwap: input.btcAboveVwap ?? true,
    ethAboveVwap: input.ethAboveVwap ?? true,
    btcTrendStrength: input.btcTrendStrength ?? 64,
    ethTrendStrength: input.ethTrendStrength ?? 51,
    avgFunding: input.avgFunding ?? 0.012,
    oiChange: input.oiChange ?? 0.8,
    volatility: input.volatility ?? "normal",
    altBreadth: input.altBreadth ?? 61,
  };
}

function biasScore(bias) {
  if (bias === "bullish") return 1;
  if (bias === "bearish") return -1;
  return 0;
}

function classifyRegime(score, input) {
  if (input.volatility === "dead" || input.altBreadth < 35) return RegimeType.CHOP;
  if (score >= 68) return RegimeType.RISK_ON;
  if (score <= 34) return RegimeType.RISK_OFF;
  return RegimeType.MIXED;
}

function regimeLabel(type) {
  return {
    [RegimeType.RISK_ON]: "Risk On",
    [RegimeType.MIXED]: "Mixed",
    [RegimeType.RISK_OFF]: "Risk Off",
    [RegimeType.CHOP]: "Chop / No Trade",
  }[type] || "Mixed";
}

function regimeTone(type) {
  return {
    [RegimeType.RISK_ON]: "good",
    [RegimeType.MIXED]: "warn",
    [RegimeType.RISK_OFF]: "bad",
    [RegimeType.CHOP]: "neutral",
  }[type] || "neutral";
}

function regimeAdvice(type) {
  return {
    [RegimeType.RISK_ON]: "Trh povoľuje risk, ale vstupy musia ísť cez trigger. Long kandidáti majú miernu výhodu.",
    [RegimeType.MIXED]: "Trh je zmiešaný. Obchodovať len čisté setupy pri hranách range, nie stred pohybu.",
    [RegimeType.RISK_OFF]: "Trh je defenzívny. Longy penalizovať, shorty vyžadujú potvrdenie a dobrý risk.",
    [RegimeType.CHOP]: "Režim je chop alebo nízka kvalita. Scanner má skôr tvoriť watchlist než obchody.",
  }[type] || "";
}

function evaluateMarketRegime(rawInput = {}) {
  const input = createMarketInput(rawInput);
  const btcAlignment = biasScore(input.btcBias1h) + biasScore(input.btcBias4h);
  const ethAlignment = biasScore(input.ethBias1h) + biasScore(input.ethBias4h);
  const trendComponent = 50 + btcAlignment * 10 + ethAlignment * 6;
  const vwapComponent = (input.btcAboveVwap ? 8 : -8) + (input.ethAboveVwap ? 5 : -5);
  const strengthComponent = ((input.btcTrendStrength + input.ethTrendStrength) / 2 - 50) * 0.35;
  const breadthComponent = (input.altBreadth - 50) * 0.32;
  const fundingPenalty = Math.abs(input.avgFunding) > 0.05 ? 10 : Math.abs(input.avgFunding) > 0.03 ? 5 : 0;
  const oiComponent = input.oiChange > 0 ? Math.min(input.oiChange * 3, 8) : Math.max(input.oiChange * 2, -8);
  const volatilityPenalty = input.volatility === "extreme" ? 8 : input.volatility === "dead" ? 12 : 0;
  const score = clampScore(trendComponent + vwapComponent + strengthComponent + breadthComponent + oiComponent - fundingPenalty - volatilityPenalty);
  const type = classifyRegime(score, input);

  return {
    type,
    label: regimeLabel(type),
    tone: regimeTone(type),
    score,
    advice: regimeAdvice(type),
    components: {
      btc: `${input.btcBias1h}/${input.btcBias4h}`,
      eth: `${input.ethBias1h}/${input.ethBias4h}`,
      btcAboveVwap: input.btcAboveVwap,
      ethAboveVwap: input.ethAboveVwap,
      avgFunding: input.avgFunding,
      oiChange: input.oiChange,
      volatility: input.volatility,
      altBreadth: input.altBreadth,
    },
  };
}

function regimePenaltyForCandidate(regime, candidate) {
  if (!regime || !candidate) return 0;
  if (regime.type === RegimeType.CHOP) return 18;
  if (regime.type === RegimeType.MIXED) return candidate.state === "triggered" ? 4 : 8;
  if (regime.type === RegimeType.RISK_ON && candidate.direction === "short") return 10;
  if (regime.type === RegimeType.RISK_OFF && candidate.direction === "long") return 14;
  return 0;
}

function applyRegimeToCandidate(regime, candidate) {
  const penalty = regimePenaltyForCandidate(regime, candidate);
  return {
    ...candidate,
    marketRegime: regime.type,
    regimePenalty: penalty,
    adjustedScore: Math.max(0, Math.round((candidate.score?.final ?? 0) - penalty)),
  };
}

const mockMarketInput = createMarketInput();
const mockMarketRegime = evaluateMarketRegime(mockMarketInput);

window.CockpitMarketRegime = {
  RegimeType,
  createMarketInput,
  evaluateMarketRegime,
  regimePenaltyForCandidate,
  applyRegimeToCandidate,
  mockMarketInput,
  mockMarketRegime,
};
