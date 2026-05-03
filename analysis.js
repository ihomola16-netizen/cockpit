const ui = {
  coinSelect: document.getElementById("coinSelect"),
  symbol: document.getElementById("symbol"),
  tradeStyle: document.getElementById("tradeStyle"),
  traderLens: document.getElementById("traderLens"),
  timeframe: document.getElementById("timeframe"),
  refreshButton: document.getElementById("refreshButton"),
  refreshMtfButton: document.getElementById("refreshMtfButton"),
  headerLivePrice: document.getElementById("headerLivePrice"),
  scanButton: document.getElementById("scanButton"),
  scannerThreshold: document.getElementById("scannerThreshold"),
  scannerStyle: document.getElementById("scannerStyle"),
  scannerStatus: document.getElementById("scannerStatus"),
  scannerList: document.getElementById("scannerList"),
  reloadFeedButton: document.getElementById("reloadFeedButton"),
  feedStatus: document.getElementById("feedStatus"),
  feedList: document.getElementById("feedList"),
  aiCommentButton: document.getElementById("aiCommentButton"),
  aiComment: document.getElementById("aiComment"),
  aiPrompt: document.getElementById("aiPrompt"),
  philosophyName: document.getElementById("philosophyName"),
  philosophyCopy: document.getElementById("philosophyCopy"),
  philosophyRules: document.getElementById("philosophyRules"),
  verdictCard: document.getElementById("verdictCard"),
  biasLabel: document.getElementById("biasLabel"),
  biasText: document.getElementById("biasText"),
  livePrice: document.getElementById("livePrice"),
  priceState: document.getElementById("priceState"),
  funding: document.getElementById("funding"),
  fundingText: document.getElementById("fundingText"),
  openInterest: document.getElementById("openInterest"),
  oiText: document.getElementById("oiText"),
  priceChart: document.getElementById("priceChart"),
  chartEmpty: document.getElementById("chartEmpty"),
  updatedAt: document.getElementById("updatedAt"),
  emaStack: document.getElementById("emaStack"),
  rsi: document.getElementById("rsi"),
  macd: document.getElementById("macd"),
  atr: document.getElementById("atr"),
  vwapPosition: document.getElementById("vwapPosition"),
  volume: document.getElementById("volume"),
  mtf15m: document.getElementById("mtf15m"),
  mtf15mText: document.getElementById("mtf15mText"),
  mtf1h: document.getElementById("mtf1h"),
  mtf1hText: document.getElementById("mtf1hText"),
  mtf4h: document.getElementById("mtf4h"),
  mtf4hText: document.getElementById("mtf4hText"),
  mtfSummary: document.getElementById("mtfSummary"),
  longFilterScore: document.getElementById("longFilterScore"),
  shortFilterScore: document.getElementById("shortFilterScore"),
  longRules: document.getElementById("longRules"),
  shortRules: document.getElementById("shortRules"),
  resistance: document.getElementById("resistance"),
  support: document.getElementById("support"),
  midRange: document.getElementById("midRange"),
  scenarioMode: document.getElementById("scenarioMode"),
  longScenario: document.getElementById("longScenario"),
  shortScenario: document.getElementById("shortScenario"),
  waitScenario: document.getElementById("waitScenario"),
  entryStyleLabel: document.getElementById("entryStyleLabel"),
  longQuality: document.getElementById("longQuality"),
  longEntryA: document.getElementById("longEntryA"),
  longEntryB: document.getElementById("longEntryB"),
  longStop: document.getElementById("longStop"),
  longTargets: document.getElementById("longTargets"),
  longReason: document.getElementById("longReason"),
  shortQuality: document.getElementById("shortQuality"),
  shortEntryA: document.getElementById("shortEntryA"),
  shortEntryB: document.getElementById("shortEntryB"),
  shortStop: document.getElementById("shortStop"),
  shortTargets: document.getElementById("shortTargets"),
  shortReason: document.getElementById("shortReason"),
  addTradeButton: document.getElementById("addTradeButton"),
  tradeSymbol: document.getElementById("tradeSymbol"),
  tradeSide: document.getElementById("tradeSide"),
  tradeLeverage: document.getElementById("tradeLeverage"),
  tradeSizeMode: document.getElementById("tradeSizeMode"),
  tradeEntry: document.getElementById("tradeEntry"),
  tradeQty: document.getElementById("tradeQty"),
  tradeStop: document.getElementById("tradeStop"),
  tradeTarget: document.getElementById("tradeTarget"),
  tradeNote: document.getElementById("tradeNote"),
  openTrades: document.getElementById("openTrades"),
  addTriggerButton: document.getElementById("addTriggerButton"),
  triggerSymbol: document.getElementById("triggerSymbol"),
  triggerCondition: document.getElementById("triggerCondition"),
  triggerPrice: document.getElementById("triggerPrice"),
  triggerSide: document.getElementById("triggerSide"),
  triggerLeverage: document.getElementById("triggerLeverage"),
  triggerSizeMode: document.getElementById("triggerSizeMode"),
  triggerSize: document.getElementById("triggerSize"),
  triggerStop: document.getElementById("triggerStop"),
  triggerTarget: document.getElementById("triggerTarget"),
  triggerNote: document.getElementById("triggerNote"),
  triggerList: document.getElementById("triggerList"),
  clearClosedTradesButton: document.getElementById("clearClosedTradesButton"),
  closedCount: document.getElementById("closedCount"),
  closedWinrate: document.getElementById("closedWinrate"),
  closedTotalR: document.getElementById("closedTotalR"),
  closedAvgR: document.getElementById("closedAvgR"),
  closedPnl: document.getElementById("closedPnl"),
  closedTrades: document.getElementById("closedTrades"),
  closeTradeDialog: document.getElementById("closeTradeDialog"),
  closeTradeText: document.getElementById("closeTradeText"),
  closeTradeExit: document.getElementById("closeTradeExit"),
  closeUseLiveButton: document.getElementById("closeUseLiveButton"),
  closeCancelButton: document.getElementById("closeCancelButton"),
  closeConfirmButton: document.getElementById("closeConfirmButton"),
  editTradeDialog: document.getElementById("editTradeDialog"),
  editTradeText: document.getElementById("editTradeText"),
  editTradeStop: document.getElementById("editTradeStop"),
  editTradeTarget: document.getElementById("editTradeTarget"),
  editTradeNote: document.getElementById("editTradeNote"),
  editConfirmButton: document.getElementById("editConfirmButton"),
};

let socket = null;
let marketTimer = null;
let pricePollTimer = null;
let candlesCache = [];
let latestSnapshot = null;
let traderFeed = { updatedAt: null, source: "@eliz883", items: [] };
let pendingCloseIndex = null;
let pendingCloseLivePrice = NaN;
let pendingEditIndex = null;
const openTradesKey = "analysis-open-trades";
const closedTradesKey = "analysis-closed-trades";
const tradeTriggersKey = "analysis-trade-triggers";
const styles = {
  scalp: {
    label: "SCALP",
    preferredTf: "1m/5m",
    entryAtr: 0.22,
    stopAtr: 0.55,
    targetR: [1.2, 1.8],
    qualityBias: 18,
    note: "Rychly vstup, maly stop, neodpustat pomaly pohyb.",
  },
  intraday: {
    label: "INTRADAY",
    preferredTf: "5m/15m/1h",
    entryAtr: 0.38,
    stopAtr: 0.9,
    targetR: [1.5, 2.3],
    qualityBias: 24,
    note: "Cakat na pullback alebo retest, nebrat stred range.",
  },
  swing: {
    label: "SWING",
    preferredTf: "1h/4h/1d",
    entryAtr: 0.65,
    stopAtr: 1.35,
    targetR: [2, 3.2],
    qualityBias: 28,
    note: "Nizsia paka, vacsi stop za strukturou, obchod potrebuje priestor.",
  },
};
const fallbackScannerWatchlist = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", "DOGEUSDT", "ADAUSDT", "AVAXUSDT", "LINKUSDT", "SUIUSDT", "NEARUSDT", "INJUSDT"];
let topScannerSymbols = [];
const philosophyProfiles = {
  standard: {
    label: "STANDARD",
    copy: "Standardny filter kombinuje trend, momentum, volatilitu, volume, funding a urovne.",
    rules: ["Trend a VWAP urcuju bias.", "RSI/MACD pomahaju citat momentum.", "ATR, volume a funding urcuju kvalitu podmienok."],
  },
  eliz: {
    label: "PATIENCE / RANGE",
    copy: "Prisnejsi rezim inspirovany filozofiou: neobchodovat nudny low-liquidity chop, nenahanat spike, cakat na strukturu, range hrany, flip/retest alebo reclaim.",
    rules: ["Low liquidity = nizsia kvalita, aj ked smer vyzera dobre.", "Stred range je no-trade zona; hladat hrany, reclaim alebo odmietnutie.", "Po spiku necakat FOMO vstup, ale potvrdenie a retest.", "Ak je graf strukturalne zlomeny, long az po reclaim/reversal."],
  },
};

