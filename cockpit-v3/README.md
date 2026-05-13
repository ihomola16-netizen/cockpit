# Trading Cockpit v3

Prva faza v3: UI skeleton s mock datami.

## Co je hotove

- samostatny projekt `cockpit-v3`
- navigacia: Dashboard, Scanner, Signal Detail, Trigger Board, Paper Trades, Real Trades, Journal, Rules
- datove modely v `models.js`
- market regime engine v `market-regime.js`
- scanner kandidatov v `scanner-engine.js`
- coin analysis engine v `coin-analysis-engine.js`
- data adapter v `data-adapter.js`
- mock dashboard market regime
- mock scanner kandidatov
- mock signal detail a trigger checklist
- mock paper trade a journal
- responzivny layout pre desktop aj mobil

## Datove modely

Zakladny kontrakt pre dalsie fazy:

- `Candidate` - coin kandidat zo scanneru, este nie obchod
- `Trigger` - cakajuci vstupny mechanizmus pre kandidata
- `PaperTrade` - simulovany obchod naviazany na candidate + trigger
- `JournalEntry` - uzavrety paper vysledok pre feedback loop

Stavy:

- candidate: `watch`, `forming`, `armed`, `triggered`, `rejected`, `invalidated`
- trigger: `waiting`, `armed`, `triggered`, `invalidated`, `expired`
- paper trade: `waiting_trigger`, `active`, `stopped`, `target`, `invalidated`, `cancelled`

## Market Regime Engine

`market-regime.js` zatial pracuje s mock vstupmi:

- BTC 1h/4h bias
- ETH 1h/4h bias
- BTC/ETH pozicia voci VWAP
- funding
- OI change
- volatilita
- alt breadth

Vystup:

- `risk_on`
- `mixed`
- `risk_off`
- `chop`

Regime sa uz vie aplikovat na kandidatov ako penalizacia, aby scanner neskor neposielal agresivne signaly proti trhu.

## Scanner Engine

`scanner-engine.js` zatial bezi nad mock analyzami coinov.

Pipeline:

1. `mockCoinAnalysis`
2. `classifySetup`
3. `scoreCoin`
4. `candidateStateFromScores`
5. `buildCandidateFromAnalysis`
6. `runMockScanner`

Scanner uz nerozmysla ako obchodny bot. Vytvara kandidatov so stavmi:

- `watch`
- `forming`
- `armed`
- `triggered`
- `rejected`

Kazdy kandidat ma:

- setup typ
- score breakdown
- dovody za/proti
- metrics snapshot
- samostatne trade plans

## Coin Analysis Engine

`coin-analysis-engine.js` normalizuje coin analyzu pred scannerom.

Zatial bezi nad mock coin datami, ale vytvara jednotny vystup:

- direction bias
- quality flags
- risk flags
- normalized hodnoty
- textovy summary

Scanner uz vie pouzit normalizovane analyzy namiesto surovych mock objektov. Toto je priprava na live data adapter.

## Data Adapter

`data-adapter.js` pripravuje prechod z mock dat na live Binance public API.

Rezimy:

- `mock`
- `live`

Live adapter zatial vie:

- nacitat Binance futures klines
- nacitat premium/funding
- nacitat 24h ticker
- nacitat book ticker/spread
- vypocitat zakladne hodnoty: EMA, VWAP, ATR, RSI, volume ratio, support/resistance room

Default ostava `mock`, aby UI bolo stabilne. Live rezim je pripraveny ako dalsia vrstva.

## Live pipeline status

Aktualne je napojene a v UI je defaultne pouzity live rezim:

- prepnutie `Data mode`
- selected coin karta
- scanner kandidati
- rules engine
- trigger board
- paper mock nad aktualnymi kandidatmi
- journal mock nad aktualnymi kandidatmi

Live rezim zatial pouziva zakladny fixny universe:

`BTCUSDT, ETHUSDT, SOLUSDT, BNBUSDT, XRPUSDT, SUIUSDT, APTUSDT, NEARUSDT, WLDUSDT, LINKUSDT`

Ak live request zlyha, appka sa docasne vrati na fallback data, ale UI uz nezobrazuje mock mode prepínac.

Trade plany zo scanneru sa pocitaju z aktualnej analyzovanej ceny coinu, nie z hardcoded mock cien.

## Storage

