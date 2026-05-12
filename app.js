const ui = {
  navButtons: document.querySelectorAll(".nav button"),
  panels: document.querySelectorAll(".view"),
  selectedCoin: document.getElementById("selectedCoin"),
  dataMode: document.getElementById("dataMode"),
  scanRefreshButton: document.getElementById("scanRefreshButton"),
  scannerStyle: document.getElementById("scannerStyle"),
  scannerDirection: document.getElementById("scannerDirection"),
  scannerMinQuality: document.getElementById("scannerMinQuality"),
  scannerMinEdge: document.getElementById("scannerMinEdge"),
  marketRegimeFilter: document.getElementById("marketRegimeFilter"),
  candidateUniverseLabel: document.getElementById("candidateUniverseLabel"),
  scannerStatus: document.getElementById("scannerStatus"),
  scalpScanButton: document.getElementById("scalpScanButton"),
  scalpDirection: document.getElementById("scalpDirection"),
  scalpMinTrigger: document.getElementById("scalpMinTrigger"),
  scalpMinQuality: document.getElementById("scalpMinQuality"),
  scalpNearOnly: document.getElementById("scalpNearOnly"),
  scalpStrictLong: document.getElementById("scalpStrictLong"),
  scalpStatus: document.getElementById("scalpStatus"),
  scalpUniverseLabel: document.getElementById("scalpUniverseLabel"),
  scalpList: document.getElementById("scalpList"),
  scalpDetailState: document.getElementById("scalpDetailState"),
  scalpDetailTitle: document.getElementById("scalpDetailTitle"),
  scalpDetailVerdict: document.getElementById("scalpDetailVerdict"),
  scalpDetailMetrics: document.getElementById("scalpDetailMetrics"),
  scalpDetailReasons: document.getElementById("scalpDetailReasons"),
  scalpDetailPlan: document.getElementById("scalpDetailPlan"),
  startScalpPaperButton: document.getElementById("startScalpPaperButton"),
  openScalpSignalButton: document.getElementById("openScalpSignalButton"),
  clearJournalButton: document.getElementById("clearJournalButton"),
  startPaperButton: document.getElementById("startPaperButton"),
  candidateTable: document.getElementById("candidateTable"),
  previewTitle: document.getElementById("previewTitle"),
  previewSetup: document.getElementById("previewSetup"),
  previewState: document.getElementById("previewState"),
  signalTitle: document.getElementById("signalTitle"),
  signalSubtitle: document.getElementById("signalSubtitle"),
  signalScores: document.getElementById("signalScores"),
  signalChecklist: document.getElementById("signalChecklist"),
  signalReasons: document.getElementById("signalReasons"),
  signalPlans: document.getElementById("signalPlans"),
  triggerList: document.getElementById("triggerList"),
  paperList: document.getElementById("paperList"),
  mainChartFrame: document.getElementById("mainChartFrame"),
  paperChartFrame: document.getElementById("paperChartFrame"),
  realChartFrame: document.getElementById("realChartFrame"),
  scalpChartFrame: document.getElementById("scalpChartFrame"),
  paperChartMeta: document.getElementById("paperChartMeta"),
  realChartMeta: document.getElementById("realChartMeta"),
  scalpChartMeta: document.getElementById("scalpChartMeta"),
  realTradesList: document.getElementById("realTradesList"),
  realPair: document.getElementById("realPair"),
  realDirection: document.getElementById("realDirection"),
  realStyle: document.getElementById("realStyle"),
  realEntry: document.getElementById("realEntry"),
  realMargin: document.getElementById("realMargin"),
  realLeverage: document.getElementById("realLeverage"),
  realStop: document.getElementById("realStop"),
  realTarget: document.getElementById("realTarget"),
  addRealTradeButton: document.getElementById("addRealTradeButton"),
  journalSummary: document.getElementById("journalSummary"),
  journalFeedback: document.getElementById("journalFeedback"),
  journalTable: document.getElementById("journalTable"),
  rulesTable: document.getElementById("rulesTable"),
  btcStatus: document.getElementById("btcStatus"),
  ethStatus: document.getElementById("ethStatus"),
  marketStatus: document.getElementById("marketStatus"),
  topLiveSymbol: document.getElementById("topLiveSymbol"),
  topLivePrice: document.getElementById("topLivePrice"),
  topLiveChange: document.getElementById("topLiveChange"),
  regimeBadge: document.getElementById("regimeBadge"),
  regimeScore: document.getElementById("regimeScore"),
  regimeAdvice: document.getElementById("regimeAdvice"),
  regimeMetrics: document.getElementById("regimeMetrics"),
  selectedCoinMeta: document.getElementById("selectedCoinMeta"),
  selectedCoinPrice: document.getElementById("selectedCoinPrice"),
  selectedCoinChange: document.getElementById("selectedCoinChange"),
  selectedCoinMetrics: document.getElementById("selectedCoinMetrics"),
  selectedCoinSummary: document.getElementById("selectedCoinSummary"),
};

let coinAnalyses = window.CockpitCoinAnalysis.buildCoinAnalyses();
let candidates = window.CockpitRulesEngine.applyRulesToCandidates(
  window.CockpitScanner.runScannerFromAnalyses(coinAnalyses, window.CockpitMarketRegime.mockMarketRegime)
);
let selectedCandidate = candidates[0];
let scalpAnalyses = [];
let scalpCandidates = [];
let selectedScalpCandidate = null;
const appSettings = window.CockpitStorage.loadAppSettings();
ui.selectedCoin.value = appSettings.selectedCoin;
if (ui.dataMode) ui.dataMode.value = "live";
window.CockpitDataAdapter.setDataMode("live");

function scannerSettings() {
  return {
    style: ui.scannerStyle?.value || "intraday",
    direction: ui.scannerDirection?.value || "both",
    minQuality: Number(ui.scannerMinQuality?.value || 0),
    minEdge: Number(ui.scannerMinEdge?.value || 0),
    marketRegimeFilter: Boolean(ui.marketRegimeFilter?.checked),
  };
}

function scannerIntervalForStyle(style) {
  return {
    scalp: "15m",
    intraday: "1h",
    swing: "4h",
  }[style] || "1h";
}

function setScannerStatus(state, title, text) {
  if (!ui.scannerStatus) return;
  ui.scannerStatus.className = `panel scanner-status ${state}`;
  ui.scannerStatus.querySelector("strong").textContent = title;
  ui.scannerStatus.querySelector("p").textContent = text;
}

function setScalpStatus(state, title, text) {
  if (!ui.scalpStatus) return;
  ui.scalpStatus.className = `panel scanner-status ${state}`;
  ui.scalpStatus.querySelector("strong").textContent = title;
  ui.scalpStatus.querySelector("p").textContent = text;
}

function scalpSettings() {
  return {
    direction: ui.scalpDirection?.value || "both",
    minTrigger: Number(ui.scalpMinTrigger?.value || 0),
    minQuality: Number(ui.scalpMinQuality?.value || 0),
    nearOnly: Boolean(ui.scalpNearOnly?.checked),
    strictLong: Boolean(ui.scalpStrictLong?.checked),
  };
}

function stateClass(state) {
  return {
    armed: "warn",
    forming: "neutral",
    watch: "neutral",
    triggered: "good",
    rejected: "bad",
    invalidated: "bad",
  }[state] || "neutral";
}