function symbol() {
  return ui.symbol.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function fmt(value, digits = 2) {
  if (!Number.isFinite(value)) return "-";
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function pct(value, digits = 3) {
  if (!Number.isFinite(value)) return "-";
  return `${value.toFixed(digits)} %`;
}

async function getJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function getJsonOr(url, fallback) {
  try {
    return await getJson(url);
  } catch {
    return fallback;
  }
}

function setView(view) {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  document.querySelectorAll(".view-section").forEach((section) => {
    const sections = section.dataset.section.split(" ");
    section.classList.toggle("hidden", !sections.includes(view));
  });
}

function getOpenTrades() {
  return JSON.parse(localStorage.getItem(openTradesKey) || "[]");
}

function setOpenTrades(trades) {
  localStorage.setItem(openTradesKey, JSON.stringify(trades));
}

function getClosedTrades() {
  return JSON.parse(localStorage.getItem(closedTradesKey) || "[]");
}

function setClosedTrades(trades) {
  localStorage.setItem(closedTradesKey, JSON.stringify(trades));
}

function getTradeTriggers() {
  return JSON.parse(localStorage.getItem(tradeTriggersKey) || "[]");
}

function setTradeTriggers(triggers) {
  localStorage.setItem(tradeTriggersKey, JSON.stringify(triggers));
}

async function getPublicPrice(pair) {
  try {
    const data = await getJson(`https://fapi.binance.com/fapi/v1/ticker/price?symbol=${pair}`);
    return Number(data.price);
  } catch {
    const data = await getJson(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`);
    return Number(data.price);
  }
}

function activeTradeStyle() {
  return window.__scannerStyleOverride || ui.tradeStyle.value;
}

async function getTradeMarkers(pair) {
  const lsPeriodByStyle = {
    scalp: "15m",
    intraday: "1h",
    swing: "4h",
  };
  const lsPeriod = lsPeriodByStyle[activeTradeStyle()] || "1h";
  try {
    const [openInterest, ticker, premium, longShort] = await Promise.all([
      getJson(`https://fapi.binance.com/fapi/v1/openInterest?symbol=${pair}`),
      getJson(`https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${pair}`),
      getJson(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${pair}`),
      getJson(`https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${pair}&period=${lsPeriod}&limit=1`),
    ]);
    const ls = Array.isArray(longShort) ? longShort.at(-1) : null;
    return {
      openInterest: Number(openInterest.openInterest),
      volume: Number(ticker.quoteVolume),
      funding: Number(premium.lastFundingRate) * 100,
      longShortRatio: ls ? Number(ls.longShortRatio) : NaN,
      longAccount: ls ? Number(ls.longAccount) * 100 : NaN,
      shortAccount: ls ? Number(ls.shortAccount) * 100 : NaN,
      lsPeriod,
    };
  } catch {
    return {
      openInterest: NaN,
      volume: NaN,
      funding: NaN,
      longShortRatio: NaN,
      longAccount: NaN,
      shortAccount: NaN,
      lsPeriod,
    };
  }
}

async function getOiContext(pair, interval) {
  const periodByTf = {
    "1m": "5m",
    "5m": "5m",
    "15m": "15m",
    "1h": "1h",
    "4h": "4h",
    "1d": "1d",
  };
  const period = periodByTf[interval] || "1h";
  try {
    const [oiHistory, candles] = await Promise.all([
      getJson(`https://fapi.binance.com/futures/data/openInterestHist?symbol=${pair}&period=${period}&limit=2`),
      getJson(`https://fapi.binance.com/fapi/v1/klines?symbol=${pair}&interval=${interval}&limit=2`),
    ]);
    const firstOi = Number(oiHistory[0]?.sumOpenInterest);
    const lastOi = Number(oiHistory.at(-1)?.sumOpenInterest);
    const firstClose = Number(candles[0]?.[4]);
    const lastClose = Number(candles.at(-1)?.[4]);
    const oiChange = ((lastOi - firstOi) / firstOi) * 100;
    const priceChange = ((lastClose - firstClose) / firstClose) * 100;
    let label = "Neutral";
    let text = "OI nema jasny signal.";

    if (priceChange > 0.15 && oiChange > 0.5) {
      label = "Trend support";
      text = "Cena rastie a OI rastie: do pohybu vstupuju nove pozicie.";
    } else if (priceChange > 0.15 && oiChange < -0.5) {
      label = "Short squeeze / covering";
      text = "Cena rastie, ale OI klesa: pohyb moze byt zatvaranie shortov.";
    } else if (priceChange < -0.15 && oiChange > 0.5) {
      label = "Short pressure";
      text = "Cena klesa a OI rastie: pribuda agresivny tlak alebo nove shorty.";
    } else if (priceChange < -0.15 && oiChange < -0.5) {
      label = "Deleveraging";
      text = "Cena klesa a OI klesa: pozicie sa zatvaraju, pohyb moze slabnut.";
    } else if (Math.abs(priceChange) < 0.15 && Math.abs(oiChange) > 1) {
      label = "Leverage build-up";
      text = "Cena stoji, ale OI rastie/klesa vyrazne: rastie riziko vyplachu.";
    }

    return { period, oiChange, priceChange, label, text };
  } catch {
    return { period, oiChange: NaN, priceChange: NaN, label: "OI kontext nedostupny", text: "Historiu OI sa nepodarilo nacitat." };
  }
}

async function analyzeOpenTrade(trade, current, pnl, resultR) {
  if (!Number.isFinite(current)) {
    return { level: "warn", title: "Bez live ceny", text: "Neviem nacitat aktualnu cenu, analyza obchodu je docasne nedostupna." };
  }

  try {
    const snapshot = await analyzeSymbol(trade.symbol, ui.timeframe.value);
    const sideScore = trade.side === "long" ? snapshot.longScore : snapshot.shortScore;
    const oppositeScore = trade.side === "long" ? snapshot.shortScore : snapshot.longScore;
    const direction = trade.side === "long" ? 1 : -1;
    const stopRisk = Math.abs(trade.entry - trade.stop);
    const movedAgainst = (current - trade.entry) * direction < 0;
    const stopDistance = Math.abs(current - trade.stop);
    const targetDistance = Math.abs(trade.target - current);
    const nearStop = stopRisk > 0 && stopDistance <= stopRisk * 0.35;
    const nearTarget = stopRisk > 0 && targetDistance <= stopRisk * 0.45;

    if (sideScore < 45 && oppositeScore > sideScore + 20) {
      return {
        level: "bad",
        title: "Setup sa zhorsil",
        text: `${trade.side.toUpperCase()} filter ma ${sideScore}/100, opacny smer ${oppositeScore}/100. Obchod uz nesedi s aktualnym biasom, kontroluj invalidaciu.`,
      };
    }

    if (nearStop && movedAgainst) {
      return {
        level: "bad",
        title: "Blizko stopu",
        text: `Cena je blizko SL a obchod ide proti tebe. Nezvacsovat poziciu bez noveho setupu.`,
      };
    }

    if (Number.isFinite(resultR) && resultR >= 1 && nearTarget) {
      return {
        level: "good",
        title: "Blizko targetu",
        text: `Obchod je v pluse ${resultR.toFixed(2)}R a cena je blizko TP. Plan je dolezite dodrzat.`,
      };
    }

    if (sideScore >= 65) {
      return {
        level: "good",
        title: "Obchod stale sedi",
        text: `${trade.side.toUpperCase()} filter ma ${sideScore}/100. Bias zatial podporuje povodny smer, sleduj price action pri urovniach.`,
      };
    }

    return {
      level: "warn",
      title: "Neutralny stav",
      text: `${trade.side.toUpperCase()} filter ma ${sideScore}/100. Nie je to jasna invalidacia, ale obchod uz nema silnu podporu filtra.`,
    };
  } catch {
    return { level: "warn", title: "Analyza zlyhala", text: "Market data pre tento obchod sa nepodarilo nacitat." };
  }
}

function managementAction({ trade, current, resultR, sideScore, oppositeScore }) {
  const direction = trade.side === "long" ? 1 : -1;
  const stopRisk = Math.abs(trade.entry - trade.stop);
  const movedAgainst = (current - trade.entry) * direction < 0;
  const stopDistance = Math.abs(current - trade.stop);
  const targetDistance = Math.abs(trade.target - current);
  const nearStop = stopRisk > 0 && stopDistance <= stopRisk * 0.35;
  const nearTarget = stopRisk > 0 && targetDistance <= stopRisk * 0.45;
  const filterFlipped = sideScore < 45 && oppositeScore >= sideScore + 20;
  const weakSide = sideScore < 55;

  if (Number.isFinite(resultR) && resultR <= -0.7 && (filterFlipped || nearStop)) {
    return {
      type: "cut",
      label: "CUT LOSS",
      text: "Obchod je hlboko v minuse a filter alebo cena sa zhorsili. Nepridavat, zvazit skorsi vystup podla planu.",
    };
  }

  if (filterFlipped) {
    return {
      type: "exit",
      label: "EXIT WARNING",
      text: `Povodny smer ma len ${sideScore}/100 a opacny smer ${oppositeScore}/100. Setup sa pravdepodobne zmenil.`,
    };
  }

  if (Number.isFinite(resultR) && resultR >= 2) {
    return {
      type: "trail",
      label: "TRAIL / LOCK",
      text: "Obchod je nad +2R. Rozumne je chranit zisk: trail, zamknut cast profitu alebo posunut SL pod/za strukturu.",
    };
  }

  if (Number.isFinite(resultR) && resultR >= 1.2 && (nearTarget || weakSide)) {
    return {
      type: "warning",
      label: "TAKE PARTIAL",
      text: "Obchod je v peknom profite a bud je blizko targetu, alebo filter slabne. Zmysel dava zobrat cast a nechat zvysok pracovat.",
    };
  }

  if (Number.isFinite(resultR) && resultR >= 0.8 && sideScore >= 60) {
    return {
      type: "hold",
      label: "MOVE SL TO BE",
      text: "Obchod je v zisku a filter stale podporuje smer. Zváž ochranu pozicie posunom SL na break-even alebo pod/za lokalnu strukturu.",
    };
  }

  if (movedAgainst && weakSide) {
    return {
      type: "warning",
      label: "WATCH CLOSELY",
      text: "Obchod je proti tebe a filter nema silnu podporu. Drzat iba ak stale plati povodna invalidacia.",
    };
  }

  return {
    type: "hold",
    label: "HOLD PLAN",
    text: "Zatial nie je silny dovod menit plan. Sleduj, ci cena respektuje stop, VWAP/urovne a povodny dovod vstupu.",
  };
}

function buildTradeScenarios(trade, snapshot, markers, oiContext) {
  if (!snapshot) {
    return [
      ["Data missing", "Scenare sa nedaju vytvorit bez market snapshotu."],
      ["Plan", "Drz sa povodneho SL/TP, kym sa data znovu nenacitaju."],
      ["Risk", "Nezvacsovat poziciu bez noveho potvrdenia."],
    ];
  }

  const sideScore = trade.side === "long" ? snapshot.longScore : snapshot.shortScore;
  const oppositeScore = trade.side === "long" ? snapshot.shortScore : snapshot.longScore;
  const room = trade.side === "long" ? snapshot.longRoomAtr : snapshot.shortRoomAtr;
  const vwapSupport = trade.side === "long" ? snapshot.price >= snapshot.vwapNow : snapshot.price <= snapshot.vwapNow;
  const continuation =
    sideScore >= 70 && snapshot.volumeRatio >= 1.1 && vwapSupport && (oiContext.label === "Trend support" || oiContext.label === "Short pressure");
  const pullback =
    sideScore >= 55 && snapshot.extensionAtr > 1.4 && snapshot.extensionAtr <= 2.4;
  const invalidation =
    oppositeScore >= sideScore + 20 || room < 0.8 || (trade.side === "long" ? snapshot.price < snapshot.vwapNow : snapshot.price > snapshot.vwapNow);
  const squeeze =
    oiContext.label === "Leverage build-up" || Math.abs(markers.funding) >= 0.05;

  return [
    [
      continuation ? "Continuation" : pullback ? "Pullback / retest" : "Base case",
      continuation
        ? "Smer obchodu ma podporu filtra, volume a OI. Ak cena drzi strukturu, plan moze pokracovat."
        : pullback
          ? "Cena je natiahnuta od VWAP. Lepsi dalsi krok je pullback/retest nez nahananie pohybu."
          : "Trh nema extremne jasny dalsi krok. Sleduj reakciu pri VWAP/supporte/rezistencii.",
    ],
    [
      invalidation ? "Invalidation risk" : "Plan valid",
      invalidation
        ? "Opačný smer alebo strata VWAP/roomu varuje, ze povodny scenar slabne."
        : "Povodny plan zatial nie je z raw dat jasne zneplatneny.",
    ],
    [
      squeeze ? "Squeeze / flush risk" : "Crowd risk normal",
      squeeze
        ? "OI/funding naznacuju viac paky alebo crowded smer. Dava zmysel chranit profit a nepridavat impulzivne."
        : "Funding/OI zatial neukazuju extremny crowded risk.",
    ],
  ];
}

async function renderOpenTrades() {
  const trades = getOpenTrades();
  if (!trades.length) {
    ui.openTrades.innerHTML = `<article class="feed-item"><strong>Ziadne otvorene obchody</strong><p>Pridaj obchod manualne a cockpit bude sledovat PnL podla verejnej futures ceny.</p></article>`;
    return;
  }

  const cards = await Promise.all(
    trades.map(async (trade, index) => {
      let current = NaN;
      try {
        current = await getPublicPrice(trade.symbol);
      } catch {
        current = NaN;
      }
      const direction = trade.side === "long" ? 1 : -1;
      const pnl = Number.isFinite(current) ? (current - trade.entry) * trade.qty * direction : NaN;
      const notional = trade.entry * trade.qty;
      const margin = trade.leverage > 0 ? notional / trade.leverage : NaN;
      const roi = margin > 0 && Number.isFinite(pnl) ? (pnl / margin) * 100 : NaN;
      const riskPerUnit = Math.abs(trade.entry - trade.stop);
      const risk = riskPerUnit * trade.qty;
      const resultR = risk > 0 && Number.isFinite(pnl) ? pnl / risk : NaN;
      const stopDistance = Number.isFinite(current) ? (Math.abs(current - trade.stop) / current) * 100 : NaN;
      const targetDistance = Number.isFinite(current) ? (Math.abs(trade.target - current) / current) * 100 : NaN;
      const markers = await getTradeMarkers(trade.symbol);
      const oiContext = await getOiContext(trade.symbol, ui.timeframe.value);
      let snapshot = null;
      try {
        snapshot = await analyzeSymbol(trade.symbol, ui.timeframe.value);
      } catch {
        snapshot = null;
      }
      const analysis = await analyzeOpenTrade(trade, current, pnl, resultR);
      let action = { type: "warning", label: "WAIT", text: "Management verdikt nie je dostupny bez aktualnych market dat." };
      try {
        if (!snapshot) throw new Error("missing snapshot");
        action = managementAction({
          trade,
          current,
          resultR,
          sideScore: trade.side === "long" ? snapshot.longScore : snapshot.shortScore,
          oppositeScore: trade.side === "long" ? snapshot.shortScore : snapshot.longScore,
        });
      } catch {
        action = { type: "warning", label: "WAIT", text: "Nepodarilo sa nacitat filter pre management obchodu." };
      }
      const scenarios = buildTradeScenarios(trade, snapshot, markers, oiContext);
      return `
        <article class="trade-card ${trade.side}">
          <div class="trade-main">
            <strong>${trade.symbol}</strong>
            <span>${trade.side.toUpperCase()} | entry ${fmt(trade.entry, 4)} | qty ${fmt(trade.qty, 4)}</span>
          </div>
          <div class="trade-stats">
            <div><span>Live</span><strong>${fmt(current, 4)}</strong></div>
            <div><span>PnL</span><strong>${Number.isFinite(pnl) ? `${fmt(pnl, 2)} USDT` : "-"}</strong></div>
            <div><span>Margin</span><strong>${Number.isFinite(margin) ? `${fmt(margin, 2)} USDT` : "-"}</strong></div>
            <div><span>ROI</span><strong>${pct(roi)}</strong></div>
            <div><span>R</span><strong>${Number.isFinite(resultR) ? `${resultR.toFixed(2)}R` : "-"}</strong></div>
            <div><span>SL / TP</span><strong>${pct(stopDistance)} / ${pct(targetDistance)}</strong></div>
          </div>
          <div class="trade-buttons">
            <button type="button" data-open-chart="${trade.symbol}">Graf</button>
            <button type="button" data-edit-trade="${index}">Upravit</button>
            <button type="button" data-close-trade="${index}">Zavriet</button>
          </div>
          <div class="trade-markers">
            <div><span>Open Interest</span><strong>${fmt(markers.openInterest, 0)}</strong></div>
            <div><span>OI kontext ${oiContext.period}</span><strong>${oiContext.label}</strong><span>${Number.isFinite(oiContext.oiChange) ? `OI ${oiContext.oiChange.toFixed(2)}% | cena ${oiContext.priceChange.toFixed(2)}%` : oiContext.text}</span></div>
            <div><span>24h Volume</span><strong>${Number.isFinite(markers.volume) ? `${fmt(markers.volume / 1000000, 2)}M USDT` : "-"}</strong></div>
            <div><span>Funding</span><strong>${pct(markers.funding)}</strong></div>
            <div><span>L/S ${markers.lsPeriod}</span><strong>${Number.isFinite(markers.longShortRatio) ? `${markers.longShortRatio.toFixed(2)} (${markers.longAccount.toFixed(0)}% / ${markers.shortAccount.toFixed(0)}%)` : "-"}</strong></div>
          </div>
          <div class="trade-context">
            <div><span>TF Support</span><strong>${snapshot ? fmt(snapshot.support, 4) : "-"}</strong></div>
            <div><span>TF Rezistencia</span><strong>${snapshot ? fmt(snapshot.resistance, 4) : "-"}</strong></div>
            <div><span>VWAP</span><strong>${snapshot ? fmt(snapshot.vwapNow, 4) : "-"}</strong></div>
            <div><span>EMA 20/50</span><strong>${snapshot ? `${fmt(snapshot.ema20, 4)} / ${fmt(snapshot.ema50, 4)}` : "-"}</strong></div>
            <div><span>RSI</span><strong>${snapshot ? snapshot.rsi14.toFixed(1) : "-"}</strong></div>
            <div><span>ATR</span><strong>${snapshot ? `${fmt(snapshot.atrNow, 4)} (${pct(snapshot.atrPct)})` : "-"}</strong></div>
          </div>
          <div class="trade-scenarios">
            ${scenarios.map(([title, text]) => `<article><strong>${title}</strong><p>${text}</p></article>`).join("")}
          </div>
          <div class="trade-action">
            <span class="action-badge ${action.type}">${action.label}</span>
            <p>${action.text}</p>
          </div>
          <div class="trade-analysis ${analysis.level}">
            <strong>${analysis.title}</strong>: ${analysis.text}
          </div>
        </article>
      `;
    }),
  );
  ui.openTrades.innerHTML = cards.join("");
}

function addOpenTrade() {
  const entry = Number(ui.tradeEntry.value);
  const rawSize = Number(ui.tradeQty.value);
  const qty = ui.tradeSizeMode.value === "notional" && Number.isFinite(entry) && entry > 0 ? rawSize / entry : rawSize;
  const trade = {
    symbol: ui.tradeSymbol.value.trim().toUpperCase(),
    side: ui.tradeSide.value,
    leverage: Number(ui.tradeLeverage.value),
    entry,
    qty,
    rawSize,
    sizeMode: ui.tradeSizeMode.value,
    stop: Number(ui.tradeStop.value),
    target: Number(ui.tradeTarget.value),
    note: ui.tradeNote.value.trim(),
    createdAt: new Date().toISOString(),
  };
  if (!trade.symbol || !Number.isFinite(trade.entry) || !Number.isFinite(trade.qty) || !Number.isFinite(trade.stop) || !Number.isFinite(trade.target)) {
    ui.openTrades.innerHTML = `<article class="feed-item"><strong>Chybaju udaje</strong><p>Vypln par, entry, velkost, stop a target.</p></article>`;
    return;
  }
  const trades = getOpenTrades();
  trades.unshift(trade);
  setOpenTrades(trades);
  ui.tradeNote.value = "";
  renderOpenTrades();
}

function addTrigger() {
  const trigger = {
    symbol: ui.triggerSymbol.value.trim().toUpperCase(),
    condition: ui.triggerCondition.value,
    triggerPrice: Number(ui.triggerPrice.value),
    side: ui.triggerSide.value,
    leverage: Number(ui.triggerLeverage.value),
    sizeMode: ui.triggerSizeMode.value,
    rawSize: Number(ui.triggerSize.value),
    stop: Number(ui.triggerStop.value),
    target: Number(ui.triggerTarget.value),
    note: ui.triggerNote.value.trim(),
    createdAt: new Date().toISOString(),
  };
  if (
    !trigger.symbol ||
    !Number.isFinite(trigger.triggerPrice) ||
    !Number.isFinite(trigger.rawSize) ||
    !Number.isFinite(trigger.stop) ||
    !Number.isFinite(trigger.target)
  ) {
    ui.triggerList.innerHTML = `<article class="feed-item"><strong>Chybaju udaje</strong><p>Vypln par, trigger cenu, velkost, stop a target.</p></article>`;
    return;
  }
  const triggers = getTradeTriggers();
  triggers.unshift(trigger);
  setTradeTriggers(triggers);
  ui.triggerNote.value = "";
  renderTriggers();
}

function renderTriggers() {
  const triggers = getTradeTriggers();
  ui.triggerList.innerHTML = triggers.length
    ? triggers
        .map(
          (trigger, index) => `
            <article class="trigger-row">
              <div>
                <strong>${trigger.symbol}</strong>
                <span>${trigger.side.toUpperCase()} | ${trigger.condition === "above" ? "cena >=" : "cena <="} ${fmt(trigger.triggerPrice, 4)}</span>
              </div>
              <div>
                <strong>${trigger.sizeMode === "notional" ? "Size" : "Qty"} ${fmt(trigger.rawSize, 4)} | ${trigger.leverage}x</strong>
                <span>SL ${fmt(trigger.stop, 4)} | TP ${fmt(trigger.target, 4)} | ${trigger.note || "bez poznamky"}</span>
              </div>
              <button type="button" data-delete-trigger="${index}">Zrusit</button>
            </article>
          `,
        )
        .join("")
    : `<article class="feed-item"><strong>Ziadne triggre</strong><p>Trigger vytvori obchod iba v cockpite, neposiela order na Binance.</p></article>`;
}

async function checkTradeTriggers() {
  const triggers = getTradeTriggers();
  if (!triggers.length) return;
  const remaining = [];
  let changed = false;
  for (const trigger of triggers) {
    let current = NaN;
    try {
      current = await getPublicPrice(trigger.symbol);
    } catch {
      remaining.push(trigger);
      continue;
    }
    const matched = trigger.condition === "above" ? current >= trigger.triggerPrice : current <= trigger.triggerPrice;
    if (!matched) {
      remaining.push(trigger);
      continue;
    }
    const entry = current;
    const qty = trigger.sizeMode === "notional" && entry > 0 ? trigger.rawSize / entry : trigger.rawSize;
    const openTrades = getOpenTrades();
    openTrades.unshift({
      symbol: trigger.symbol,
      side: trigger.side,
      leverage: trigger.leverage,
      entry,
      qty,
      rawSize: trigger.rawSize,
      sizeMode: trigger.sizeMode,
      stop: trigger.stop,
      target: trigger.target,
      note: `Triggered: ${trigger.note || ""}`.trim(),
      createdAt: new Date().toISOString(),
      triggeredFrom: trigger.triggerPrice,
    });
    setOpenTrades(openTrades);
    changed = true;
  }
  if (changed) {
    setTradeTriggers(remaining);
    renderTriggers();
    renderOpenTrades();
  }
}

async function closeOpenTrade(index, exitOverride = null) {
  const trades = getOpenTrades();
  const trade = trades[Number(index)];
  if (!trade) return;
  let exit = NaN;
  if (Number.isFinite(exitOverride)) {
    exit = exitOverride;
  } else {
    try {
      exit = await getPublicPrice(trade.symbol);
    } catch {
      exit = trade.entry;
    }
  }
  const direction = trade.side === "long" ? 1 : -1;
  const pnl = (exit - trade.entry) * trade.qty * direction;
  const risk = Math.abs(trade.entry - trade.stop) * trade.qty;
  const resultR = risk > 0 ? pnl / risk : NaN;
  const margin = trade.leverage > 0 ? (trade.entry * trade.qty) / trade.leverage : NaN;
  const roi = margin > 0 ? (pnl / margin) * 100 : NaN;
  const closed = {
    ...trade,
    exit,
    pnl,
    resultR,
    roi,
    closedAt: new Date().toISOString(),
  };
  const closedTrades = getClosedTrades();
  closedTrades.unshift(closed);
  setClosedTrades(closedTrades);
  trades.splice(Number(index), 1);
  setOpenTrades(trades);
  renderOpenTrades();
  renderClosedTrades();
}

function openTradeChart(pair) {
  ui.symbol.value = pair;
  ui.coinSelect.value = pair;
  prefillTradeForms(pair);
  setView("analysis");
  start();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function prefillTradeForms(pair) {
  ui.tradeSymbol.value = pair;
  ui.triggerSymbol.value = pair;
  try {
    const priceValue = await getPublicPrice(pair);
    ui.tradeEntry.value = priceValue.toFixed(4);
    ui.triggerPrice.value = priceValue.toFixed(4);
  } catch {
    ui.tradeEntry.value = "";
    ui.triggerPrice.value = "";
  }
}

function openEditDialog(index) {
  const trades = getOpenTrades();
  const trade = trades[Number(index)];
  if (!trade) return;
  pendingEditIndex = Number(index);
  ui.editTradeText.textContent = `${trade.symbol} ${trade.side.toUpperCase()} | entry ${fmt(trade.entry, 4)}`;
  ui.editTradeStop.value = trade.stop;
  ui.editTradeTarget.value = trade.target;
  ui.editTradeNote.value = trade.note || "";
  ui.editTradeDialog.showModal();
}

function saveTradeEdit() {
  if (pendingEditIndex === null) return;
  const trades = getOpenTrades();
  const trade = trades[pendingEditIndex];
  if (!trade) return;
  const stop = Number(ui.editTradeStop.value);
  const target = Number(ui.editTradeTarget.value);
  if (!Number.isFinite(stop) || !Number.isFinite(target) || stop <= 0 || target <= 0) return;
  trade.stop = stop;
  trade.target = target;
  trade.note = ui.editTradeNote.value.trim();
  trade.updatedAt = new Date().toISOString();
  setOpenTrades(trades);
  pendingEditIndex = null;
  renderOpenTrades();
}

async function openCloseDialog(index) {
  const trades = getOpenTrades();
  const trade = trades[Number(index)];
  if (!trade) return;
  pendingCloseIndex = Number(index);
  pendingCloseLivePrice = NaN;
  ui.closeTradeText.textContent = `${trade.symbol} ${trade.side.toUpperCase()} | zadaj exit cenu alebo pouzi aktualnu live cenu.`;
  ui.closeTradeExit.value = "";
  try {
    pendingCloseLivePrice = await getPublicPrice(trade.symbol);
    ui.closeTradeExit.value = pendingCloseLivePrice.toFixed(4);
  } catch {
    ui.closeTradeExit.value = "";
  }
  ui.closeTradeDialog.showModal();
}

function renderClosedTrades() {
  const trades = getClosedTrades();
  const results = trades.map((trade) => Number(trade.resultR)).filter(Number.isFinite);
  const wins = results.filter((value) => value > 0).length;
  const totalR = results.reduce((sum, value) => sum + value, 0);
  const totalPnl = trades.map((trade) => Number(trade.pnl)).filter(Number.isFinite).reduce((sum, value) => sum + value, 0);
  ui.closedCount.textContent = trades.length;
  ui.closedWinrate.textContent = results.length ? `${Math.round((wins / results.length) * 100)} %` : "-";
  ui.closedTotalR.textContent = results.length ? `${totalR.toFixed(2)}R` : "-";
  ui.closedAvgR.textContent = results.length ? `${(totalR / results.length).toFixed(2)}R` : "-";
  ui.closedPnl.textContent = trades.length ? `${fmt(totalPnl, 2)} USDT` : "-";
  ui.closedTrades.innerHTML = trades.length
    ? trades
        .map(
          (trade) => `
            <article class="closed-row">
              <div>
                <strong>${trade.symbol}</strong>
                <span>${trade.side.toUpperCase()} | ${new Date(trade.closedAt).toLocaleString("sk-SK")}</span>
              </div>
              <div>
                <strong>Entry ${fmt(trade.entry, 4)} → Exit ${fmt(trade.exit, 4)}</strong>
                <span>Paka ${trade.leverage || "-"}x | qty ${fmt(trade.qty, 4)} | ${trade.note || "bez poznamky"}</span>
              </div>
              <div>
                <strong>${Number.isFinite(trade.resultR) ? `${trade.resultR.toFixed(2)}R` : "-"}</strong>
                <span>${Number.isFinite(trade.pnl) ? `${fmt(trade.pnl, 2)} USDT` : "-"} | ROI ${pct(trade.roi)}</span>
              </div>
            </article>
          `,
        )
        .join("")
    : `<article class="feed-item"><strong>Ziadna historia</strong><p>Uzavrete obchody sa sem presunu po kliknuti na Zavriet.</p></article>`;
}

async function loadTopScannerSymbols() {
  try {
    const [exchangeInfo, tickers] = await Promise.all([
      getJson("https://fapi.binance.com/fapi/v1/exchangeInfo"),
      getJson("https://fapi.binance.com/fapi/v1/ticker/24hr"),
    ]);
    const tradable = new Set(
      exchangeInfo.symbols
        .filter((item) => item.contractType === "PERPETUAL" && item.quoteAsset === "USDT" && item.status === "TRADING")
        .map((item) => item.symbol),
    );
    topScannerSymbols = tickers
      .filter((item) => tradable.has(item.symbol))
      .sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume))
      .slice(0, 100)
      .map((item) => item.symbol);

    const current = ui.symbol.value;
    ui.coinSelect.innerHTML = topScannerSymbols
      .map((item) => `<option value="${item}">${item.replace("USDT", "")}</option>`)
      .join("");
    ui.coinSelect.value = topScannerSymbols.includes(current) ? current : "BTCUSDT";
    return topScannerSymbols;
  } catch {
    topScannerSymbols = fallbackScannerWatchlist;
    return topScannerSymbols;
  }
}

async function getScannerSymbols() {
  if (topScannerSymbols.length) return topScannerSymbols;
  return loadTopScannerSymbols();
}

function ema(values, period) {
  if (values.length < period) return NaN;
  const multiplier = 2 / (period + 1);
  let current = values.slice(0, period).reduce((sum, value) => sum + value, 0) / period;
  for (let index = period; index < values.length; index += 1) {
    current = values[index] * multiplier + current * (1 - multiplier);
  }
  return current;
}

function emaSeries(values, period) {
  const series = Array(values.length).fill(null);
  if (values.length < period) return series;
  const multiplier = 2 / (period + 1);
  let current = values.slice(0, period).reduce((sum, value) => sum + value, 0) / period;
  series[period - 1] = current;
  for (let index = period; index < values.length; index += 1) {
    current = values[index] * multiplier + current * (1 - multiplier);
    series[index] = current;
  }
  return series;
}

function rsi(values, period = 14) {
  let gains = 0;
  let losses = 0;
  for (let index = values.length - period; index < values.length; index += 1) {
    const change = values[index] - values[index - 1];
    if (change >= 0) gains += change;
    else losses -= change;
  }
  if (losses === 0) return 100;
  const rs = gains / period / (losses / period);
  return 100 - 100 / (1 + rs);
}

function atr(candles, period = 14) {
  const trs = [];
  for (let index = candles.length - period; index < candles.length; index += 1) {
    const candle = candles[index];
    const prevClose = candles[index - 1].close;
    trs.push(Math.max(candle.high - candle.low, Math.abs(candle.high - prevClose), Math.abs(candle.low - prevClose)));
  }
  return trs.reduce((sum, value) => sum + value, 0) / trs.length;
}

function vwap(candles, lookback = 48) {
  const slice = candles.slice(-lookback);
  const totals = slice.reduce(
    (acc, candle) => {
      const typical = (candle.high + candle.low + candle.close) / 3;
      acc.pv += typical * candle.volume;
      acc.volume += candle.volume;
      return acc;
    },
    { pv: 0, volume: 0 },
  );
  return totals.volume ? totals.pv / totals.volume : NaN;
}

function rollingVwap(candles, lookback = 48) {
  return candles.map((_, index) => vwap(candles.slice(0, index + 1), Math.min(lookback, index + 1)));
}

function macd(values) {
  const line = ema(values, 12) - ema(values, 26);
  const series = [];
  for (let index = 35; index <= values.length; index += 1) {
    const slice = values.slice(0, index);
    series.push(ema(slice, 12) - ema(slice, 26));
  }
  const signal = ema(series, 9);
  return { line, signal, hist: line - signal };
}

function drawChart(candles) {
  if (!candles.length) return;
  const canvas = ui.priceChart;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const pad = { left: 14, right: 78, top: 18, bottom: 32 };
  const visible = candles.slice(-140);
  const closes = visible.map((candle) => candle.close);
  const lines = {
    ema20: emaSeries(closes, 20),
    ema50: emaSeries(closes, 50),
    ema200: emaSeries(candles.map((candle) => candle.close), 200).slice(-140),
    vwap: rollingVwap(visible, 48),
  };
  const prices = visible
    .flatMap((candle, index) => [candle.high, candle.low, lines.ema20[index], lines.ema50[index], lines.ema200[index], lines.vwap[index]])
    .filter(Number.isFinite);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const xStep = plotW / visible.length;
  const y = (value) => pad.top + ((max - value) / range) * plotH;
  const x = (index) => pad.left + index * xStep + xStep / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0b0e10";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#242b31";
  ctx.fillStyle = "#aab3bc";
  ctx.font = "12px Arial";

  for (let index = 0; index <= 5; index += 1) {
    const yy = pad.top + (plotH / 5) * index;
    const level = max - (range / 5) * index;
    ctx.beginPath();
    ctx.moveTo(pad.left, yy);
    ctx.lineTo(width - pad.right, yy);
    ctx.stroke();
    ctx.fillText(fmt(level, 4), width - pad.right + 10, yy + 4);
  }

  visible.forEach((candle, index) => {
    const up = candle.close >= candle.open;
    const xx = x(index);
    const bodyTop = y(Math.max(candle.open, candle.close));
    const bodyBottom = y(Math.min(candle.open, candle.close));
    ctx.strokeStyle = up ? "rgba(32, 201, 151, 0.86)" : "rgba(255, 107, 107, 0.86)";
    ctx.fillStyle = up ? "rgba(32, 201, 151, 0.76)" : "rgba(255, 107, 107, 0.76)";
    ctx.beginPath();
    ctx.moveTo(xx, y(candle.high));
    ctx.lineTo(xx, y(candle.low));
    ctx.stroke();
    const bodyW = Math.max(3, xStep * 0.58);
    ctx.fillRect(xx - bodyW / 2, bodyTop, bodyW, Math.max(2, bodyBottom - bodyTop));
  });

  function drawLine(series, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    let started = false;
    series.forEach((value, index) => {
      if (!Number.isFinite(value)) return;
      if (!started) {
        ctx.moveTo(x(index), y(value));
        started = true;
      } else {
        ctx.lineTo(x(index), y(value));
      }
    });
    ctx.stroke();
  }

  drawLine(lines.ema20, "#5aa9ff");
  drawLine(lines.ema50, "#ffd166");
  drawLine(lines.ema200, "#c084fc");
  drawLine(lines.vwap, "#20c997");

  ui.chartEmpty.style.display = "none";
}

function importance(weight) {
  if (weight >= 20) return { label: "kriticke", className: "critical" };
  if (weight >= 14) return { label: "vysoke", className: "high" };
  return { label: "stredne", className: "medium" };
}

function renderWeightedRules(target, rules) {
  const maxWeight = Math.max(...rules.map((rule) => rule.weight));
  target.innerHTML = rules
    .map((rule) => {
      const level = importance(rule.weight);
      const width = Math.round((rule.weight / maxWeight) * 100);
      return `
        <li class="${rule.pass ? "pass" : ""}">
          <div class="rule-head">
            <span class="rule-state"></span>
            <span class="rule-text">${rule.text}</span>
            <span class="rule-weight ${level.className}">${level.label}</span>
          </div>
          <div class="rule-bar" style="--weight: ${width}%"><span></span></div>
        </li>
      `;
    })
    .join("");
}

function setRules(rules, target, scoreTarget) {
  const score = Math.round((rules.filter((rule) => rule.pass).reduce((sum, rule) => sum + rule.weight, 0) / rules.reduce((sum, rule) => sum + rule.weight, 0)) * 100);
  scoreTarget.textContent = `${score}/100`;
  renderWeightedRules(target, rules);
  return score;
}

function createDirectionalRules({ side, bull, bear, lastClose, vwapNow, rsi14, macdHist, atrPct, volumeRatio, funding, resistance, support, midRange, atrNow, lens = "standard" }) {
  const baseRules = side === "long"
    ? [
        { pass: bull, weight: 24, text: "EMA struktura podporuje long: cena > EMA20 > EMA50 > EMA200." },
        { pass: lastClose >= vwapNow, weight: 18, text: "Cena je nad VWAP, kupujuci maju intraday vyhodu." },
        { pass: rsi14 > 35 && rsi14 < 68, weight: 14, text: "RSI dava priestor pre long bez nahanania extremu." },
        { pass: macdHist >= 0, weight: 12, text: "MACD momentum nie je proti longu." },
        { pass: atrPct > 0.15, weight: 12, text: "ATR dava dost priestoru na R:R." },
        { pass: volumeRatio >= 0.8, weight: 10, text: "Volume nie je prilis slabe." },
        { pass: funding < 0.05, weight: 10, text: "Funding nie je prilis preplneny longami." },
        { pass: lastClose < resistance - atrNow * 0.35, weight: 10, text: "Cena nie je nalepena rovno pod rezistenciou." },
      ]
    : [
        { pass: bear, weight: 24, text: "EMA struktura podporuje short: cena < EMA20 < EMA50 < EMA200." },
        { pass: lastClose <= vwapNow, weight: 18, text: "Cena je pod VWAP, predavajuci maju intraday vyhodu." },
        { pass: rsi14 < 65 && rsi14 > 32, weight: 14, text: "RSI dava priestor pre short bez nahanania extremu." },
        { pass: macdHist <= 0, weight: 12, text: "MACD momentum nie je proti shortu." },
        { pass: atrPct > 0.15, weight: 12, text: "ATR dava dost priestoru na R:R." },
        { pass: volumeRatio >= 0.8, weight: 10, text: "Volume nie je prilis slabe." },
        { pass: funding > -0.05, weight: 10, text: "Funding nie je prilis preplneny shortami." },
        { pass: lastClose > support + atrNow * 0.35, weight: 10, text: "Cena nie je nalepena rovno nad supportom." },
      ];

  if (lens !== "eliz") return baseRules;

  const awayFromMiddle = Math.abs(lastClose - midRange) > atrNow * 0.55;
  const notLowLiquidity = volumeRatio >= 1;
  const notChasingLong = lastClose < resistance - atrNow * 0.8;
  const notChasingShort = lastClose > support + atrNow * 0.8;

  return [
    ...baseRules,
    { pass: notLowLiquidity, weight: 14, text: "Filozofia: low-liquidity chop nema dostatocnu kvalitu." },
    { pass: awayFromMiddle, weight: 14, text: "Filozofia: cena nie je v strede range, kde sa obchody najhorsie citaju." },
    {
      pass: side === "long" ? notChasingLong : notChasingShort,
      weight: 12,
      text: side === "long" ? "Filozofia: long nenahana cenu priamo do rezistencie." : "Filozofia: short nenahana cenu priamo do supportu.",
    },
    {
      pass: side === "long" ? bull || lastClose >= vwapNow : bear || lastClose <= vwapNow,
      weight: 12,
      text: "Filozofia: obchod potrebuje reclaim/flip alebo citatelnu strukturu, nie iba nahodny spike.",
    },
  ];
}

function scoreRules(rules) {
  return Math.round((rules.filter((rule) => rule.pass).reduce((sum, rule) => sum + rule.weight, 0) / rules.reduce((sum, rule) => sum + rule.weight, 0)) * 100);
}

function scoreDirection(data) {
  return scoreRules(createDirectionalRules(data));
}

function finalPotentialScore(baseScore, context) {
  let score = baseScore * 0.72;
  const room = context.side === "long" ? context.longRoomAtr : context.shortRoomAtr;

  if (context.edgeGap >= 45) score += 10;
  else if (context.edgeGap >= 35) score += 6;
  else if (context.edgeGap < 25) score -= 12;

  if (context.mtfAligned >= 3) score += 8;
  else if (context.mtfAligned === 2) score += 4;
  else score -= 8;

  if (Number.isFinite(room)) {
    if (room >= 2.2) score += 8;
    else if (room >= 1.5) score += 4;
    else if (room < 1) score -= 14;
  }

  if (context.volumeRatio >= 1.6) score += 7;
  else if (context.volumeRatio >= 1.2) score += 4;
  else if (context.volumeRatio < 0.9) score -= 8;

  if (Number.isFinite(context.extensionAtr)) {
    if (context.extensionAtr <= 1.4) score += 5;
    else if (context.extensionAtr > 2.2) score -= 12;
  }

  if (context.oiLabel === "Trend support" && context.side === "long") score += 5;
  if (context.oiLabel === "Short pressure" && context.side === "short") score += 5;
  if (context.oiLabel === "Leverage build-up") score -= 8;

  if (context.side === "long" && context.relativeStrength > 0.35) score += 5;
  if (context.side === "short" && context.relativeStrength < -0.35) score += 5;

  if (Number.isFinite(context.spreadPct)) {
    if (context.spreadPct <= 0.025) score += 3;
    else if (context.spreadPct > 0.1) score -= 8;
  }

  let cap = 94;
  if (context.edgeGap >= 45 && context.mtfAligned >= 3 && room >= 2.2 && context.volumeRatio >= 1.6 && context.extensionAtr <= 1.4) {
    cap = 100;
  } else if (context.edgeGap >= 35 && context.mtfAligned >= 2 && room >= 1.5 && context.volumeRatio >= 1.2) {
    cap = 96;
  } else if (context.edgeGap < 25 || context.mtfAligned < 2) {
    cap = 82;
  } else if (room < 1 || context.extensionAtr > 2.2) {
    cap = 86;
  }

  return clamp(Math.round(Math.min(score, cap)), 0, 100);
}

function rangePosition(priceValue, support, resistance) {
  const range = resistance - support;
  if (!Number.isFinite(range) || range <= 0) return { pct: NaN, label: "Unknown" };
  const pctValue = ((priceValue - support) / range) * 100;
  let label = "Mid range";
  if (pctValue <= 25) label = "Near support";
  else if (pctValue >= 75) label = "Near resistance";
  return { pct: pctValue, label };
}

async function percentMove(pair, interval) {
  const candles = await getJson(`https://fapi.binance.com/fapi/v1/klines?symbol=${pair}&interval=${interval}&limit=2`);
  const first = Number(candles[0]?.[4]);
  const last = Number(candles.at(-1)?.[4]);
  return ((last - first) / first) * 100;
}

function renderPhilosophy() {
  const profile = philosophyProfiles[ui.traderLens.value] || philosophyProfiles.standard;
  ui.philosophyName.textContent = profile.label;
  ui.philosophyCopy.textContent = profile.copy;
  ui.philosophyRules.innerHTML = profile.rules.map((rule) => `<li class="pass">${rule}</li>`).join("");
}

function normalizeTicker(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/^\$/, "")
    .replace(/[^A-Z0-9]/g, "");
}