`storage.js` uklada zakladny stav do `localStorage`.

Uklada sa:

- selected coin
- data mode
- rules
- paper state
- journal entries

Paper karta ma tlacidlo `Clear paper`, ktore vymaze paper/journal test stav.

## Live Paper Tracking

Signal Detail tlacidlo `Start Paper When Triggered` vytvori paper trade z aktualne vybraneho kandidata.

Paper tracking teraz vie:

- ulozit waiting/active paper trades do storage
- aktivovat waiting trade pri dotyku planovaneho entry
- v live rezime kazdych par sekund nacitat cenu pre aktivne/waiting coiny
- sledovat TP hits
- zavriet trade na SL alebo final TP
- zapisat uzavrety trade do journal storage

Zatial ide o jednoduchy price-based simulator. Neriesi order book fill, slippage ani partial exits.

## Charts + Real Trades

Dashboard, Paper a Real Trades pouzivaju TradingView iframe.

Graf sa synchronizuje podla selected coinu a URL sa meni iba ked sa zmeni coin/timeframe, aby iframe zbytocne nepreblikaval.

Real Trades karta je manualny monitoring:

- pair
- direction
- style
- entry
- live
- leverage %
- SL / TP vzdialenost
- management text

Real trades sa ukladaju do localStorage. Appka uz sama nevytvara testovacie real trades.

## Final MVP status

V3 je teraz prvy testovatelny MVP skeleton:

- UI workflow
- data models
- market regime
- coin analysis
- scanner
- rules
- signal detail
- trigger board
- paper simulator
- journal feedback
- live Binance adapter
- localStorage
- TradingView grafy
- real trades monitoring
- GitHub Pages priprava

Stale treba realne testovanie v prehliadaci a ladenie rozhodovacich pravidiel.

## Signal Detail

Signal Detail uz nie je staticky panel. Po kliknuti na kandidata zo scanneru sa prepise:

- nazov a smer
- setup typ
- stav kandidata
- score breakdown
- trigger checklist
- dovody za/proti
- nezavisle plany pre scalp, intraday a swing

Tato obrazovka je pracovny priestor medzi scannerom a trigger boardom.

## Trigger Engine

`trigger-engine.js` vytvara trigger z kandidata.

Trigger obsahuje:

- candidate id
- pair / direction / style
- trigger type
- timeframe
- entry zone
- checklist
- invalidation
- status

Stavy:

- `waiting`
- `armed`
- `triggered`
- `invalidated`
- `expired`

Trigger Board sa uz renderuje z kandidatov a po kliknuti na trigger otvori jeho Signal Detail.

## Paper Simulator

`paper-simulator.js` je zatial mock simulator nad kandidatmi a trigger boardom.

Vie:

- vytvorit paper trade z triggeru
- rozlisit `waiting_trigger` a `active`
- naviazat trade na candidate + trigger
- zobrazit entry, live, SL, TP mapu
- simulovat snapshot pohybu
- pripravit journal entry z uzavreteho paper tradu

Zatial nepouziva live cenu. V dalsich fazach sa sem napoji trigger engine a realne price updates.

## Journal Feedback

`journal-engine.js` vytvara feedback vrstvu nad uzavretymi paper obchodmi.

Vie:

- vytvorit summary
- spocitat winrate
- spocitat priemerne percenta
- spocitat priemerne leveraged percenta
- zoskupit vysledky podla setupu, stylu a trigger typu
- rozpoznat jednoduchy failure pattern

Journal obrazovka uz nie je staticka. Renderuje summary, feedback a tabulku obchodov z modelu.

## Rules Engine

`rules-engine.js` definuje viditelne pravidla scanneru.

Aktualne pravidla:

- market regime penalty
- conflict penalty
- min volume ratio
- max VWAP extension
- min edge
- max spread
- min risk score
- max funding
- volitelny BTC alignment

Scanner kandidati uz prechadzaju cez `applyRulesToCandidates`, takze pravidla vedia zmenit final score alebo kandidata odmietnut.

## Co zatial nie je zapojene

- Binance live data
- realny scanner
- trigger engine
- paper simulator logika
- journal feedback vypocty
- GitHub Pages deploy pre v3

## Ako otvorit

Otvor `index.html` v prehliadaci.

Tato verzia sluzi na kontrolu workflow a UI pred tym, nez sa napoji realna logika.
