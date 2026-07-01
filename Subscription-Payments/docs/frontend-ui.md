# Frontend UI Guide

This project now includes a ready Web3 UI at `frontend/`.

## Run the UI

1. Start your local blockchain (optional for local testing):

```bash
npm run node
```

2. Deploy the contract:

```bash
npm run deploy:local
```

3. Serve this repository with any static server (example):

```bash
python3 -m http.server 4173
```

4. Open in browser:

- `http://127.0.0.1:4173/frontend/`

## Use the UI

1. Connect MetaMask wallet.
2. Optional: click `Switch to Localhost` for local hardhat network.
3. Contract address is auto-filled when `frontend/contract-config.json` is available.
4. Click `Attach Contract` (or let auto-attach run when wallet+address are already known).
5. Use user actions: `Subscribe`, `Renew`, `Subscribe For`, `Cancel`, `Refresh`.
6. If wallet is owner, use owner controls to update plan, pause/unpause, grant time, and withdraw funds.

## Features in the UI

- Smooth page-load reveal animations
- Glass-style cards with hover transitions
- Animated background shapes
- Live wallet and network badge
- Owner/viewer role badge
- Live sync status and refresh timestamp
- Transaction activity log and toast notifications
- Responsive layout for desktop and mobile
- Saved contract address in browser local storage
- Smart-contract owner controls (set plan, pause, grant time, withdraw all)
- Automatic ABI loading from `artifacts/.../SubscriptionPayments.json` with fallback
- Automatic deploy config loading from `frontend/contract-config.json`

## Notes

- `npm run deploy:local` and `npm run deploy:sepolia` update `frontend/contract-config.json`.
- Fallback ABI is still embedded in `frontend/app.js` for reliability when artifact fetch is unavailable.