function feedMentionFor(pair) {
  const base = pair.replace("USDT", "");
  return traderFeed.items.find((item) => {
    const tickers = item.tickers || [];
    return tickers.map(normalizeTicker).some((ticker) => ticker === base || `${ticker}USDT` === pair);
  });
}

async function loadTraderFeed() {
  try {
    const feed = await getJson(`trader-feed.json?ts=${Date.now()}`);
    traderFeed = {
      updatedAt: feed.updatedAt || null,
      source: feed.source || "@eliz883",
      items: Array.isArray(feed.items) ? feed.items : [],
    };
    ui.feedStatus.textContent = traderFeed.updatedAt
      ? `${traderFeed.source} feed aktualizovany: ${traderFeed.updatedAt}`
      : `${traderFeed.source} feed je pripraveny, zatial bez novych poloziek.`;
    ui.feedList.innerHTML = traderFeed.items.length
      ? traderFeed.items
          .map(
            (item) => `
              <article class="feed-item">
                <strong>${(item.tickers || []).join(", ") || "Bez tickera"} | ${item.tag || "watch"}</strong>
                <span>${item.time || ""}</span>
                <p>${item.summary || ""}</p>
              </article>
            `,
          )
          .join("")
      : `<article class="feed-item"><strong>Zatial prazdne</strong><p>Monitor sem bude ukladat zachytene tickery a kontext.</p></article>`;
  } catch {
    ui.feedStatus.textContent = "Trader feed sa nepodarilo nacitat. Pri file:// moze prehliadac blokovat lokalny JSON; cez lokalny server to pojde spolahlivejsie.";
    ui.feedList.innerHTML = "";
  }
}

