const defaultRules = Object.freeze({
  marketRegimePenalty: true,
  conflictPenalty: true,
  minVolumeRatio: 1.0,
  maxVwapExtensionAtr: 1.8,
  minEdge: 25,
  maxSpreadPct: 0.08,
  minRiskScore: 55,
  minTriggerScoreForArmed: 58,
  maxFundingAbs: 0.05,
  requireBtcAlignment: false,
});

function evaluateRules(candidate, rules = defaultRules) {
  const metrics = candidate.metrics || {};
  const failures = [];
  const warnings = [];
  let penalty = 0;

  if (rules.marketRegimePenalty && candidate.regimePenalty > 10) {
    failures.push("Market režim blokuje alebo silno penalizuje smer.");
    penalty += candidate.regimePenalty;
  }
  if (rules.minVolumeRatio && metrics.volumeRatio < rules.minVolumeRatio) {
    warnings.push(`Volume je pod ${rules.minVolumeRatio}x.`);
    penalty += 6;
  }
  if (rules.maxVwapExtensionAtr && metrics.vwapDistanceAtr > rules.maxVwapExtensionAtr) {
    failures.push(`Cena je ${metrics.vwapDistanceAtr.toFixed(2)} ATR od VWAP.`);
    penalty += 14;
  }
  if (rules.minEdge && candidate.score.edge < rules.minEdge) {
    failures.push(`Edge ${candidate.score.edge} je pod minimom ${rules.minEdge}.`);
    penalty += 10;
  }
  if (rules.maxSpreadPct && metrics.spread > rules.maxSpreadPct) {
    warnings.push(`Spread ${metrics.spread.toFixed(3)}% je zvýšený.`);
    penalty += 8;
  }
  if (rules.minRiskScore && candidate.score.risk < rules.minRiskScore) {
    failures.push(`Risk score ${candidate.score.risk} je slabé.`);
    penalty += 12;
  }
  if (rules.maxFundingAbs && Math.abs(metrics.funding) > rules.maxFundingAbs) {
    warnings.push("Funding je crowded.");
    penalty += 6;
  }
  if (rules.requireBtcAlignment && !metrics.btcAligned) {
    failures.push("BTC alignment nesúhlasí.");
    penalty += 10;
  }

  const passed = failures.length === 0;
  return {
    passed,
    failures,
    warnings,
    penalty,
    adjustedScore: Math.max(0, Math.round(candidate.score.final - penalty)),
  };
}

function applyRulesToCandidates(candidates, rules = defaultRules) {
  return candidates.map((candidate) => {
    const ruleResult = evaluateRules(candidate, rules);
    return {
      ...candidate,
      ruleResult,
      score: {
        ...candidate.score,
        final: ruleResult.adjustedScore,
      },
      state: ruleResult.passed ? candidate.state : CandidateState.REJECTED,
      reasonsAgainst: [
        ...candidate.reasonsAgainst,
        ...ruleResult.failures,
        ...ruleResult.warnings,
      ],
    };
  }).sort((a, b) => b.score.final - a.score.final);
}

function ruleRows(rules = defaultRules) {
  return [
    ["Market regime penalty", rules.marketRegimePenalty ? "ON" : "OFF", "Penalizuje kandidátov proti BTC/ETH režimu."],
    ["Conflict penalty", rules.conflictPenalty ? "ON" : "OFF", "Má znížiť skóre coinom s podobne silným long aj short scenárom."],
    ["Min volume ratio", `${rules.minVolumeRatio}x`, "Bez objemu má setup menšiu váhu."],
    ["Max VWAP extension", `${rules.maxVwapExtensionAtr} ATR`, "Chráni pred chase vstupmi ďaleko od férovej ceny."],
    ["Min edge", `${rules.minEdge}`, "Vyžaduje rozdiel medzi smermi, aby signál nebol konfliktný."],
    ["Max spread", `${rules.maxSpreadPct}%`, "Chráni pred zlou exekúciou."],
    ["Min risk score", `${rules.minRiskScore}`, "Vyhadzuje kandidátov so slabým risk profilom."],
    ["Max funding abs", `${rules.maxFundingAbs}%`, "Crowded funding zvyšuje squeeze riziko."],
    ["Require BTC alignment", rules.requireBtcAlignment ? "ON" : "OFF", "Voliteľné tvrdé pravidlo proti obchodom proti BTC."],
  ];
}

window.CockpitRulesEngine = {
  defaultRules,
  evaluateRules,
  applyRulesToCandidates,
  ruleRows,
};