function titleCase(value) {
  return String(value || "").replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function fmt(value, digits = 4) {
  if (!Number.isFinite(value)) return "-";
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function parseNumber(value) {
  const raw = String(value ?? "").trim();
  const normalized = raw.includes(".")
    ? raw.replace(/,/g, "")
    : raw.replace(",", ".");
  const parsed = Number(normalized.replace(/[^0-9.+-]/g, ""));
  return Number.isFinite(parsed) ? parsed : NaN;
}

function movePct(entry, price, direction) {
  if (!Number.isFinite(entry) || !Number.isFinite(price) || entry === 0) return NaN;
  return ((price - entry) / entry) * 100 * (direction === "long" ? 1 : -1);
}

function signedPct(value) {
  if (!Number.isFinite(value)) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function plainPct(value) {
  if (!Number.isFinite(value)) return "-";
  return `${value.toFixed(2)}%`;
}

function hasStoredNumber(value) {
  return value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));
}

function zoneText(zone, fallback) {
  if (!zone || !Number.isFinite(zone.from) || !Number.isFinite(zone.to)) return fmt(fallback);
  if (Math.abs(zone.from - zone.to) < Math.abs(fallback || 1) * 0.00005) return fmt(fallback);
  return `${fmt(zone.from)}-${fmt(zone.to)}`;
}

function zoneDistanceText(zone, price) {
  if (!zone || !Number.isFinite(zone.from) || !Number.isFinite(zone.to) || !Number.isFinite(price)) return "-";
  const from = Math.min(zone.from, zone.to);
  const to = Math.max(zone.from, zone.to);
  if (price >= from && price <= to) return "v entry zóne";
  const nearest = price < from ? from : to;
  const distance = ((price - nearest) / nearest) * 100;
  return `${price > to ? "nad zónou" : "pod zónou"} ${signedPct(distance)}`;
}

function renderTopLivePrice(analysis) {
  if (!analysis) return;
  if (ui.topLiveSymbol) ui.topLiveSymbol.textContent = `${analysis.pair} live`;
  if (ui.topLivePrice) ui.topLivePrice.textContent = fmt(analysis.price);
  if (ui.topLiveChange) {
    ui.topLiveChange.textContent = Number.isFinite(analysis.dayChange) ? `${signedPct(analysis.dayChange)} 1D` : "-";
    ui.topLiveChange.className = Number(analysis.dayChange) >= 0 ? "positive" : "danger";
  }
}

function chartUrl(pair = ui.selectedCoin.value, interval = "1h") {
  const tvInterval = interval === "15m" ? "15" : interval === "4h" ? "240" : "60";
  return `https://www.tradingview.com/widgetembed/?symbol=${encodeURIComponent(`BINANCE:${pair}.P`)}&interval=${tvInterval}&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=0f1113&studies=[]&theme=dark&style=1&timezone=Europe%2FBratislava&withdateranges=1&hideideas=1`;
}

function syncChartFrame(frame, pair = ui.selectedCoin.value, interval = "1h") {
  if (!frame) return;
  const url = chartUrl(pair, interval);
  if (frame.dataset.url !== url) {
    frame.dataset.url = url;
    frame.src = url;
  }
}

function syncCharts(pair = ui.selectedCoin.value) {
  syncChartFrame(ui.mainChartFrame, pair);
  syncChartFrame(ui.paperChartFrame, pair);
  syncChartFrame(ui.realChartFrame, pair);
  syncChartFrame(ui.scalpChartFrame, pair, "15m");
  if (ui.paperChartMeta) ui.paperChartMeta.textContent = `${pair} | 1h`;
  if (ui.realChartMeta) ui.realChartMeta.textContent = `${pair} | 1h`;
  if (ui.scalpChartMeta) ui.scalpChartMeta.textContent = `${pair} | 15m`;
}

function setView(view) {
  ui.navButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  ui.panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === view));
}

function selectCandidate(candidate) {
  selectedCandidate = candidate;
  ui.selectedCoin.value = candidate.pair;
  window.CockpitStorage.saveSelectedCoin(candidate.pair);
  syncCharts(candidate.pair);
  ui.previewTitle.textContent = `${candidate.pair} ${candidate.direction.toUpperCase()}`;
  ui.previewSetup.textContent = candidate.setupType;
  ui.previewState.textContent = titleCase(candidate.state);
  document.querySelector(".detail-preview .reason-grid").innerHTML = `
    <div><strong>Za</strong><span>${candidate.reasonsFor.join(", ") || "Bez silného potvrdenia"}</span></div>
    <div><strong>Proti</strong><span>${candidate.reasonsAgainst.join(", ") || "Bez veľkého varovania"}</span></div>
  `;
  document.querySelector(".detail-preview .metric-list").innerHTML = `
    <span>VWAP <b>${candidate.metrics.aboveVwap ? "nad" : "pod"}</b></span>
    <span>OI <b>${candidate.metrics.oiLabel}${Number.isFinite(candidate.metrics.oiChange) ? ` ${signedPct(candidate.metrics.oiChange)}` : ""}</b></span>
    <span>Funding <b>${candidate.metrics.funding.toFixed(3)}%</b></span>
    <span>Volume <b>${candidate.metrics.volumeRatio.toFixed(1)}x</b></span>
    <span>ATR <b>${candidate.metrics.atrPct.toFixed(2)}%</b></span>
    <span>BTC align <b>${candidate.metrics.btcAligned ? "yes" : "no"}</b></span>
  `;
  document.querySelectorAll(".candidate-row").forEach((row) => {
    row.classList.toggle("active", row.dataset.coin === candidate.pair);
  });
  renderSignalDetail(candidate);
  renderSelectedCoinAnalysis(candidate.pair);
}

function scalpVerdict(candidate) {
  const metrics = candidate.metrics || {};
  const plan = candidate.tradePlans?.[0];
  if (!plan) return "Bez použiteľného scalp plánu.";
  if (candidate.setupType === "No trade") return "Watch only: coin má nejaký pohyb, ale zatiaľ nemá čistý scalp pattern. Neotvárať bez nového triggeru.";
  const zoneStatus = zoneDistanceText(plan.entryZone, Number(metrics.price));
  if (metrics.vwapDistanceAtr > 1.5) return "Chase risk: cena je už ďaleko od VWAP/MA zóny. Lepšie čakať na nový retest.";
  if (candidate.direction === Direction.LONG && metrics.volumeRatio < 1.2) return "Long reclaim je slabší: volume zatiaľ nepotvrdzuje návrat nad VWAP.";
  if (candidate.direction === Direction.SHORT && metrics.volumeRatio >= 0.8 && metrics.vwapDistanceAtr <= 1.35) return "Short reject je sledovateľný: čakaj odmietnutie zóny a rýchlu invalidáciu.";
  if (zoneStatus === "v entry zóne") return "Ready zóna: cena je v plánovanej oblasti, rozhoduje trigger a reakcia objemu.";
  return "Forming: setup je zaujímavý, ale zatiaľ čaká na návrat do scalp zóny.";
}

function scalpCandidatePasses(candidate, settings) {
  const metrics = candidate.metrics || {};
  const plan = candidate.tradePlans?.[0];
  const directionOk = settings.direction === "both" || candidate.direction === settings.direction;
  const qualityOk = candidate.score.coin >= settings.minQuality;
  const triggerOk = candidate.score.trigger >= settings.minTrigger;
  const setupOk = candidate.setupType !== "Squeeze risk";
  const zoneOk = !settings.nearOnly || (plan && Number(metrics.vwapDistanceAtr || 0) <= 1.75);
  const spreadOk = Number(metrics.spread || 0) <= 0.16;
  const activeOk = Number(metrics.volumeRatio || 0) >= 0.35 && Number(metrics.atrPct || 0) >= 0.12;
  const strictLongOk = !settings.strictLong || candidate.direction !== Direction.LONG || (
    Number(metrics.volumeRatio || 0) >= 0.75 &&
    Number(metrics.vwapDistanceAtr || 0) <= 1.35 &&
    candidate.score.trigger >= Math.max(35, settings.minTrigger)
  );
  return directionOk && qualityOk && triggerOk && setupOk && zoneOk && spreadOk && activeOk && strictLongOk;
}

function scalpPlanHtml(candidate) {
  const plan = candidate.tradePlans?.[0];
  const livePrice = Number(candidate.metrics?.price);
  if (!plan) return `<div class="plan-card"><strong>Bez plánu</strong><p>Pre tento scalp sa nepodarilo vytvoriť použiteľnú entry zónu.</p></div>`;
  const targets = plan.targets.map((target) => `
    <span>${target.label} <b>${fmt(target.price)}</b> <em>${signedPct(movePct(plan.entry, target.price, plan.direction))}</em></span>
  `).join("");
  return `
    <div class="plan-card active">
      <div class="plan-card-head">
        <span>${titleCase(plan.style)}</span>
        <strong>${plan.scenario || candidate.setupType}</strong>
      </div>
      <p>${plan.note}</p>
      <div class="plan-detail-grid">
        <span>Live <b>${fmt(livePrice)}</b></span>
        <span>Entry zone <b>${zoneText(plan.entryZone, plan.entry)}</b></span>
        <span>Zone status <b>${zoneDistanceText(plan.entryZone, livePrice)}</b></span>
        <span>Trigger <b>${candidate.score.trigger}</b></span>
        <span>SL <b class="danger">${fmt(plan.stop)} ${signedPct(movePct(plan.entry, plan.stop, plan.direction))}</b></span>
        <span>Risk <b>${candidate.score.risk}</b></span>
      </div>
      <div class="target-row">${targets}</div>
      <small>Invalidácia: ${plan.invalidation}</small>
    </div>
  `;
}