async function analyzeSymbol(pair, interval) {
  const [klines, premium, oiContext, btcMove, bookTicker] = await Promise.all([
    getJson(`https://fapi.binance.com/fapi/v1/klines?symbol=${pair}&interval=${interval}&limit=240`),
    getJsonOr(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${pair}`, { lastFundingRate: "0" }),
    getOiContext(pair, interval).catch(() => ({ period: interval, oiChange: NaN, priceChange: NaN, label: "OI kontext nedostupny", text: "" })),
    pair === "BTCUSDT" ? Promise.resolve(0) : percentMove("BTCUSDT", interval).catch(() => 0),
    getJsonOr(`https://fapi.binance.com/fapi/v1/ticker/bookTicker?symbol=${pair}`, { bidPrice: "0", askPrice: "0" }),
  ]);
  const candles = klines.map((row) => ({
    open: Number(row[1]),
    high: Number(row[2]),
    low: Number(row[3]),
    close: Number(row[4]),
    volume: Number(row[5]),
  }));
  const closes = candles.map((candle) => candle.close);
  const last = candles.at(-1);
  const ema20 = ema(closes, 20);
  const ema50 = ema(closes, 50);
  const ema200 = ema(closes, 200);
  const rsi14 = rsi(closes);
  const macdNow = macd(closes);
  const atrNow = atr(candles);
  const atrPct = (atrNow / last.close) * 100;
  const vwapNow = vwap(candles);
  const avgVolume = candles.slice(-21, -1).reduce((sum, candle) => sum + candle.volume, 0) / 20;
  const volumeRatio = last.volume / avgVolume;
  const recent = candles.slice(-120);
  const resistance = Math.max(...recent.map((candle) => candle.high));
  const support = Math.min(...recent.map((candle) => candle.low));
  const midRange = (support + resistance) / 2;
  const funding = Number(premium.lastFundingRate) * 100;
  const bull = last.close > ema20 && ema20 > ema50 && ema50 > ema200;
  const bear = last.close < ema20 && ema20 < ema50 && ema50 < ema200;
  const lens = ui.traderLens.value;
  const baseLongScore = scoreDirection({ side: "long", bull, bear, lastClose: last.close, vwapNow, rsi14, macdHist: macdNow.hist, atrPct, volumeRatio, funding, resistance, support, midRange, atrNow, lens });
  const baseShortScore = scoreDirection({ side: "short", bull, bear, lastClose: last.close, vwapNow, rsi14, macdHist: macdNow.hist, atrPct, volumeRatio, funding, resistance, support, midRange, atrNow, lens });
  const move = ((last.close - candles.at(-2).close) / candles.at(-2).close) * 100;
  const relativeStrength = pair === "BTCUSDT" ? 0 : move - btcMove;
  const range = rangePosition(last.close, support, resistance);
  const bid = Number(bookTicker.bidPrice);
  const ask = Number(bookTicker.askPrice);
  const spreadPct = bid > 0 && ask > 0 ? ((ask - bid) / ((ask + bid) / 2)) * 100 : NaN;
  const longRoomAtr = atrNow > 0 ? (resistance - last.close) / atrNow : NaN;
  const shortRoomAtr = atrNow > 0 ? (last.close - support) / atrNow : NaN;
  const extensionAtr = atrNow > 0 ? Math.abs(last.close - vwapNow) / atrNow : NaN;
  let longScore = baseLongScore;
  let shortScore = baseShortScore;

  if (oiContext.label === "Trend support" && move > 0) longScore += 6;
  if (oiContext.label === "Short pressure" && move < 0) shortScore += 6;
  if (oiContext.label === "Leverage build-up") {
    longScore -= 5;
    shortScore -= 5;
  }
  if (relativeStrength > 0.25) longScore += 5;
  if (relativeStrength < -0.25) shortScore += 5;
  if (range.label === "Near support") longScore += 4;
  if (range.label === "Near resistance") shortScore += 4;
  if (Number.isFinite(longRoomAtr)) {
    if (longRoomAtr >= 1.5) longScore += 6;
    else if (longRoomAtr < 0.8) longScore -= 14;
  }
  if (Number.isFinite(shortRoomAtr)) {
    if (shortRoomAtr >= 1.5) shortScore += 6;
    else if (shortRoomAtr < 0.8) shortScore -= 14;
  }
  if (Number.isFinite(extensionAtr) && extensionAtr > 2.2) {
    longScore -= 8;
    shortScore -= 8;
  }
  if (volumeRatio >= 1.2) {
    longScore += 4;
    shortScore += 4;
  }
  if (Number.isFinite(spreadPct)) {
    if (spreadPct <= 0.04) {
      longScore += 3;
      shortScore += 3;
    } else if (spreadPct > 0.12) {
      longScore -= 10;
      shortScore -= 10;
    }
  }
  if (range.label === "Mid range" && lens === "eliz") {
    longScore -= 6;
    shortScore -= 6;
  }
  if (!(volumeRatio >= 1.2 && extensionAtr <= 2.2)) {
    longScore = Math.min(longScore, 96);
    shortScore = Math.min(shortScore, 96);
  }
  longScore = clamp(Math.round(longScore), 0, 100);
  shortScore = clamp(Math.round(shortScore), 0, 100);
  const preGap = Math.abs(longScore - shortScore);
  const conflictPenalty = preGap < 12 ? 30 : preGap < 20 ? 22 : preGap < 30 ? 12 : 0;
  longScore = clamp(longScore - conflictPenalty, 0, 100);
  shortScore = clamp(shortScore - conflictPenalty, 0, 100);
  const edgeGap = Math.abs(longScore - shortScore);
  return {
    pair,
    price: last.close,
    bias: bull ? "Bullish" : bear ? "Bearish" : "Neutral",
    longScore,
    shortScore,
    edgeGap,
    bestSide: longScore >= shortScore ? "long" : "short",
    bestScore: Math.max(longScore, shortScore),
    volumeRatio,
    atrPct,
    oiContext,
    relativeStrength,
    range,
    longRoomAtr,
    shortRoomAtr,
    extensionAtr,
    spreadPct,
    support,
    resistance,
    midRange,
    vwapNow,
    ema20,
    ema50,
    ema200,
    rsi14,
    atrNow,
  };
}

async function mtfAlignmentScore(pair, side) {
  try {
    const items = await Promise.all(["15m", "1h", "4h"].map((interval) => analyzeTimeframeBias(pair, interval)));
    const expected = side === "long" ? "Bullish" : "Bearish";
    const aligned = items.filter((item) => item.bias === expected).length;
    const opposed = items.filter((item) => item.bias === (side === "long" ? "Bearish" : "Bullish")).length;
    return { aligned, opposed, text: `${aligned}/3 TF aligned` };
  } catch {
    return { aligned: 0, opposed: 0, text: "MTF unavailable" };
  }
}

async function analyzeTimeframeBias(pair, interval) {
  const data = await analyzeSymbol(pair, interval);
  const bias = data.bias;
  const aboveVwap = data.price >= data.vwapNow;
  const text = `${aboveVwap ? "nad" : "pod"} VWAP | RSI ${data.rsi14.toFixed(1)} | L ${data.longScore}/S ${data.shortScore}`;
  return { interval, bias, text, longScore: data.longScore, shortScore: data.shortScore };
}

function mtfDecision(items) {
  const style = activeTradeStyle();
  const byTf = Object.fromEntries(items.map((item) => [item.interval, item]));
  const tf15 = byTf["15m"];
  const tf1h = byTf["1h"];
  const tf4h = byTf["4h"];

  if (style === "scalp") {
    if (tf15.bias === "Bullish" && tf1h.bias !== "Bearish") return "Scalp: long ma zeleny kontext, hladat vstup na 5m/1m po pullbacku.";
    if (tf15.bias === "Bearish" && tf1h.bias !== "Bullish") return "Scalp: short ma zeleny kontext, hladat odmietnutie po pullbacku.";
    return "Scalp: timeframe su zmiesane. Ber len rychly setup pri jasnej urovni, inak cakat.";
  }

  if (style === "swing") {
    if (tf4h.bias === "Bullish" && tf1h.bias !== "Bearish") return "Swing: hladat long, idealne po 1h pullbacku. Proti 4h biasu neponahlat.";
    if (tf4h.bias === "Bearish" && tf1h.bias !== "Bullish") return "Swing: hladat short, idealne po 1h pullbacku/reteste.";
    return "Swing: 4h nedava cisty smer. Lepsie cakat na reclaim/flip alebo obchodovat mensie.";
  }

  if (tf1h.bias === "Bullish" && tf15.bias === "Bullish") return "Intraday: long je preferovany. 15m aj 1h su zladene, vstup hladat na pullbacku.";
  if (tf1h.bias === "Bearish" && tf15.bias === "Bearish") return "Intraday: short je preferovany. 15m aj 1h su zladene, vstup hladat po reteste.";
  if (tf1h.bias === "Bearish" && tf15.bias === "Bullish") return "Intraday: 15m long je pravdepodobne len bounce proti 1h. Nenahanat long, skor hladat short vyssie.";
  if (tf1h.bias === "Bullish" && tf15.bias === "Bearish") return "Intraday: 15m short je pullback v 1h long kontexte. Hladat long az po stabilizacii.";
  return "Intraday: bias je zmiesany. Najlepsia volba je cakat na hranu range alebo jasny flip.";
}

async function refreshMtfBias() {
  const pair = symbol();
  if (!pair) return;
  ui.mtfSummary.textContent = "Nacitavam 15m / 1h / 4h bias...";
  try {
    const items = await Promise.all(["15m", "1h", "4h"].map((interval) => analyzeTimeframeBias(pair, interval)));
    const map = Object.fromEntries(items.map((item) => [item.interval, item]));
    ui.mtf15m.textContent = map["15m"].bias;
    ui.mtf15mText.textContent = map["15m"].text;
    ui.mtf1h.textContent = map["1h"].bias;
    ui.mtf1hText.textContent = map["1h"].text;
    ui.mtf4h.textContent = map["4h"].bias;
    ui.mtf4hText.textContent = map["4h"].text;
    ui.mtfSummary.textContent = mtfDecision(items);
  } catch {
    ui.mtfSummary.textContent = "MTF bias sa nepodarilo nacitat.";
  }
}

async function scanOpportunities() {
  const threshold = Number(ui.scannerThreshold.value);
  const scannerStyle = ui.scannerStyle.value;
  const scannerIntervalByStyle = {
    scalp: "15m",
    intraday: "1h",
    swing: "4h",
  };
  const interval = scannerIntervalByStyle[scannerStyle] || ui.timeframe.value;
  const scannerSymbols = await getScannerSymbols();
  ui.scannerStatus.textContent = `Skenujem top ${scannerSymbols.length} USDT perpetual futures parov na ${interval} pre ${scannerStyle}...`;
  ui.scannerList.innerHTML = "";
  const results = [];
  const chunkSize = 8;
  window.__scannerStyleOverride = scannerStyle;

  try {
    for (let index = 0; index < scannerSymbols.length; index += chunkSize) {
      const chunk = scannerSymbols.slice(index, index + chunkSize);
      ui.scannerStatus.textContent = `Skenujem ${index + 1}-${Math.min(index + chunk.length, scannerSymbols.length)} z ${scannerSymbols.length}...`;
      const chunkResults = await Promise.all(
        chunk.map(async (pair) => {
          try {
            return await analyzeSymbol(pair, interval);
          } catch {
            return { pair, error: true, bestScore: 0 };
          }
        }),
      );
      results.push(...chunkResults);
    }
  } finally {
    window.__scannerStyleOverride = null;
  }

  const minGapByStyle = {
    scalp: 18,
    intraday: 25,
    swing: 30,
  };
  const minGap = minGapByStyle[scannerStyle] || 25;
  const candidates = results.filter((item) => !item.error).sort((a, b) => b.bestScore - a.bestScore).slice(0, 16);

  for (const item of candidates) {
    const mtf = await mtfAlignmentScore(item.pair, item.bestSide);
    item.mtf = mtf;
    item.rawScore = item.bestScore;
    item.bestScore = finalPotentialScore(item.bestScore, {
      side: item.bestSide,
      edgeGap: item.edgeGap,
      mtfAligned: mtf.aligned,
      longRoomAtr: item.longRoomAtr,
      shortRoomAtr: item.shortRoomAtr,
      volumeRatio: item.volumeRatio,
      extensionAtr: item.extensionAtr,
      oiLabel: item.oiContext?.label,
      relativeStrength: item.relativeStrength,
      spreadPct: item.spreadPct,
    });
  }
  const filtered = candidates
    .filter((item) => item.bestScore >= threshold && item.edgeGap >= minGap)
    .sort((a, b) => b.bestScore - a.bestScore);
  const shown = filtered.length ? filtered : candidates.sort((a, b) => b.bestScore - a.bestScore).slice(0, 6);

  ui.scannerStatus.textContent = filtered.length
    ? `Najdene presvedcive ${scannerStyle} prilezitosti nad ${threshold}/100 s edge gapom aspon ${minGap}.`
    : `Nad ${threshold}/100 s jasnym ${scannerStyle} smerom nic ciste. Ukazujem najlepsich kandidatov z top ${scannerSymbols.length}.`;
  ui.scannerList.innerHTML = shown
    .map(
      (item) => {
        const mention = feedMentionFor(item.pair);
        return `
          <article class="scanner-item ${item.bestSide} ${mention ? "mentioned" : ""}" data-symbol="${item.pair}">
            <div class="scanner-symbol">${item.pair.replace("USDT", "")}</div>
            <div class="scanner-meta">
              <strong>${item.bestSide.toUpperCase()} kandidat | ${item.bias}</strong>
              <span>Potential ${item.bestScore}/100 | raw ${item.rawScore ?? item.bestScore}/100 | Long ${item.longScore}/100 | Short ${item.shortScore}/100 | edge gap ${item.edgeGap}/100</span>
              <span>Cena ${fmt(item.price, 4)}</span>
              <span>ATR ${pct(item.atrPct)} | volume ${item.volumeRatio.toFixed(2)}x | ${item.mtf?.text || "MTF -"}</span>
              <span>OI ${item.oiContext?.label || "-"} | RS vs BTC ${Number.isFinite(item.relativeStrength) ? item.relativeStrength.toFixed(2) : "-"}% | ${item.range?.label || "-"}</span>
              <span>Room ${Number.isFinite(item.bestSide === "long" ? item.longRoomAtr : item.shortRoomAtr) ? (item.bestSide === "long" ? item.longRoomAtr : item.shortRoomAtr).toFixed(2) : "-"} ATR | VWAP ext ${Number.isFinite(item.extensionAtr) ? item.extensionAtr.toFixed(2) : "-"} ATR | spread ${Number.isFinite(item.spreadPct) ? item.spreadPct.toFixed(3) : "-"}%</span>
              ${mention ? `<em class="mention-tag">${mention.tag || "mentioned"} by ${traderFeed.source}</em>` : ""}
              <div class="scanner-bar" style="--score: ${item.bestScore}%"><i></i></div>
            </div>
            <div class="scanner-score">${item.bestScore}/100</div>
          </article>
        `;
      },
    )
    .join("");
}

function updateScenarios({ bias, support, resistance, vwapNow, atrNow, lastClose }) {
  ui.scenarioMode.textContent = bias === "bull" ? "Prefer long" : bias === "bear" ? "Prefer short" : "Range / cakat";
  ui.longScenario.textContent = `Cena drzi nad VWAP ${fmt(vwapNow, 4)}, pullback respektuje support ${fmt(support, 4)} a RSI nie je prepalene. Stop az za strukturu.`;
  ui.shortScenario.textContent = `Cena odmietne rezistenciu ${fmt(resistance, 4)} alebo strati VWAP ${fmt(vwapNow, 4)} s objemom. Stop nad posledne high.`;
  ui.waitScenario.textContent = `Cena je uprostred range, ATR je nizke, funding je extremny alebo bias nesedi s tvojim smerom. Bez jasnej invalidacie sa necaka obchod, ale lepsia cena.`;
  ui.biasText.textContent = `Posledna cena ${fmt(lastClose, 4)}, orientacny ATR ${fmt(atrNow, 4)}. Toto je filter, nie prikaz obchodovat.`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function qualityLabel(score) {
  if (score >= 75) return "Silny setup";
  if (score >= 55) return "Mozny setup";
  if (score >= 35) return "Slaby setup";
  return "Cakat";
}

function buildEntryPlans({ bias, support, resistance, midRange, vwapNow, atrNow, last, longScore, shortScore }) {
  const style = styles[activeTradeStyle()] || styles.intraday;
  ui.entryStyleLabel.textContent = `${style.label} | ideal ${style.preferredTf}`;

  const close = last.close;
  const longEntryA = Math.max(support, Math.min(vwapNow, close - atrNow * style.entryAtr));
  const longEntryB = Math.max(support, midRange - atrNow * style.entryAtr);
  const longStop = Math.min(support - atrNow * style.stopAtr, longEntryA - atrNow * 0.45);
  const longRisk = Math.max(longEntryA - longStop, atrNow * 0.2);
  const longT1 = longEntryA + longRisk * style.targetR[0];
  const longT2 = Math.min(resistance, longEntryA + longRisk * style.targetR[1]);

  const shortEntryA = Math.min(resistance, Math.max(vwapNow, close + atrNow * style.entryAtr));
  const shortEntryB = Math.min(resistance, midRange + atrNow * style.entryAtr);
  const shortStop = Math.max(resistance + atrNow * style.stopAtr, shortEntryA + atrNow * 0.45);
  const shortRisk = Math.max(shortStop - shortEntryA, atrNow * 0.2);
  const shortT1 = shortEntryA - shortRisk * style.targetR[0];
  const shortT2 = Math.max(support, shortEntryA - shortRisk * style.targetR[1]);

  ui.longQuality.textContent = `${qualityLabel(longScore)} (${longScore}/100)`;
  ui.longEntryA.textContent = fmt(longEntryA, 4);
  ui.longEntryB.textContent = fmt(longEntryB, 4);
  ui.longStop.textContent = fmt(longStop, 4);
  ui.longTargets.textContent = `${fmt(longT1, 4)} / ${fmt(longT2, 4)}`;
  ui.longReason.textContent = `${style.note} Long dava zmysel hlavne ak cena podrzi VWAP/support a nevstupujes po prepalenej sviecke.`;

  ui.shortQuality.textContent = `${qualityLabel(shortScore)} (${shortScore}/100)`;
  ui.shortEntryA.textContent = fmt(shortEntryA, 4);
  ui.shortEntryB.textContent = fmt(shortEntryB, 4);
  ui.shortStop.textContent = fmt(shortStop, 4);
  ui.shortTargets.textContent = `${fmt(shortT1, 4)} / ${fmt(shortT2, 4)}`;
  ui.shortReason.textContent = `${style.note} Short dava zmysel hlavne ak cena odmietne rezistenciu/VWAP a momentum nepotvrdzuje long.`;
}

function generateAiComment() {
  if (!latestSnapshot) {
    ui.aiComment.textContent = "Najprv nacitaj market data. Bez snapshotu by bol komentar len hadanie.";
    return;
  }

  const s = latestSnapshot;
  const preferred = s.longScore > s.shortScore ? "long" : s.shortScore > s.longScore ? "short" : "ziadny jasny smer";
  const gap = Math.abs(s.longScore - s.shortScore);
  const warnings = [];

  if (s.rsi14 > 70) warnings.push("RSI je prekupene, nahanat long po pohybe je rizikove");
  if (s.rsi14 < 30) warnings.push("RSI je prepredane, nahanat short po vypredaji je rizikove");
  if (Math.abs(s.funding) >= 0.05) warnings.push("funding je vyraznejsi, smer moze byt preplneny");
  if (s.volumeRatio < 0.8) warnings.push("volume je podpriemerne, signal ma mensiu vahu");
  if (s.atrPct < 0.15) warnings.push("ATR je nizke, moze byt problem postavit dobre R:R");
  if (gap < 12) warnings.push("long a short skore su blizko pri sebe, trh nie je jednoznacny");

  const verdict =
    Math.max(s.longScore, s.shortScore) >= 75 && gap >= 12
      ? `Filter dava pouzitelnu vyhodu pre ${preferred}.`
      : Math.max(s.longScore, s.shortScore) >= 60
        ? "Filter vidi obchodovatelny, ale nie dokonale cisty trh."
        : "Filter skor hovori cakat, nie hladat obchod za kazdu cenu.";

  const action =
    preferred === "long"
      ? `Long by som bral iba po reakcii na pullback k VWAP/supportu. Nenahanat cenu pri rezistencii ${fmt(s.resistance, 4)}.`
      : preferred === "short"
        ? `Short by som bral iba po odmietnuti VWAP/rezistencie. Nenahanat cenu priamo nad supportom ${fmt(s.support, 4)}.`
        : "Bez jasnej prevahy smeru je lepsie cakat na reakciu na supporte alebo rezistencii.";

  ui.aiComment.innerHTML = `
    <p><strong>${s.pair} ${s.interval}</strong>: ${verdict}</p>
    <p>Long filter ma <strong>${s.longScore}/100</strong>, short filter ma <strong>${s.shortScore}/100</strong>. Market bias je <strong>${s.bias}</strong>, cena je ${s.close >= s.vwapNow ? "nad" : "pod"} VWAP.</p>
    ${s.lens === "eliz" ? "<p>Patience/range rezim je prisnejsi: viac penalizuje low liquidity, stred range a nahananie ceny po spiku.</p>" : ""}
    <p>${action}</p>
    <p><strong>Rizika:</strong> ${warnings.length ? warnings.join("; ") : "ziadne velke varovanie z filtra, stale vsak treba potvrdenie ceny a vlastny stop-loss."}</p>
  `;

  ui.aiPrompt.value = [
    "Analyzuj tento Binance Futures setup ako trading coach. Nezadavaj obchod, len vysvetli kvalitu long/short scenara.",
    `Pair: ${s.pair}`,
    `Timeframe: ${s.interval}`,
    `Bias: ${s.bias}`,
    `Long score: ${s.longScore}/100`,
    `Short score: ${s.shortScore}/100`,
    `Filter philosophy: ${s.lens}`,
    `Price: ${fmt(s.close, 4)}`,
    `VWAP: ${fmt(s.vwapNow, 4)}`,
    `RSI14: ${s.rsi14.toFixed(1)}`,
    `MACD histogram: ${s.macdHist.toFixed(4)}`,
    `ATR%: ${s.atrPct.toFixed(3)}`,
    `Volume ratio: ${s.volumeRatio.toFixed(2)}x`,
    `Funding: ${s.funding.toFixed(3)}%`,
    `Support: ${fmt(s.support, 4)}`,
    `Resistance: ${fmt(s.resistance, 4)}`,
  ].join("\n");
}

async function refreshMarket() {
  const pair = symbol();
  const interval = ui.timeframe.value;
  if (!pair) return;
  renderPhilosophy();
  ui.headerLivePrice.textContent = "-";
  ui.updatedAt.textContent = "nacitavam...";
  refreshMtfBias();
  try {
    const [klines, premium, oi] = await Promise.all([
      getJson(`https://fapi.binance.com/fapi/v1/klines?symbol=${pair}&interval=${interval}&limit=240`),
      getJson(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${pair}`),
      getJson(`https://fapi.binance.com/fapi/v1/openInterest?symbol=${pair}`),
    ]);
    const candles = klines.map((row) => ({
      open: Number(row[1]),
      high: Number(row[2]),
      low: Number(row[3]),
      close: Number(row[4]),
      volume: Number(row[5]),
    }));
    candlesCache = candles;
    drawChart(candles);

    const closes = candles.map((candle) => candle.close);
    const last = candles.at(-1);
    const ema20 = ema(closes, 20);
    const ema50 = ema(closes, 50);
    const ema200 = ema(closes, 200);
    const rsi14 = rsi(closes);
    const macdNow = macd(closes);
    const atrNow = atr(candles);
    const atrPct = (atrNow / last.close) * 100;
    const vwapNow = vwap(candles);
    const avgVolume = candles.slice(-21, -1).reduce((sum, candle) => sum + candle.volume, 0) / 20;
    const volumeRatio = last.volume / avgVolume;
    const recent = candles.slice(-120);
    const resistance = Math.max(...recent.map((candle) => candle.high));
    const support = Math.min(...recent.map((candle) => candle.low));
    const midRange = (support + resistance) / 2;
    const funding = Number(premium.lastFundingRate) * 100;
    const oiValue = Number(oi.openInterest);

    const bull = last.close > ema20 && ema20 > ema50 && ema50 > ema200;
    const bear = last.close < ema20 && ema20 < ema50 && ema50 < ema200;
    const bias = bull ? "bull" : bear ? "bear" : "neutral";

    ui.verdictCard.classList.remove("bull", "bear", "neutral");
    ui.verdictCard.classList.add(bias);
    ui.biasLabel.textContent = bull ? "Bullish bias" : bear ? "Bearish bias" : "Neutral / range";
    ui.emaStack.textContent = bull ? "Bull stack" : bear ? "Bear stack" : "Mixed";
    ui.rsi.textContent = `${rsi14.toFixed(1)} ${rsi14 > 70 ? "prekupene" : rsi14 < 30 ? "prepredane" : "neutral"}`;
    ui.macd.textContent = `${macdNow.hist >= 0 ? "Bull" : "Bear"} hist ${macdNow.hist.toFixed(4)}`;
    ui.atr.textContent = pct(atrPct);
    ui.vwapPosition.textContent = `${last.close >= vwapNow ? "Nad" : "Pod"} VWAP ${fmt(vwapNow, 4)}`;
    ui.volume.textContent = `${volumeRatio.toFixed(2)}x priemer`;
    ui.funding.textContent = pct(funding);
    ui.fundingText.textContent = Math.abs(funding) > 0.05 ? "Funding je vyraznejsi, pozor na preplneny smer." : "Funding nie je extremny.";
    ui.openInterest.textContent = fmt(oiValue, 0);
    ui.oiText.textContent = "Aktualny futures open interest.";
    ui.resistance.textContent = fmt(resistance, 4);
    ui.support.textContent = fmt(support, 4);
    ui.midRange.textContent = fmt(midRange, 4);

    const sharedRuleData = {
      bull,
      bear,
      lastClose: last.close,
      vwapNow,
      rsi14,
      macdHist: macdNow.hist,
      atrPct,
      volumeRatio,
      funding,
      resistance,
      support,
      midRange,
      atrNow,
      lens: ui.traderLens.value,
    };
    const longRules = createDirectionalRules({ ...sharedRuleData, side: "long" });
    const shortRules = createDirectionalRules({ ...sharedRuleData, side: "short" });
    const longScore = setRules(longRules, ui.longRules, ui.longFilterScore);
    const shortScore = setRules(shortRules, ui.shortRules, ui.shortFilterScore);
    const score = Math.max(longScore, shortScore);
    ui.biasText.textContent = score >= 75 ? "Trh ma citatelnu strukturu. Hladaj iba setup v smere biasu." : score >= 55 ? "Trh je obchodovatelny, ale len s presnou invalidaciou." : "Trh je necisty. Lepsia volba je cakat.";
    updateScenarios({ bias, support, resistance, vwapNow, atrNow, lastClose: last.close });
    buildEntryPlans({ bias, support, resistance, midRange, vwapNow, atrNow, last, longScore, shortScore });
    latestSnapshot = {
      pair,
      interval,
      bias: bull ? "Bullish" : bear ? "Bearish" : "Neutral",
      close: last.close,
      vwapNow,
      rsi14,
      macdHist: macdNow.hist,
      atrPct,
      volumeRatio,
      funding,
      support,
      resistance,
      longScore,
      shortScore,
      lens: ui.traderLens.value,
    };
    generateAiComment();
    ui.updatedAt.textContent = new Date().toLocaleTimeString("sk-SK");
  } catch (error) {
    ui.updatedAt.textContent = `chyba: ${error.message}`;
    ui.chartEmpty.style.display = "grid";
  }
}

function startPriceStream() {
  if (socket) socket.close();
  if (pricePollTimer) clearInterval(pricePollTimer);
  const pair = symbol().toLowerCase();
  ui.priceState.textContent = "Pripajam stream...";

  const pollPrice = async () => {
    try {
      const price = await getPublicPrice(symbol());
      const formatted = fmt(price, 4);
      ui.livePrice.textContent = formatted;
      ui.headerLivePrice.textContent = formatted;
      ui.priceState.textContent = "Live cena cez polling";
    } catch {
      ui.livePrice.textContent = "-";
      ui.headerLivePrice.textContent = "-";
      ui.priceState.textContent = "Live cenu blokuje siet alebo Binance endpoint.";
    }
  };

  pollPrice();
  pricePollTimer = setInterval(pollPrice, 5000);

  socket = new WebSocket(`wss://fstream.binance.com/ws/${pair}@markPrice@1s`);
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const price = Number(data.p);
    const formatted = fmt(price, 4);
    ui.livePrice.textContent = formatted;
    ui.headerLivePrice.textContent = formatted;
    ui.priceState.textContent = "Live futures mark price";
  };
  socket.onerror = () => {
    ui.priceState.textContent = "Stream ma chybu, pouzivam polling.";
  };
  socket.onclose = () => {
    ui.priceState.textContent = "Stream odpojeny, polling stale bezi.";
  };
}

function start() {
  if (marketTimer) clearInterval(marketTimer);
  startPriceStream();
  refreshMarket();
  marketTimer = setInterval(refreshMarket, 30000);
}

ui.refreshButton.addEventListener("click", start);
ui.refreshMtfButton.addEventListener("click", refreshMtfBias);
document.querySelectorAll(".nav-button").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});
ui.scanButton.addEventListener("click", scanOpportunities);
ui.reloadFeedButton.addEventListener("click", loadTraderFeed);
ui.aiCommentButton.addEventListener("click", generateAiComment);
ui.addTradeButton.addEventListener("click", addOpenTrade);
ui.addTriggerButton.addEventListener("click", addTrigger);
ui.triggerList.addEventListener("click", (event) => {
  const index = event.target.dataset.deleteTrigger;
  if (index === undefined) return;
  const triggers = getTradeTriggers();
  triggers.splice(Number(index), 1);
  setTradeTriggers(triggers);
  renderTriggers();
});
ui.openTrades.addEventListener("click", (event) => {
  const chartSymbol = event.target.dataset.openChart;
  if (chartSymbol) {
    openTradeChart(chartSymbol);
    return;
  }
  const editIndex = event.target.dataset.editTrade;
  if (editIndex !== undefined) {
    openEditDialog(editIndex);
    return;
  }
  const index = event.target.dataset.closeTrade;
  if (index === undefined) return;
  openCloseDialog(index);
});
ui.closeUseLiveButton.addEventListener("click", async () => {
  const trades = getOpenTrades();
  const trade = trades[pendingCloseIndex];
  if (!trade) return;
  try {
    pendingCloseLivePrice = await getPublicPrice(trade.symbol);
    ui.closeTradeExit.value = pendingCloseLivePrice.toFixed(4);
  } catch {
    ui.closeTradeText.textContent = "Live cenu sa nepodarilo nacitat, zadaj exit cenu rucne.";
  }
});
ui.closeConfirmButton.addEventListener("click", () => {
  const exit = Number(ui.closeTradeExit.value);
  if (!Number.isFinite(exit) || exit <= 0 || pendingCloseIndex === null) return;
  closeOpenTrade(pendingCloseIndex, exit);
  pendingCloseIndex = null;
});
ui.editConfirmButton.addEventListener("click", saveTradeEdit);
ui.clearClosedTradesButton.addEventListener("click", () => {
  setClosedTrades([]);
  renderClosedTrades();
});
ui.scannerList.addEventListener("click", (event) => {
  const item = event.target.closest(".scanner-item");
  if (!item) return;
  ui.symbol.value = item.dataset.symbol;
  ui.coinSelect.value = item.dataset.symbol;
  prefillTradeForms(item.dataset.symbol);
  start();
});
ui.timeframe.addEventListener("change", start);
ui.tradeStyle.addEventListener("change", refreshMarket);
ui.traderLens.addEventListener("change", refreshMarket);
ui.coinSelect.addEventListener("change", () => {
  ui.symbol.value = ui.coinSelect.value;
  start();
});
ui.symbol.addEventListener("change", start);
ui.symbol.addEventListener("blur", start);
window.addEventListener("resize", () => drawChart(candlesCache));

renderPhilosophy();
loadTraderFeed();
loadTopScannerSymbols();
start();
setView("home");
renderOpenTrades();
renderClosedTrades();
renderTriggers();
setInterval(renderOpenTrades, 10000);
setInterval(checkTradeTriggers, 5000);
