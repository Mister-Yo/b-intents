# 1Click Swap - Claude Context

## Project Overview
Cross-chain swap application for Defuse Protocol. Users can swap tokens between NEAR, Solana, EVM chains, and TON using the HOT Wallet connector.

**Live URL:** https://1click-deploy.vercel.app
**GitHub:** https://github.com/Mister-Yo/1ckick-intents

## Tech Stack
- **Framework**: React 18 + TypeScript + Vite 6
- **Styling**: Tailwind CSS + Radix UI Themes (dark mode)
- **State**: Zustand + TanStack Query
- **Forms**: React Hook Form
- **Wallet**: @hot-labs/kit (HOT Connector)
- **API**: @defuse-protocol/one-click-sdk-typescript

## Project Structure
```
src/
├── components/
│   ├── dialogs/           # SelectChainDialog, SelectTokenOnlyDialog
│   └── layout/            # Header with wallet button
├── config/
│   ├── defuse-sdk.ts      # Defuse SDK setup
│   └── hot-connector.ts   # HOT wallet config (NEAR, Solana, EVM, TON)
├── hooks/
│   └── useConnectWallet.ts # Wallet connection, balance, transfer
├── pages/
│   └── one-click-swap/
│       ├── components/
│       │   ├── swap-form/        # Main form with Swap/Limit tabs
│       │   ├── swap-input-block/ # Token input (hex.exchange style)
│       │   ├── RecipientForm.tsx # Recipient address input
│       │   ├── SwapRateInfo.tsx  # Swap rate display
│       │   └── ErrorDisplay.tsx  # Error message component
│       └── queries/
│           ├── useSwapQuote.ts   # Quote API (/v0/quote)
│           └── useTokens.ts      # Tokens API (/v0/tokens)
├── providers/
│   └── hot-connector-provider/   # Wallet provider wrapper
├── stores/
│   └── useOneClickSwapStore.ts   # Token selection state
└── utils/
    └── format.ts                 # formatTokenValue, formatUsdAmount
```

## Key Components

### swap-form/index.tsx
Main swap form orchestrating all components:
- Manages form state via React Hook Form
- Handles quote fetching with useSwapQuote
- Swap execution flow via @defuse-protocol/one-click-sdk

### swap-input-block/index.tsx
Token input component (styled like hex.exchange):
- Chain selector in header
- Token icon + symbol + amount input
- Balance display (From) or "To receive: $X" (To)
- MAX button for From side

### useSwapQuote.ts
Quote fetching hook:
- Uses `dry: true` when no recipient (test request)
- Returns amountOutFormatted, amountOutUsd
- Handles deposit address for cross-chain swaps

### useConnectWallet.ts
Wallet integration hook:
- `connect()` - Opens HOT wallet modal
- `disconnect()` - Disconnects wallet
- `getBalance(blockchain)` - Gets native token balance
- `transferAmount(blockchain, recipient, amount, gasFee?)` - Sends transaction

## API Endpoints
Base URL: `https://1click.chaindefuser.com`

- `POST /v0/tokens` - Get available tokens (filters: chainIds)
- `POST /v0/quote` - Get swap quote
  - Request: tokenIn, tokenOut, amountIn, recipient, dry
  - Response: quote.amountOutFormatted, quote.amountOutUsd, quote.depositAddress

## Design System
Dark theme with colors:
- Background: #0a0a0a
- Card: #141414
- Secondary: #252525
- Border: white/[0.06]
- Accent: emerald-400

## Development

```bash
npm install --legacy-peer-deps
npm run dev          # Port 5173
npm run build
```

## Deployment

**Vercel Dashboard:** https://vercel.com/intents/1ckick-intents
**Production URL:** https://1ckick-intents-git-main-intents.vercel.app

### Deploy Hook (Recommended)
```bash
# Trigger deployment via curl
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_0LEKQtrVptLQoQgEU4YJCAdfFpyV/qYBedQ6h3I"
```

### Manual Deploy via Git
```bash
git push origin main
# Then trigger deploy hook above (auto-deploy may not work)
```

### Environment Variables (Vercel Settings)
- `VITE_HOT_LABS_API_KEY` - Hot Labs API key for wallet connector

### Required Files
- `src/gen/bannedNearAddress.json` - Must be in git (contains `[]`)
- This file was previously in .gitignore, causing build failures

### Troubleshooting Build Errors
1. Check Build Logs in Vercel Dashboard
2. Common error: "Cannot find module '@/gen/bannedNearAddress.json'" - ensure file is committed
3. Run `npm run build` locally to verify before pushing

### Make Site Public
Settings → Deployment Protection → Disable "Vercel Authentication"

## Recent Fixes (Jan 2025)
- Fixed NearConnector "No wallet selected" error by disabling tokenOut balance fetch
- Added recipient validation before showing quote errors
- Disabled browser autocomplete on inputs
- Removed input focus highlight styles
- Added proper spacing to error display
