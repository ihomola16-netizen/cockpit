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
  clearPaperButton: document.getElementById("clearPaperButton"),
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
  paperChartMeta: document.getElementById("paperChartMeta"),
  realChartMeta: document.getElementById("realChartMeta"),
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

function setScannerStatus(state, title, text) {
  if (!ui.scannerStatus) return;
  ui.scannerStatus.className = `panel scanner-status ${state}`;
  ui.scannerStatus.querySelector("strong").textContent = title;
  ui.scannerStatus.querySelector("p").textContent = text;
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

function movePct(entry, price, direction) {
  if (!Number.isFinite(entry) || !Number.isFinite(price) || entry === 0) return NaN;
  return ((price - entry) / entry) * 100 * (direction === "long" ? 1 : -1);
}

function signedPct(value) {
  if (!Number.isFinite(value)) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
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
  if (ui.paperChartMeta) ui.paperChartMeta.textContent = `${pair} | 1h`;
  if (ui.realChartMeta) ui.realChartMeta.textContent = `${pair} | 1h`;
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
    <span>OI <b>${candidate.metrics.oiLabel}</b></span>
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

function renderCandidates() {
  const settings = scannerSettings();
  const filtered = candidates.filter((item) => {
    const directionOk = settings.direction === "both" || item.direction === settings.direction;
    const qualityOk = item.score.coin >= settings.minQuality;
    const edgeOk = item.score.edge >= settings.minEdge;
    return directionOk && qualityOk && edgeOk;
  });
  ui.candidateUniverseLabel.textContent = window.CockpitDataAdapter.getDataMode() === "live"
    ? `${filtered.length}/${coinAnalyses.length} live candidates`
    : `${filtered.length}/${coinAnalyses.length} mock candidates`;
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
    <div class="candidate-row ${item.pair === "SOLUSDT" ? "active" : ""}" data-coin="${item.pair}">
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
  ui.signalTitle.textContent = `${candidate.pair} ${candidate.direction.toUpperCase()}`;
  ui.signalSubtitle.innerHTML = `${candidate.setupType} | ${titleCase(candidate.style)} | state: <b class="${candidate.state === "rejected" ? "danger" : "positive"}">${titleCase(candidate.state)}</b>`;
  ui.signalScores.innerHTML = `
    <span>Quality <b>${candidate.score.coin}</b></span>
    <span>Setup <b>${candidate.score.setup}</b></span>
    <span>Trigger <b>${candidate.score.trigger}</b></span>
    <span>Risk <b>${candidate.score.risk}</b></span>
    <span>Final <b>${candidate.score.final}</b></span>
  `;
  ui.signalChecklist.innerHTML = checklistForCandidate(candidate).map((item) => `
    <li class="${item.status}">${item.label}</li>
  `).join("");
  ui.signalReasons.innerHTML = `
    <div><strong>Za obchod</strong><span>${candidate.reasonsFor.join(", ") || "Bez silného potvrdenia"}</span></div>
    <div><strong>Riziká</strong><span>${candidate.reasonsAgainst.join(", ") || "Bez veľkého varovania"}</span></div>
  `;
  ui.signalPlans.innerHTML = candidate.tradePlans.map((plan) => {
    const tp1 = plan.targets[0];
    const tp2 = plan.targets[1];
    return `
      <div class="plan-card ${plan.style === candidate.style ? "active" : ""}">
        <span>${titleCase(plan.style)}</span>
        <strong>${plan.note}</strong>
        <p>Entry ${fmt(plan.entry)} | SL ${fmt(plan.stop)} <b class="danger">${signedPct(movePct(plan.entry, plan.stop, plan.direction))}</b></p>
        <p>${tp1.label} ${fmt(tp1.price)} <b class="positive">${signedPct(movePct(plan.entry, tp1.price, plan.direction))}</b> | ${tp2.label} ${fmt(tp2.price)} <b class="positive">${signedPct(movePct(plan.entry, tp2.price, plan.direction))}</b></p>
        <small>${plan.invalidation}</small>
      </div>
    `;
  }).join("");
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
  const triggers = window.CockpitTriggerEngine.buildTriggerBoard(candidates);
  ui.triggerList.innerHTML = triggers.map((trigger) => {
    const done = trigger.checklist.filter((item) => item.status === "done").length;
    const pending = trigger.checklist.filter((item) => item.status === "pending").length;
    const failed = trigger.checklist.filter((item) => item.status === "fail").length;
    const zone = trigger.entryZone ? `${fmt(trigger.entryZone.from)} - ${fmt(trigger.entryZone.to)}` : "-";
    return `
      <div class="trigger-item" data-candidate="${trigger.candidateId}">
        <div class="trigger-top">
          <strong>${trigger.pair} ${trigger.direction.toUpperCase()}</strong>
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
      </div>
    `;
  }).join("");

  ui.triggerList.querySelectorAll(".trigger-item").forEach((item) => {
    item.addEventListener("click", () => {
      const candidate = candidates.find((candidateItem) => candidateItem.id === item.dataset.candidate);
      if (candidate) {
        selectCandidate(candidate);
        setView("signal");
      }
    });
  });
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
        <span class="badge ${isActive ? "good" : "warn"}">${titleCase(trade.status)}</span>
      </div>
      <p>${trade.setupType} | ${titleCase(trade.style)} | ${trade.triggerType}</p>
      <div class="paper-row">
        <span>Entry <b>${fmt(shownEntry)}</b></span>
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
}

function paperState() {
  return window.CockpitStorage.loadPaperState() || window.CockpitPaperSimulator.emptyPaperState();
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
    <div class="journal-head"><span>Coin</span><span>Style</span><span>Setup</span><span>Entry</span><span>Exit</span><span>10x</span><span>Reason</span></div>
    ${state.entries.map((entry) => `
      <div>
        <span>${entry.pair}</span>
        <span>${titleCase(entry.style)}</span>
        <span>${entry.setupType}</span>
        <span>${fmt(entry.entry)}</span>
        <span>${fmt(entry.exit)}</span>
        <span class="${entry.leveragedPct >= 0 ? "positive" : "danger"}">${signedPct(entry.leveragedPct)}</span>
        <span>${entry.exitReason} | ${entry.failurePattern}</span>
      </div>
    `).join("")}
  `;
}

function mockRealTrades() {
  return [
    createRealTrade({
      pair: "SOLUSDT",
      direction: Direction.LONG,
      style: TradeStyle.INTRADAY,
      entry: 142.2,
      live: 143.1,
      margin: 25,
      leverage: 10,
      stop: 140.8,
      target: 146.1,
      note: "Mock real trade monitoring.",
    }),
  ];
}

function renderRealTrades() {
  const stored = window.CockpitStorage.loadRealTrades();
  const trades = stored || [];
  if (!stored) window.CockpitStorage.saveRealTrades([]);
  ui.realTradesList.innerHTML = `
    <div class="panel-head"><h2>Open Real Trades</h2><span>${trades.filter((trade) => trade.status === "open").length} open</span></div>
    <div class="paper-stack">
      ${trades.map((trade) => {
        const live = Number.isFinite(trade.live) ? trade.live : trade.entry;
        const result = movePct(trade.entry, live, trade.direction);
        const leveraged = result * trade.leverage;
        const riskDistance = movePct(trade.entry, trade.stop, trade.direction);
        const targetDistance = movePct(trade.entry, trade.target, trade.direction);
        return `
          <article class="paper-trade-card active">
            <div class="panel-head"><h2>${trade.pair} ${trade.direction.toUpperCase()}</h2><span class="badge good">${titleCase(trade.status)}</span></div>
            <p>${titleCase(trade.style)} | ${trade.note}</p>
            <div class="paper-row">
              <span>Entry <b>${fmt(trade.entry)}</b></span>
              <span>Live <b>${fmt(live)}</b></span>
              <span class="${leveraged >= 0 ? "positive" : "danger"}">${trade.leverage}x ${signedPct(leveraged)}</span>
              <span class="danger">SL ${fmt(trade.stop)} ${signedPct(riskDistance)}</span>
              <span>TP ${fmt(trade.target)} ${signedPct(targetDistance)}</span>
            </div>
            <p class="summary">Management: drž plán, partial až pri TP alebo pri zhoršení market režimu.</p>
          </article>
        `;
      }).join("") || `<p class="muted">Žiadne real trades. Pridaj obchod manuálne cez formulár vyššie.</p>`}
    </div>
  `;
}

function addRealTrade() {
  const trades = window.CockpitStorage.loadRealTrades() || [];
  const pair = ui.realPair.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!pair) return;
  trades.unshift(createRealTrade({
    pair,
    direction: ui.realDirection.value,
    style: ui.realStyle.value,
    entry: Number(ui.realEntry.value),
    live: Number(ui.realEntry.value),
    margin: Number(ui.realMargin.value) || 10,
    leverage: Number(ui.realLeverage.value) || 10,
    stop: Number(ui.realStop.value),
    target: Number(ui.realTarget.value),
    note: "Manual trade monitoring.",
  }));
  window.CockpitStorage.saveRealTrades(trades);
  ui.selectedCoin.value = pair;
  window.CockpitStorage.saveSelectedCoin(pair);
  syncCharts(pair);
  renderRealTrades();
  renderSelectedCoinAnalysis(pair);
}

async function updateRealTradesLive() {
  if (window.CockpitDataAdapter.getDataMode() !== "live") return;
  const trades = window.CockpitStorage.loadRealTrades();
  if (!trades?.length) return;
  const openTrades = trades.filter((trade) => trade.status === "open");
  const results = await Promise.allSettled(openTrades.map(async (trade) => [trade.id, await window.CockpitDataAdapter.fetchPrice(trade.pair)]));
  const priceById = Object.fromEntries(results.filter((result) => result.status === "fulfilled").map((result) => result.value));
  const next = trades.map((trade) => priceById[trade.id] ? { ...trade, live: priceById[trade.id] } : trade);
  window.CockpitStorage.saveRealTrades(next);
  renderRealTrades();
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
  ui.selectedCoinMeta.textContent = `${analysis.pair} | ${analysis.timeframe}`;
  ui.selectedCoinPrice.textContent = fmt(analysis.price);
  ui.selectedCoinChange.textContent = Number.isFinite(analysis.dayChange) ? `${signedPct(analysis.dayChange)} 1D` : ui.selectedCoinChange.textContent;
  ui.selectedCoinMetrics.innerHTML = `
    <span>Bias <b>${analysis.directionBias}</b></span>
    <span>VWAP <b>${analysis.aboveVwap ? "nad" : "pod"}</b></span>
    <span>Volume <b>${analysis.volumeRatio.toFixed(1)}x</b></span>
    <span>Room <b>${analysis.normalized.room.toFixed(1)} ATR</b></span>
    <span>Risk <b>${Object.values(analysis.risks).join(" / ")}</b></span>
  `;
  ui.selectedCoinSummary.textContent = summary.text;
}

function updateScannerStatusComplete() {
  const settings = scannerSettings();
  const shown = candidates.filter((item) => {
    const directionOk = settings.direction === "both" || item.direction === settings.direction;
    const qualityOk = item.score.coin >= settings.minQuality;
    const edgeOk = item.score.edge >= settings.minEdge;
    return directionOk && qualityOk && edgeOk;
  }).length;
  setScannerStatus("done", "Scan complete", `Preskenované ${coinAnalyses.length} coinov, zobrazené ${shown} kandidátov po filtroch.`);
}

async function rebuildPipeline() {
  const mode = window.CockpitDataAdapter.getDataMode();
  const liveUniverseSize = window.CockpitDataAdapter.DEFAULT_LIVE_UNIVERSE?.length || 20;
  setScannerStatus("loading", "Scanning...", `Načítavam a vyhodnocujem ${mode === "live" ? `${liveUniverseSize} live Binance futures coinov` : "fallback universe"}.`);
  ui.selectedCoinChange.textContent = window.CockpitDataAdapter.getDataMode() === "live" ? "loading live..." : "mock";
  try {
    coinAnalyses = await window.CockpitDataAdapter.getCoinAnalyses({
      mode: window.CockpitDataAdapter.getDataMode(),
      interval: "1h",
    });
  } catch (error) {
    coinAnalyses = window.CockpitCoinAnalysis.buildCoinAnalyses();
    ui.selectedCoinChange.textContent = "live failed, fallback";
    setScannerStatus("warn", "Live scan failed", "Live dáta sa nepodarilo načítať, appka použila fallback dáta.");
  }
  const regime = window.CockpitMarketRegime.mockMarketRegime;
  const settings = scannerSettings();
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

[ui.scannerStyle, ui.scannerDirection, ui.scannerMinQuality, ui.scannerMinEdge, ui.marketRegimeFilter].forEach((control) => {
  control?.addEventListener("change", () => {
    renderMarketRegime();
    renderCandidates();
    renderSignalDetail(candidates[0]);
    renderTriggerBoard();
  });
});

ui.clearPaperButton?.addEventListener("click", () => {
  window.CockpitStorage.clearAllRuntimeStorage();
  window.CockpitStorage.savePaperState(window.CockpitPaperSimulator.emptyPaperState());
  window.CockpitStorage.saveJournalEntries([]);
  window.CockpitStorage.saveRealTrades([]);
  renderPaper();
  renderJournal();
  renderRealTrades();
});

ui.startPaperButton?.addEventListener("click", startPaperFromSelected);
ui.addRealTradeButton?.addEventListener("click", addRealTrade);

setInterval(updateLivePaperTracking, 7000);
setInterval(updateRealTradesLive, 9000);

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