function selectScalpCandidate(candidate) {
  selectedScalpCandidate = candidate;
  selectedCandidate = candidate;
  ui.selectedCoin.value = candidate.pair;
  window.CockpitStorage.saveSelectedCoin(candidate.pair);
  syncCharts(candidate.pair);
  renderSelectedCoinAnalysis(candidate.pair);
  renderSignalDetail(candidate);
  const metrics = candidate.metrics || {};
  ui.scalpDetailState.textContent = titleCase(candidate.state);
  ui.scalpDetailTitle.textContent = `${candidate.pair} ${candidate.direction.toUpperCase()} | ${candidate.setupType}`;
  ui.scalpDetailVerdict.textContent = scalpVerdict(candidate);
  ui.scalpDetailMetrics.innerHTML = `
    <span>Final <b>${candidate.score.final}</b></span>
    <span>Coin <b>${candidate.score.coin}</b></span>
    <span>Trigger <b>${candidate.score.trigger}</b></span>
    <span>Risk <b>${candidate.score.risk}</b></span>
    <span>Live <b>${fmt(metrics.price)}</b></span>
    <span>VWAP <b>${metrics.aboveVwap ? "nad" : "pod"} / ${fmt(metrics.vwapDistanceAtr, 2)} ATR</b></span>
    <span>Volume <b>${fmt(metrics.volumeRatio, 2)}x</b></span>
    <span>Spread <b>${plainPct(metrics.spread)}</b></span>
    <span>ATR <b>${plainPct(metrics.atrPct)}</b></span>
    <span>BTC align <b>${metrics.btcAligned ? "yes" : "no"}</b></span>
    <span>OI <b>${metrics.oiLabel}${Number.isFinite(metrics.oiChange) ? ` ${signedPct(metrics.oiChange)}` : ""}</b></span>
    <span>Funding <b>${plainPct(metrics.funding)}</b></span>
  `;
  ui.scalpDetailReasons.innerHTML = `
    <div><strong>Za scalp</strong><span>${candidate.reasonsFor.join(", ") || "Bez silného potvrdenia"}</span></div>
    <div><strong>Riziká</strong><span>${candidate.reasonsAgainst.join(", ") || "Bez veľkého varovania"}</span></div>
  `;
  ui.scalpDetailPlan.innerHTML = scalpPlanHtml(candidate);
  ui.scalpList.querySelectorAll(".scalp-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.id === candidate.id);
  });
}

function renderScalpCandidates() {
  if (!ui.scalpList) return;
  const settings = scalpSettings();
  const filtered = scalpCandidates.filter((candidate) => scalpCandidatePasses(candidate, settings));
  ui.scalpUniverseLabel.textContent = `${filtered.length}/${scalpCandidates.length || scalpAnalyses.length} scalp candidates`;
  if (!filtered.length) {
    ui.scalpList.innerHTML = `<p class="muted">Žiadny čistý scalp setup. Skús znížiť filter alebo počkať na ďalší retest.</p>`;
    return;
  }
  ui.scalpList.innerHTML = filtered.map((candidate) => {
    const metrics = candidate.metrics || {};
    const plan = candidate.tradePlans?.[0];
    const zone = plan ? zoneText(plan.entryZone, plan.entry) : "-";
    return `
      <article class="scalp-card ${candidate.id === selectedScalpCandidate?.id ? "active" : ""}" data-id="${candidate.id}">
        <div class="scalp-card-head">
          <strong>${candidate.pair} ${candidate.direction.toUpperCase()}</strong>
          <span class="badge ${stateClass(candidate.state)}">${titleCase(candidate.state)}</span>
        </div>
        <p>${candidate.setupType} | ${scalpVerdict(candidate)}</p>
        <div class="metric-strip">
          <span>Final <b>${candidate.score.final}</b></span>
          <span>Coin <b>${candidate.score.coin}</b></span>
          <span>Entry <b>${zone}</b></span>
          <span>Live <b>${fmt(metrics.price)}</b></span>
          <span>Trig <b>${candidate.score.trigger}</b></span>
          <span>Risk <b>${candidate.score.risk}</b></span>
          <span>Vol <b>${fmt(metrics.volumeRatio, 2)}x</b></span>
          <span>VWAP <b>${fmt(metrics.vwapDistanceAtr, 2)} ATR</b></span>
        </div>
      </article>
    `;
  }).join("");
  ui.scalpList.querySelectorAll(".scalp-card").forEach((card) => {
    card.addEventListener("click", () => {
      const candidate = filtered.find((item) => item.id === card.dataset.id);
      if (candidate) selectScalpCandidate(candidate);
    });
  });
  if (!selectedScalpCandidate || !filtered.some((candidate) => candidate.id === selectedScalpCandidate.id)) {
    selectScalpCandidate(filtered[0]);
  }
}

function renderCandidates() {
  const settings = scannerSettings();
  const filtered = candidates.filter((item) => {
    const stateOk = item.state !== CandidateState.REJECTED;
    const directionOk = settings.direction === "both" || item.direction === settings.direction;
    const qualityOk = item.score.coin >= settings.minQuality;
    const edgeOk = item.score.edge >= settings.minEdge;
    return stateOk && directionOk && qualityOk && edgeOk;
  });
  ui.candidateUniverseLabel.textContent = window.CockpitDataAdapter.getDataMode() === "live"
    ? `${filtered.length}/${coinAnalyses.length} 2-step live candidates`
    : `${filtered.length}/${coinAnalyses.length} 2-step mock candidates`;
  if (ui.scannerStatus && !ui.scannerStatus.classList.contains("loading")) {
    setScannerStatus("done", "Ready", `V universe je ${coinAnalyses.length} coinov, aktuálne zobrazené ${filtered.length} kandidátov.`);
  }
  ui.candidateTable.innerHTML = `
    <div class="candidate-row candidate-head">
      <span>Coin</span>
      <span>State</span>
      <span>Setup</span>
      <span>Dir</span>
      <span title="Coin quality: trend, volume, room, BTC alignment">Coin</span>
      <span title="Trigger readiness: entry zone, VWAP distance, volume confirmation">Trig</span>
      <span title="Final score after risk/rules/market penalties">Final</span>
    </div>
    ${filtered.map((item) => `
    <div class="candidate-row ${item.pair === selectedCandidate?.pair ? "active" : ""}" data-coin="${item.pair}">
      <strong>${item.pair}</strong>
      <span class="badge ${stateClass(item.state)}">${titleCase(item.state)}</span>
      <span>${item.setupType}</span>
      <span>${titleCase(item.direction)}</span>
      <span>${item.score.coin}</span>
      <span>${item.score.trigger}</span>
      <span>${item.score.final}</span>
    </div>
  `).join("")}`;

  ui.candidateTable.querySelectorAll(".candidate-row").forEach((row) => {
    if (!row.dataset.coin) return;
    row.addEventListener("click", () => {
      const candidate = candidates.find((item) => item.pair === row.dataset.coin);
      selectCandidate(candidate);
    });
  });
}

function checklistForCandidate(candidate) {
  const metrics = candidate.metrics || {};
  return [
    { label: "Market režim neblokuje smer", status: candidate.regimePenalty > 10 ? "fail" : "done" },
    { label: "Cena nie je chase od VWAP", status: metrics.vwapDistanceAtr <= 1.8 ? "done" : "fail" },
    { label: "Volume potvrdzuje pohyb", status: metrics.volumeRatio >= 1.2 ? "done" : "pending" },
    { label: "BTC súhlasí so smerom", status: metrics.btcAligned ? "done" : "fail" },
    { label: "Trigger score nad 75", status: candidate.score.trigger >= 75 ? "done" : candidate.score.trigger >= 55 ? "pending" : "fail" },
  ];
}

