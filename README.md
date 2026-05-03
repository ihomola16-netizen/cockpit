# Trading Cockpit

Staticka web appka pre Binance Futures analyzu, Opportunity Scanner, Open Trades, Triggers a trade management.

## Co nahrat na GitHub

Nahraj obsah tohto priecinka `github-pages-app` do noveho GitHub repository:

- `index.html`
- `analysis.html`
- `analysis.css`
- `analysis.js`
- `landing.css`
- `manifest.webmanifest`
- `sw.js`
- `README.md`

## GitHub Pages postup

1. Na GitHube vytvor novy repository, napr. `trading-cockpit`.
2. Nahraj subory z tohto priecinka.
3. Otvor repository `Settings`.
4. Klikni `Pages`.
5. Source nastav na `Deploy from a branch`.
6. Branch nastav na `main`, folder na `/root`.
7. Uloz.
8. GitHub vytvori link typu `https://tvoje-meno.github.io/trading-cockpit/`.

## Aktualizacie

Ked appku upravime, znovu nahras/commitnes zmenene subory do toho isteho repository. GitHub Pages sa aktualizuje automaticky.

## Bezpecnost

Appka nepouziva Binance API kluce a neposiela ordery. Pouziva verejne Binance market data. Open Trades, Closed Trades a Triggers su ulozene lokalne v prehliadaci zariadenia.