function renderSignalDetail(candidate = selectedCandidate) {
  if (!candidate) return;
  document.querySelector(".signal-watch-actions")?.remove();
  const watched = window.CockpitStorage.loadWatchedTriggers();
  const isWatched = watched.some((item) => item.candidate?.pair === candidate.pair && item.candidate?.style === candidate.style && item.candidate?.direction === candidate.direction);
  const metrics = candidate.metrics || {};
  const plan = candidate.tradePlans[0];
  const livePrice = Number(metrics.price);
  ui.signalTitle.textContent = `${candidate.pair} ${candidate.direction.toUpperCase()}`;
  ui.signalSubtitle.innerHTML = `
    ${candidate.setupType} | ${titleCase(candidate.style)} | ${candidate.timeframe}
    | live <b>${fmt(livePrice)}</b>
    | state <b class="${candidate.state === "rejected" ? "danger" : "positive"}">${titleCase(candidate.state)}</b>
  `;
  ui.signalScores.innerHTML = `
    <span>Final <b>${candidate.score.final}</b></span>
    <span>Coin <b>${candidate.score.coin}</b></span>
    <span>Setup <b>${candidate.score.setup}</b></span>
    <span>Trigger <b>${candidate.score.trigger}</b></span>
    <span>Risk <b>${candidate.score.risk}</b></span>
    <span>Edge <b>${candidate.score.edge}</b></span>
  `;
  ui.signalChecklist.innerHTML = checklistForCandidate(candidate).map((item) => `
    <li class="${item.status}">${item.label}</li>
  `).join("");
  ui.signalReasons.innerHTML = `
    <div><strong>Za obchod</strong><span>${candidate.reasonsFor.join(", ") || "Bez silného potvrdenia"}</span></div>
    <div><strong>Riziká</strong><span>${candidate.reasonsAgainst.join(", ") || "Bez veľkého varovania"}</span></div>
    <div><strong>Dáta</strong><span>Volume ${fmt(metrics.volumeRatio, 2)}x | OI ${metrics.oiLabel}${Number.isFinite(metrics.oiChange) ? ` ${signedPct(metrics.oiChange)}` : ""} | Funding ${plainPct(metrics.funding)} | ATR ${plainPct(metrics.atrPct)}</span></div>
    <div><strong>Scan</strong><span>${metrics.stage1?.name || "Market Sweep"} ${metrics.stage1?.passedChecks ?? "-"}/${metrics.stage1?.totalChecks ?? "-"} | ${metrics.stage2?.name || "Setup Analysis"} ${metrics.stage2?.passedChecks ?? "-"}/${metrics.stage2?.totalChecks ?? "-"} | ${metrics.scanKey || "-"}</span></div>
    <div><strong>Entry stav</strong><span>${plan ? `${zoneText(plan.entryZone, plan.entry)} | ${zoneDistanceText(plan.entryZone, livePrice)}` : "-"}</span></div>
  `;
  ui.signalPlans.classList.toggle("single-plan", candidate.tradePlans.length === 1);
  ui.signalPlans.innerHTML = candidate.tradePlans.map((plan) => {
    const targetLine = plan.targets.map((target) => `
      <span>${target.label} <b>${fmt(target.price)}</b> <em>${signedPct(movePct(plan.entry, target.price, plan.direction))}</em></span>
    `).join("");
    return `
      <div class="plan-card ${plan.style === candidate.style ? "active" : ""}">
        <div class="plan-card-head">
          <span>${titleCase(plan.style)}</span>
          <strong>${plan.scenario || plan.note}</strong>
        </div>
        <p>${plan.note}</p>
        <div class="plan-detail-grid">
          <span>Live <b>${fmt(livePrice)}</b></span>
          <span>Entry zone <b>${zoneText(plan.entryZone, plan.entry)}</b></span>
          <span>Zone status <b>${zoneDistanceText(plan.entryZone, livePrice)}</b></span>
          <span>Mid <b>${fmt(plan.entry)}</b></span>
          <span>SL <b class="danger">${fmt(plan.stop)} ${signedPct(movePct(plan.entry, plan.stop, plan.direction))}</b></span>
          <span>Riziko <b>${plainPct(Math.abs(movePct(plan.entry, plan.stop, plan.direction)))}</b></span>
        </div>
        <div class="target-row">${targetLine}</div>
        <small>Invalidácia: ${plan.invalidation}</small>
      </div>
    `;
  }).join("");
  ui.signalPlans.insertAdjacentHTML("afterend", `
    <div class="trade-actions signal-watch-actions">
      <button id="watchTriggerButton" class="${isWatched ? "secondary" : "primary"}" type="button">${isWatched ? "Sledovaný trigger" : "Sledovať trigger"}</button>
    </div>
  `);
  document.getElementById("watchTriggerButton")?.addEventListener("click", () => watchSelectedTrigger());
}

function triggerTone(status) {
  return {
    triggered: "good",
    armed: "warn",
    waiting: "neutral",
    invalidated: "bad",
    expired: "bad",
  }[status] || "neutral";
}

function renderTriggerBoard() {
  const watched = window.CockpitStorage.loadWatchedTriggers();
  const watchedCandidates = watched.map((item) => item.candidate).filter(Boolean);
  const watchedTriggers = watched.map((item) => ({ ...item.trigger, watched: true }));
  const dynamicTriggers = window.CockpitTriggerEngine.buildTriggerBoard(candidates)
    .filter((trigger) => !watched.some((item) => item.candidate?.pair === trigger.pair && item.candidate?.style === trigger.style && item.candidate?.direction === trigger.direction));
  const triggerCandidates = [...watchedCandidates, ...candidates];
  const triggers = [...watchedTriggers, ...dynamicTriggers];
  ui.triggerList.innerHTML = triggers.map((trigger) => {
    const done = trigger.checklist.filter((item) => item.status === "done").length;
    const pending = trigger.checklist.filter((item) => item.status === "pending").length;
    const failed = trigger.checklist.filter((item) => item.status === "fail").length;
    const zone = trigger.entryZone ? `${fmt(trigger.entryZone.from)} - ${fmt(trigger.entryZone.to)}` : "-";
    return `
      <div class="trigger-item ${trigger.watched ? "watched" : ""}" data-candidate="${trigger.candidateId}" data-watched="${trigger.watched ? "yes" : "no"}">
        <div class="trigger-top">
          <strong>${trigger.pair} ${trigger.direction.toUpperCase()}${trigger.watched ? " · sledovaný" : ""}</strong>
          <span class="badge ${triggerTone(trigger.status)}">${titleCase(trigger.status)}</span>
        </div>
        <p>${trigger.triggerType} | ${titleCase(trigger.style)} | ${trigger.timeframe}</p>
        <div class="metric-strip">
          <span>Entry zone <b>${zone}</b></span>
          <span>Done <b>${done}</b></span>
          <span>Pending <b>${pending}</b></span>
          <span>Fail <b>${failed}</b></span>
        </div>
        <ul class="mini-checklist">
          ${trigger.checklist.map((item) => `<li class="${item.status}">${item.label}<small>${item.detail}</small></li>`).join("")}
        </ul>
        ${trigger.watched ? `<button class="secondary unwatch-trigger" type="button" data-trigger="${trigger.id}">Zrušiť sledovanie</button>` : ""}
      </div>
    `;
  }).join("");

  ui.triggerList.querySelectorAll(".unwatch-trigger").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const next = window.CockpitStorage.loadWatchedTriggers().filter((item) => item.trigger.id !== button.dataset.trigger);
      window.CockpitStorage.saveWatchedTriggers(next);
      renderTriggerBoard();
      renderSignalDetail(selectedCandidate);
    });
  });

  ui.triggerList.querySelectorAll(".trigger-item").forEach((item) => {
    item.addEventListener("click", () => {
      const candidate = triggerCandidates.find((candidateItem) => candidateItem.id === item.dataset.candidate);
      if (candidate) {
        selectCandidate(candidate);
        setView("signal");
      }
    });
  });
}

function watchSelectedTrigger() {
  if (!selectedCandidate) return;
  const trigger = window.CockpitTriggerEngine.createTriggerFromCandidate(selectedCandidate);
  const watched = window.CockpitStorage.loadWatchedTriggers();
  const exists = watched.some((item) => item.candidate?.pair === selectedCandidate.pair && item.candidate?.style === selectedCandidate.style && item.candidate?.direction === selectedCandidate.direction);
  const next = exists
    ? watched
    : [{ id: trigger.id, trigger, candidate: selectedCandidate, createdAt: new Date().toISOString() }, ...watched];
  window.CockpitStorage.saveWatchedTriggers(next);
  renderSignalDetail(selectedCandidate);
  renderTriggerBoard();
}

function tpMapHtml(trade) {
  return trade.targets.map((target) => {
    const pct = movePct(Number.isFinite(trade.entry) ? trade.entry : trade.plannedEntry, target.price, trade.direction);
    return `<span class="${target.hit ? "hit" : ""}">${target.hit ? "✓ " : ""}${target.label} ${fmt(target.price)} <b>${signedPct(pct)}</b></span>`;
  }).join("");
}

function paperTradeCard(trade) {
  const isActive = trade.status === "active";
  const shownEntry = Number.isFinite(trade.entry) ? trade.entry : trade.plannedEntry;
  return `
    <article class="paper-trade-card ${isActive ? "active" : "waiting"}">
      <div class="panel-head">
        <h2>${trade.pair} ${trade.direction.toUpperCase()}</h2>
        <div class="trade-card-actions">
          <span class="badge ${isActive ? "good" : "warn"}">${titleCase(trade.status)}</span>
          <button class="secondary danger-button delete-paper-trade" type="button" data-trade="${trade.id}">Vymazať</button>
        </div>
      </div>
      <p>${trade.setupType} | ${titleCase(trade.style)} | ${trade.triggerType}</p>
      <div class="paper-row">
        <span>Entry zone <b>${zoneText(trade.entryZone, shownEntry)}</b></span>
        <span>Trigger entry <b>${fmt(shownEntry)}</b></span>
        <span>Live <b>${fmt(trade.live)}</b></span>
        <span class="${trade.leveragedPct >= 0 ? "positive" : "danger"}">${trade.leverage}x ${signedPct(trade.leveragedPct)}</span>
        <span class="danger">SL ${fmt(trade.stop)}</span>
      </div>
      <div class="tp-map">${tpMapHtml(trade)}</div>
      <p class="summary">${isActive ? "Setup health: trade beží, sleduje sa TP mapa a invalidácia." : "Čaká sa na trigger. Obchod ešte nie je otvorený."}</p>
    </article>
  `;
}

function renderPaper() {
  const state = window.CockpitStorage.loadPaperState() || window.CockpitPaperSimulator.emptyPaperState();
  window.CockpitStorage.savePaperState(state);
  ui.paperList.innerHTML = `
    <div class="panel-head"><h2>Paper Trades</h2><span>${state.active.length} active | ${state.waiting.length} waiting</span></div>
    <div class="paper-stack">
      ${state.active.map(paperTradeCard).join("")}
      ${state.waiting.map(paperTradeCard).join("")}
    </div>
  `;
  ui.paperList.querySelectorAll(".delete-paper-trade").forEach((button) => {
    button.addEventListener("click", () => deletePaperTrade(button.dataset.trade));
  });
}

function paperState() {
  return window.CockpitStorage.loadPaperState() || window.CockpitPaperSimulator.emptyPaperState();
}

function deletePaperTrade(tradeId) {
  const state = paperState();
  const nextState = {
    ...state,
    waiting: state.waiting.filter((trade) => trade.id !== tradeId),
    active: state.active.filter((trade) => trade.id !== tradeId),
    closed: state.closed?.filter((trade) => trade.id !== tradeId) || [],
  };
  window.CockpitStorage.savePaperState(nextState);
  renderPaper();
}

function startPaperFromSelected() {
  if (!selectedCandidate) return;
  const trigger = window.CockpitTriggerEngine.createTriggerFromCandidate(selectedCandidate);
  const nextState = window.CockpitPaperSimulator.addPaperFromCandidate(paperState(), selectedCandidate, trigger);
  window.CockpitStorage.savePaperState(nextState);
  renderPaper();
  setView("paper");
}

async function updateLivePaperTracking() {
  if (window.CockpitDataAdapter.getDataMode() !== "live") return;
  const state = window.CockpitStorage.loadPaperState();
  if (!state) return;
  const pairs = [...new Set([...state.waiting, ...state.active].map((trade) => trade.pair))];
  if (!pairs.length) return;
  const results = await Promise.allSettled(pairs.map(async (pair) => [pair, await window.CockpitDataAdapter.fetchPrice(pair)]));
  const priceMap = Object.fromEntries(results.filter((result) => result.status === "fulfilled").map((result) => result.value));
  const nextState = window.CockpitPaperSimulator.updatePaperStateWithPrices(state, priceMap, candidates);
  window.CockpitStorage.savePaperState(nextState);
  const storedJournal = window.CockpitStorage.loadJournalEntries() || [];
  if (nextState.journal?.length) {
    const known = new Set(storedJournal.map((entry) => entry.paperTradeId));
    const merged = [...nextState.journal.filter((entry) => !known.has(entry.paperTradeId)), ...storedJournal];
    window.CockpitStorage.saveJournalEntries(merged);
  }
  renderPaper();
  renderJournal();
}

function renderJournal() {
  const state = {
    entries: [],
    summary: window.CockpitJournalEngine.summarizeJournal([]),
    bySetup: [],
    byStyle: [],
    byTrigger: [],
  };
  const storedEntries = window.CockpitStorage.loadJournalEntries();
  if (storedEntries) state.entries = storedEntries;
  else window.CockpitStorage.saveJournalEntries([]);
  const realEntries = window.CockpitStorage.loadRealJournalEntries() || [];
  state.entries = state.entries.map((entry) => {
    const tpHitCount = Number(entry.tpHitCount || 0);
    const countedAsWin = entry.countedAsWin === true || tpHitCount > 0 || Number(entry.resultPct) > 0;
      const tpResultPct = hasStoredNumber(entry.tpResultPct) ? Number(entry.tpResultPct) : NaN;
      const tpResultLeveragedPct = hasStoredNumber(entry.tpResultLeveragedPct) ? Number(entry.tpResultLeveragedPct) : NaN;
    return {
      ...entry,
      tpHits: entry.tpHits || [],
      tpHitCount,
      tpResultPct: Number.isFinite(tpResultPct) ? tpResultPct : null,
      tpResultLeveragedPct: Number.isFinite(tpResultLeveragedPct) ? tpResultLeveragedPct : null,
      hitTpBeforeExit: Boolean(entry.hitTpBeforeExit || tpHitCount > 0),
      countedAsWin,
      failurePattern: entry.failurePattern || window.CockpitJournalEngine.detectFailurePattern({ ...entry, tpHitCount, countedAsWin }),
    };
  });
  state.summary = window.CockpitJournalEngine.summarizeJournal(state.entries);
  state.bySetup = window.CockpitJournalEngine.groupStats(state.entries, "setupType");
  state.byStyle = window.CockpitJournalEngine.groupStats(state.entries, "style");
  ui.journalSummary.innerHTML = `
    <div class="panel-head"><h2>Journal Summary</h2><span>${state.summary.total} closed</span></div>
    <div class="stat-grid">
      <div><span>Winrate</span><strong>${state.summary.winrate.toFixed(0)}%</strong></div>
      <div><span>Wins / Losses</span><strong>${state.summary.wins} / ${state.summary.losses}</strong></div>
      <div><span>Avg %</span><strong class="${state.summary.avgPct >= 0 ? "positive" : "danger"}">${signedPct(state.summary.avgPct)}</strong></div>
      <div><span>Avg 10x</span><strong class="${state.summary.avgLeveragedPct >= 0 ? "positive" : "danger"}">${signedPct(state.summary.avgLeveragedPct)}</strong></div>
    </div>
  `;
  const setupLine = state.bySetup.map((item) => `${item.label}: ${item.total} trades, ${item.winrate.toFixed(0)}% WR`).join("<br>");
  const styleLine = state.byStyle.map((item) => `${titleCase(item.label)}: ${item.total} trades, avg ${signedPct(item.avgLeveragedPct)} 10x`).join("<br>");
  ui.journalFeedback.innerHTML = `
    <div class="panel-head"><h2>Feedback</h2><span>mock learning</span></div>
    <div class="reason-grid stacked">
      <div><strong>By setup</strong><span>${setupLine || "No data"}</span></div>
      <div><strong>By style</strong><span>${styleLine || "No data"}</span></div>
    </div>
    <p class="summary">Cieľ v3: journal bude spätne hovoriť, ktoré setupy, štýly a trigger typy majú zmysel držať.</p>
  `;
  ui.journalTable.innerHTML = `
    <div class="panel-head"><h2>Paper Journal</h2><span>${state.entries.length} closed</span></div>
    <div class="journal-head"><span>Coin</span><span>Side</span><span>Style</span><span>Setup</span><span>Entry</span><span>Exit</span><span>TP hit</span><span>10x</span><span>Result</span></div>
    ${state.entries.map((entry) => {
      const hitTp = Number(entry.tpHitCount || 0) > 0;
      const hasTpResult = hitTp && hasStoredNumber(entry.tpResultLeveragedPct);
      const displayLeveragedPct = hasTpResult ? Number(entry.tpResultLeveragedPct) : Number(entry.leveragedPct);
      const displayTp = hitTp
        ? `${entry.tpHits?.join(", ") || `${entry.tpHitCount}x TP`} pred exitom`
        : "nie";
      const resultLabel = hitTp && !hasTpResult
        ? `${entry.tpHits?.at?.(-1) || "TP"} výsledok nedostupný`
        : hasTpResult
        ? `${entry.tpResultLabel || entry.tpHits?.at?.(-1) || "TP"} ${signedPct(displayLeveragedPct)}`
        : `${entry.exitReason || "SL"} ${signedPct(displayLeveragedPct)}`;
      return `
        <div>
          <span>${entry.pair}</span>
          <span>${titleCase(entry.direction)}</span>
          <span>${titleCase(entry.style)}</span>
          <span>${entry.setupType}</span>
          <span>${fmt(entry.entry)}</span>
          <span>${fmt(entry.exit)}</span>
          <span>${displayTp}</span>
          <span class="${displayLeveragedPct >= 0 ? "positive" : "danger"}">${resultLabel}</span>
          <span class="${entry.countedAsWin || hitTp || Number(entry.resultPct) > 0 ? "positive" : "danger"}">${entry.countedAsWin || hitTp || Number(entry.resultPct) > 0 ? "Win" : "Loss"} | ${entry.exitReason} | ${entry.failurePattern}</span>
        </div>
      `;
    }).join("")}
    <div class="panel-head journal-section-head"><h2>Real Trades Journal</h2><span>${realEntries.length} closed</span></div>
    <div class="journal-head"><span>Coin</span><span>Side</span><span>Style</span><span>Setup</span><span>Entry</span><span>Exit</span><span>TP hit</span><span>10x</span><span>Result</span></div>
    ${realEntries.map((entry) => `
      <div>
        <span>${entry.pair}</span>
        <span>${titleCase(entry.direction)}</span>
        <span>${titleCase(entry.style)}</span>
        <span>Real manual</span>
        <span>${fmt(entry.entry)}</span>
        <span>${fmt(entry.exit)}</span>
        <span>n/a</span>
        <span class="${entry.leveragedPct >= 0 ? "positive" : "danger"}">${signedPct(entry.leveragedPct)}</span>
        <span class="${entry.resultPct >= 0 ? "positive" : "danger"}">${entry.resultPct >= 0 ? "Win" : "Loss"} | ${entry.exitReason} | PnL ${fmt(entry.pnl, 2)} USDT</span>
      </div>
    `).join("")}
  `;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function realTradeHealth(trade, analysis, resultPct) {
  if (!analysis) {
    return {
      score: 0,
      level: "warn",
      label: "Čakám na dáta",
      action: "Live analýza sa nepodarila načítať. Sleduj hlavne SL/TP podľa vlastného plánu.",
      reasonsFor: [],
      reasonsAgainst: ["Dáta pre filter nie sú dostupné"],
    };
  }
  const direction = trade.direction;
  const biasAligned = analysis.directionBias === direction;
  const vwapAligned = direction === Direction.LONG ? analysis.aboveVwap : !analysis.aboveVwap;
  const room = direction === Direction.LONG ? analysis.roomLongAtr : analysis.roomShortAtr;
  const oiSupport = analysis.oiAvailable && analysis.oiLabel === "rising";
  const fundingOk = Math.abs(Number(analysis.funding) || 0) < 0.04;
  const stopProtectionPct = movePct(trade.entry, trade.stop, trade.direction);
  const protectedStop = Number.isFinite(stopProtectionPct) && stopProtectionPct > 0;
  const score = Math.round(clamp(
    50 +
    (biasAligned ? 18 : -18) +
    (vwapAligned ? 14 : -14) +
    (analysis.emaAligned && biasAligned ? 10 : -6) +
    (analysis.volumeRatio >= 1 ? 8 : -7) +
    (oiSupport ? 5 : analysis.oiLabel === "falling" ? -6 : 0) +
    (room >= 1.2 ? 8 : -10) +
    (fundingOk ? 4 : -6) -
    Math.max(0, analysis.vwapDistanceAtr - 1.8) * 10 +
    (protectedStop ? 8 : 0),
    0,
    100,
  ));
  const reasonsFor = [];
  const reasonsAgainst = [];
  if (biasAligned) reasonsFor.push("bias súhlasí so smerom"); else reasonsAgainst.push("bias ide proti obchodu");
  if (vwapAligned) reasonsFor.push("VWAP drží smer"); else reasonsAgainst.push("cena je na zlej strane VWAP");
  if (analysis.volumeRatio >= 1) reasonsFor.push(`volume ${fmt(analysis.volumeRatio, 2)}x`); else reasonsAgainst.push(`volume len ${fmt(analysis.volumeRatio, 2)}x`);
  if (analysis.oiAvailable) reasonsFor.push(`OI ${analysis.oiLabel}${Number.isFinite(analysis.oiChange) ? ` ${signedPct(analysis.oiChange)}` : ""}`);
  else reasonsAgainst.push("OI chýba");
  if (room >= 1.2) reasonsFor.push(`room ${fmt(room, 2)} ATR`); else reasonsAgainst.push("málo priestoru k ďalšiemu levelu");
  if (!fundingOk) reasonsAgainst.push("funding je crowded");
  if (protectedStop) reasonsFor.push(`SL je v profite ${signedPct(stopProtectionPct)}`);

  let level = score >= 72 ? "good" : score >= 50 ? "warn" : "bad";
  let label = score >= 72 ? "Smer stále drží" : score >= 50 ? "Sledovať zblízka" : "Smer slabne";
  let action = score >= 72
    ? "Filter stále podporuje pôvodný smer. Drž plán, ale nenavyšuj bez nového triggeru."
    : score >= 50
      ? "Obchod má zmiešaný kontext. Pri zisku zvažuj partial, pri strate rešpektuj invalidáciu."
      : "Pôvodný smer stráca podporu. Zváž zníženie rizika alebo zavretie podľa SL plánu.";

  if (Number.isFinite(resultPct) && resultPct > 0.8 && score < 60) {
    level = "warn";
    label = "Profit, ale filter slabne";
    action = "Zisk existuje, no smer už nie je čistý. Partial alebo posun SL dáva väčší zmysel než dúfať.";
  }
  if (Number.isFinite(resultPct) && resultPct < -0.7 && score < 55) {
    level = "bad";
    label = "Strata + slabý filter";
    action = "Obchod je v strate a filter nepomáha. Nepridávať do pozície, riešiť invalidáciu.";
  }
  if (protectedStop && score >= 45) {
    action = `${action} Stop je už v profite, takže riziko obchodu je nižšie než pri pôvodnom SL.`;
  }

  return { score, level, label, action, reasonsFor, reasonsAgainst };
}

async function analysisForRealTrade(trade) {
  const interval = scannerIntervalForStyle(trade.style);
  try {
    return await window.CockpitDataAdapter.liveCoinAnalysis(trade.pair, interval);
  } catch {
    return coinAnalyses.find((analysis) => analysis.pair === trade.pair) || null;
  }
}

function normalizeRealTrade(trade) {
  return {
    ...trade,
    entry: parseNumber(trade.entry),
    live: Number.isFinite(parseNumber(trade.live)) ? parseNumber(trade.live) : parseNumber(trade.entry),
    margin: Number.isFinite(parseNumber(trade.margin)) ? parseNumber(trade.margin) : 10,
    leverage: Number.isFinite(parseNumber(trade.leverage)) ? parseNumber(trade.leverage) : 10,
    stop: parseNumber(trade.stop),
    target: parseNumber(trade.target),
    status: trade.status || RealTradeStatus.OPEN,
  };
}

function realJournalEntryFromTrade(trade, exitPrice, exitReason = "Manual close") {
  const normalized = normalizeRealTrade(trade);
  const resultPct = movePct(normalized.entry, exitPrice, normalized.direction);
  const leveragedPct = resultPct * normalized.leverage;
  return {
    id: `real-journal-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    realTradeId: normalized.id,
    pair: normalized.pair,
    direction: normalized.direction,
    style: normalized.style,
    entry: normalized.entry,
    exit: exitPrice,
    resultPct,
    leveragedPct,
    pnl: normalized.margin * leveragedPct / 100,
    margin: normalized.margin,
    leverage: normalized.leverage,
    stop: normalized.stop,
    target: normalized.target,
    exitReason,
    createdAt: new Date().toISOString(),
  };
}

async function renderRealTrades() {
  const stored = window.CockpitStorage.loadRealTrades();
  const trades = (stored || []).map(normalizeRealTrade).filter((trade) => trade.status === RealTradeStatus.OPEN);
  if (!stored) window.CockpitStorage.saveRealTrades([]);
  else window.CockpitStorage.saveRealTrades(trades);
  const cards = await Promise.all(trades.map(async (trade) => {
    const analysis = await analysisForRealTrade(trade);
    const live = Number.isFinite(trade.live) ? trade.live : analysis?.price ?? trade.entry;
    const result = movePct(trade.entry, live, trade.direction);
    const leveraged = result * trade.leverage;
    const pnl = Number.isFinite(leveraged) ? trade.margin * leveraged / 100 : NaN;
    const riskDistance = movePct(trade.entry, trade.stop, trade.direction);
    const targetDistance = movePct(trade.entry, trade.target, trade.direction);
    const stopFromLive = movePct(live, trade.stop, trade.direction);
    const targetFromLive = movePct(live, trade.target, trade.direction);
    const health = realTradeHealth(trade, analysis, result);
    const badgeClass = health.level === "good" ? "good" : health.level === "bad" ? "bad" : "warn";
    return `
      <article class="paper-trade-card active real-trade-card" data-coin="${trade.pair}">
        <div class="panel-head">
          <h2>${trade.pair} ${trade.direction.toUpperCase()}</h2>
          <div class="trade-card-actions">
            <span class="badge ${badgeClass}">${health.score}/100</span>
            <button class="secondary close-real-trade" type="button" data-trade="${trade.id}">Zavrieť</button>
          </div>
        </div>
        <p>${titleCase(trade.style)} | ${trade.note || "Manual trade monitoring."}</p>
        <div class="paper-row">
          <span>Entry <b>${fmt(trade.entry)}</b></span>
          <span>Live <b>${fmt(live)}</b></span>
          <span class="${leveraged >= 0 ? "positive" : "danger"}">${trade.leverage}x <b>${signedPct(leveraged)}</b></span>
          <span>PnL <b>${fmt(pnl, 2)} USDT</b></span>
          <span class="danger">SL <b>${fmt(trade.stop)} ${signedPct(riskDistance)}</b></span>
          <span>TP <b>${fmt(trade.target)} ${signedPct(targetDistance)}</b></span>
        </div>
        <div class="real-health-grid">
          <div><span>Smer validita</span><strong class="${health.level === "bad" ? "danger" : health.level === "good" ? "positive" : ""}">${health.label}</strong></div>
          <div><span>SL od live</span><strong class="danger">${signedPct(stopFromLive)}</strong></div>
          <div><span>TP od live</span><strong class="positive">${signedPct(targetFromLive)}</strong></div>
          <div><span>VWAP</span><strong>${analysis ? (analysis.aboveVwap ? "nad" : "pod") : "-"}</strong></div>
          <div><span>Volume</span><strong>${analysis ? `${fmt(analysis.volumeRatio, 2)}x` : "-"}</strong></div>
          <div><span>OI</span><strong>${analysis ? `${analysis.oiLabel}${Number.isFinite(analysis.oiChange) ? ` ${signedPct(analysis.oiChange)}` : ""}` : "-"}</strong></div>
        </div>
        <div class="real-edit-row">
          <label>SL <input class="real-stop-input" data-trade="${trade.id}" value="${fmt(trade.stop)}"></label>
          <label>TP <input class="real-target-input" data-trade="${trade.id}" value="${fmt(trade.target)}"></label>
          <button class="secondary update-real-trade" type="button" data-trade="${trade.id}">Upraviť SL/TP</button>
        </div>
        <div class="reason-grid">
          <div><strong>Za držanie</strong><span>${health.reasonsFor.join(", ") || "Bez jasného potvrdenia"}</span></div>
          <div><strong>Proti držaniu</strong><span>${health.reasonsAgainst.join(", ") || "Bez veľkého varovania"}</span></div>
        </div>
        <p class="management-banner ${health.level}"><strong>${health.label}:</strong> ${health.action}</p>
      </article>
    `;
  }));
  ui.realTradesList.innerHTML = `
    <div class="panel-head"><h2>Open Real Trades</h2><span>${trades.filter((trade) => trade.status === "open").length} open</span></div>
    <div class="paper-stack">
      ${cards.join("") || `<p class="muted">Žiadne real trades. Pridaj obchod manuálne cez formulár vyššie.</p>`}
    </div>
  `;
  ui.realTradesList.querySelectorAll(".real-trade-card").forEach((card) => {
    card.addEventListener("click", () => {
      ui.selectedCoin.value = card.dataset.coin;
      window.CockpitStorage.saveSelectedCoin(card.dataset.coin);
      syncCharts(card.dataset.coin);
      renderSelectedCoinAnalysis(card.dataset.coin);
    });
  });
  ui.realTradesList.querySelectorAll(".close-real-trade").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      closeRealTrade(button.dataset.trade);
    });
  });
  ui.realTradesList.querySelectorAll(".update-real-trade").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      updateRealTradeLevels(button.dataset.trade);
    });
  });
  ui.realTradesList.querySelectorAll(".real-stop-input, .real-target-input").forEach((input) => {
    input.addEventListener("click", (event) => event.stopPropagation());
  });
}

function addRealTrade() {
  const trades = window.CockpitStorage.loadRealTrades() || [];
  const pair = ui.realPair.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const entry = parseNumber(ui.realEntry.value);
  const stop = parseNumber(ui.realStop.value);
  const target = parseNumber(ui.realTarget.value);
  if (!pair || !Number.isFinite(entry)) return;
  trades.unshift(createRealTrade({
    pair,
    direction: ui.realDirection.value,
    style: ui.realStyle.value,
    entry,
    live: entry,
    margin: parseNumber(ui.realMargin.value) || 10,
    leverage: parseNumber(ui.realLeverage.value) || 10,
    stop,
    target,
    note: "Manual trade monitoring.",
  }));
  window.CockpitStorage.saveRealTrades(trades);
  ui.selectedCoin.value = pair;
  window.CockpitStorage.saveSelectedCoin(pair);
  syncCharts(pair);
  renderRealTrades();
  renderSelectedCoinAnalysis(pair);
}

function updateRealTradeLevels(tradeId) {
  const trades = (window.CockpitStorage.loadRealTrades() || []).map(normalizeRealTrade);
  const card = ui.realTradesList.querySelector(`.update-real-trade[data-trade="${tradeId}"]`)?.closest(".real-trade-card");
  const next = trades.map((trade) => {
    if (trade.id !== tradeId) return trade;
    const stop = parseNumber(card?.querySelector(".real-stop-input")?.value);
    const target = parseNumber(card?.querySelector(".real-target-input")?.value);
    return {
      ...trade,
      stop: Number.isFinite(stop) ? stop : trade.stop,
      target: Number.isFinite(target) ? target : trade.target,
      updatedAt: new Date().toISOString(),
    };
  });
  window.CockpitStorage.saveRealTrades(next);
  renderRealTrades();
}

function closeRealTrade(tradeId) {
  const trades = (window.CockpitStorage.loadRealTrades() || []).map(normalizeRealTrade);
  const trade = trades.find((item) => item.id === tradeId);
  if (!trade) return;
  const exitPrice = Number.isFinite(trade.live) ? trade.live : trade.entry;
  const realJournal = window.CockpitStorage.loadRealJournalEntries() || [];
  window.CockpitStorage.saveRealJournalEntries([realJournalEntryFromTrade(trade, exitPrice), ...realJournal]);
  window.CockpitStorage.saveRealTrades(trades.filter((item) => item.id !== tradeId));
  renderRealTrades();
  renderJournal();
}

async function updateRealTradesLive() {
  if (window.CockpitDataAdapter.getDataMode() !== "live") return;
  const trades = window.CockpitStorage.loadRealTrades();
  if (!trades?.length) return;
  const openTrades = trades.filter((trade) => trade.status === "open");
  const results = await Promise.allSettled(openTrades.map(async (trade) => [trade.id, await window.CockpitDataAdapter.fetchPrice(trade.pair)]));
  const priceById = Object.fromEntries(results.filter((result) => result.status === "fulfilled").map((result) => result.value));
  const next = trades.map((trade) => priceById[trade.id] ? { ...normalizeRealTrade(trade), live: priceById[trade.id] } : normalizeRealTrade(trade));
  window.CockpitStorage.saveRealTrades(next);
  renderRealTrades();
}

async function updateSelectedCoinLivePrice() {
  if (window.CockpitDataAdapter.getDataMode() !== "live") return;
  const pair = ui.selectedCoin.value;
  try {
    const live = await window.CockpitDataAdapter.fetchPrice(pair);
    const analysis = window.CockpitCoinAnalysis.selectedCoinAnalysis(pair, coinAnalyses);
    renderTopLivePrice({ ...analysis, pair, price: live });
    if (ui.selectedCoinPrice) ui.selectedCoinPrice.textContent = fmt(live);
  } catch {
    // keep last known value
  }
}

function renderRules() {
  ui.rulesTable.innerHTML = `
    <div class="rules-head"><span>Rule</span><span>Value</span><span>Why it exists</span></div>
    ${window.CockpitRulesEngine.ruleRows().map(([name, value, reason]) => `
      <div>
        <strong>${name}</strong>
        <span>${value}</span>
        <p>${reason}</p>
      </div>
    `).join("")}
  `;
}

function renderSelectedCoinAnalysis(pair = ui.selectedCoin.value) {
  ui.selectedCoinChange.textContent = window.CockpitDataAdapter.getDataMode() === "live" ? "live" : "mock";
  const analysis = window.CockpitCoinAnalysis.selectedCoinAnalysis(pair, coinAnalyses);
  const summary = window.CockpitCoinAnalysis.coinAnalysisSummary(analysis);
  renderTopLivePrice(analysis);
  ui.selectedCoinMeta.textContent = `${analysis.pair} | ${analysis.timeframe}`;
  ui.selectedCoinPrice.textContent = fmt(analysis.price);
  ui.selectedCoinChange.textContent = Number.isFinite(analysis.dayChange) ? `${signedPct(analysis.dayChange)} 1D` : ui.selectedCoinChange.textContent;
  ui.selectedCoinMetrics.innerHTML = `
    <span>Bias <b>${analysis.directionBias}</b></span>
    <span>VWAP <b>${analysis.aboveVwap ? "nad" : "pod"}</b></span>
    <span>Volume <b>${analysis.volumeRatio.toFixed(1)}x</b></span>
    <span>OI <b>${analysis.oiLabel}${Number.isFinite(analysis.oiChange) ? ` ${signedPct(analysis.oiChange)}` : ""}</b></span>
    <span>Room <b>${analysis.normalized.room.toFixed(1)} ATR</b></span>
    <span>Risk <b>${Object.values(analysis.risks).join(" / ")}</b></span>
  `;
  ui.selectedCoinSummary.textContent = summary.text;
}

function updateScannerStatusComplete() {
  const settings = scannerSettings();
  const shown = candidates.filter((item) => {
    const stateOk = item.state !== CandidateState.REJECTED;
    const directionOk = settings.direction === "both" || item.direction === settings.direction;
    const qualityOk = item.score.coin >= settings.minQuality;
    const edgeOk = item.score.edge >= settings.minEdge;
    return stateOk && directionOk && qualityOk && edgeOk;
  }).length;
  setScannerStatus("done", "2-step scan complete", `Market Sweep + Setup Analysis prebehli na ${coinAnalyses.length} coinoch, zobrazené ${shown} kandidátov.`);
}

async function rebuildPipeline() {
  const mode = window.CockpitDataAdapter.getDataMode();
  const settings = scannerSettings();
  const scanInterval = scannerIntervalForStyle(settings.style);
  const liveUniverseSize = window.CockpitDataAdapter.DEFAULT_LIVE_UNIVERSE?.length || 20;
  setScannerStatus("loading", "Stage 1/2: Market Sweep", `Načítavam ${mode === "live" ? `${liveUniverseSize} live Binance futures coinov` : "fallback universe"} na ${scanInterval}. Potom pôjde Setup Analysis.`);
  ui.selectedCoinChange.textContent = window.CockpitDataAdapter.getDataMode() === "live" ? "loading live..." : "mock";
  try {
    coinAnalyses = await window.CockpitDataAdapter.getCoinAnalyses({
      mode: window.CockpitDataAdapter.getDataMode(),
      interval: scanInterval,
    });
  } catch (error) {
    coinAnalyses = window.CockpitCoinAnalysis.buildCoinAnalyses();
    ui.selectedCoinChange.textContent = "live failed, fallback";
    setScannerStatus("warn", "Live scan failed", "Live dáta sa nepodarilo načítať, appka použila fallback dáta.");
  }
  const regime = window.CockpitMarketRegime.mockMarketRegime;
  const scanned = window.CockpitScanner.runScannerFromAnalyses(coinAnalyses, regime, settings.style);
  candidates = settings.marketRegimeFilter ? window.CockpitRulesEngine.applyRulesToCandidates(scanned) : scanned;
  selectedCandidate = candidates.find((candidate) => candidate.pair === ui.selectedCoin.value) || candidates[0];
  if (selectedCandidate) ui.selectedCoin.value = selectedCandidate.pair;
  renderCandidates();
  renderSignalDetail(selectedCandidate);
  renderTriggerBoard();
  renderPaper();
  renderJournal();
  renderRealTrades();
  renderSelectedCoinAnalysis(ui.selectedCoin.value);
  updateScannerStatusComplete();
}

async function rebuildScalpPipeline() {
  const mode = window.CockpitDataAdapter.getDataMode();
  const universeSize = window.CockpitDataAdapter.DEFAULT_LIVE_UNIVERSE?.length || 50;
  setScalpStatus("loading", "Scalp scan beží", `Načítavam ${mode === "live" ? `${universeSize} live Binance futures coinov` : "fallback universe"} na 15m a filtrujem iba scalp setupy.`);
  try {
    scalpAnalyses = await window.CockpitDataAdapter.getCoinAnalyses({
      mode,
      interval: "15m",
    });
  } catch {
    scalpAnalyses = window.CockpitCoinAnalysis.buildCoinAnalyses();
    setScalpStatus("warn", "Live scalp scan failed", "Live dáta sa nepodarilo načítať, appka použila fallback dáta.");
  }
  const regime = window.CockpitMarketRegime.mockMarketRegime;
  scalpCandidates = scalpAnalyses
    .map((analysis) => window.CockpitScanner.buildCandidateFromAnalysis(analysis, regime, TradeStyle.SCALP))
    .sort((a, b) => {
      const setupA = a.setupType === "No trade" ? 0 : 25;
      const setupB = b.setupType === "No trade" ? 0 : 25;
      return (b.score.trigger + setupB) - (a.score.trigger + setupA) || b.score.final - a.score.final;
    });
  selectedScalpCandidate = scalpCandidates.find((candidate) => candidate.pair === ui.selectedCoin.value) || scalpCandidates[0] || null;
  renderScalpCandidates();
  const shown = scalpCandidates.filter((candidate) => scalpCandidatePasses(candidate, scalpSettings())).length;
  setScalpStatus("done", "Scalp scan complete", `Zobrazené ${shown} z ${scalpCandidates.length} raw scalp kandidátov / ${scalpAnalyses.length} coinov. No trade položky sú iba watch, nie vstup.`);
}

function renderMarketRegime() {
  const regime = window.CockpitMarketRegime.mockMarketRegime;
  const components = regime.components;
  ui.btcStatus.className = `status-chip ${components.btc.includes("bearish") ? "bad" : components.btc.includes("mixed") ? "neutral" : "good"}`;
  ui.ethStatus.className = `status-chip ${components.eth.includes("bearish") ? "bad" : components.eth.includes("mixed") ? "neutral" : "good"}`;
  ui.marketStatus.className = `status-chip ${regime.tone}`;
  ui.btcStatus.querySelector("strong").textContent = components.btc;
  ui.ethStatus.querySelector("strong").textContent = components.eth;
  ui.marketStatus.querySelector("strong").textContent = regime.label;
  ui.regimeBadge.className = `badge ${regime.tone}`;
  ui.regimeBadge.textContent = regime.label;
  ui.regimeScore.textContent = regime.score;
  ui.regimeAdvice.textContent = regime.advice;
  ui.regimeMetrics.innerHTML = `
    <span>BTC trend <b>${components.btc}</b></span>
    <span>ETH trend <b>${components.eth}</b></span>
    <span>Funding <b>${components.avgFunding.toFixed(3)}%</b></span>
    <span>OI change <b>${components.oiChange.toFixed(2)}%</b></span>
    <span>Volatility <b>${components.volatility}</b></span>
    <span>Alt breadth <b>${components.altBreadth}</b></span>
  `;
  const settings = scannerSettings();
  const scanned = window.CockpitScanner.runScannerFromAnalyses(coinAnalyses, regime, settings.style);
  candidates = settings.marketRegimeFilter ? window.CockpitRulesEngine.applyRulesToCandidates(scanned) : scanned;
  selectedCandidate = candidates[0];
}

ui.navButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

ui.selectedCoin.addEventListener("change", () => {
  ui.selectedCoin.value = ui.selectedCoin.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  window.CockpitStorage.saveSelectedCoin(ui.selectedCoin.value);
  syncCharts(ui.selectedCoin.value);
  renderSelectedCoinAnalysis(ui.selectedCoin.value);
});

ui.dataMode?.addEventListener("change", () => {
  window.CockpitDataAdapter.setDataMode("live");
  window.CockpitStorage.saveDataMode("live");
  rebuildPipeline();
});

ui.scanRefreshButton?.addEventListener("click", () => {
  rebuildPipeline();
});

ui.scalpScanButton?.addEventListener("click", () => {
  rebuildScalpPipeline();
});

[ui.scalpDirection, ui.scalpMinTrigger, ui.scalpMinQuality, ui.scalpNearOnly, ui.scalpStrictLong].forEach((control) => {
  control?.addEventListener("change", () => {
    renderScalpCandidates();
    const shown = scalpCandidates.filter((candidate) => scalpCandidatePasses(candidate, scalpSettings())).length;
    if (scalpCandidates.length) setScalpStatus("done", "Scalp filter updated", `Zobrazené ${shown} kandidátov z ${scalpCandidates.length} po úprave filtra.`);
  });
});

[ui.scannerStyle, ui.scannerDirection, ui.scannerMinQuality, ui.scannerMinEdge, ui.marketRegimeFilter].forEach((control) => {
  control?.addEventListener("change", () => {
    if (control === ui.scannerStyle) {
      rebuildPipeline();
      return;
    }
    renderMarketRegime();
    renderCandidates();
    renderSignalDetail(candidates[0]);
    renderTriggerBoard();
  });
});

ui.clearJournalButton?.addEventListener("click", () => {
  window.CockpitStorage.saveJournalEntries([]);
  window.CockpitStorage.saveRealJournalEntries([]);
  renderJournal();
});

ui.startPaperButton?.addEventListener("click", startPaperFromSelected);
ui.startScalpPaperButton?.addEventListener("click", () => {
  if (!selectedScalpCandidate) return;
  selectedCandidate = selectedScalpCandidate;
  startPaperFromSelected();
});
ui.openScalpSignalButton?.addEventListener("click", () => {
  if (!selectedScalpCandidate) return;
  selectedCandidate = selectedScalpCandidate;
  renderSignalDetail(selectedCandidate);
  setView("signal");
});
ui.addRealTradeButton?.addEventListener("click", addRealTrade);

setInterval(updateLivePaperTracking, 7000);
setInterval(updateRealTradesLive, 9000);
setInterval(updateSelectedCoinLivePrice, 5000);

renderMarketRegime();
renderCandidates();
renderSignalDetail();
renderTriggerBoard();
renderPaper();
renderJournal();
renderRealTrades();
renderRules();
renderSelectedCoinAnalysis();
syncCharts(ui.selectedCoin.value);
rebuildPipeline();
