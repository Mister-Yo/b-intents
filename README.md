# 1Click Swap - Cross-Chain DEX

Cross-chain swap application built on [Defuse Protocol](https://defuse.org). Swap tokens between NEAR, Solana, EVM chains (Ethereum, Base, Arbitrum), and TON using HOT Wallet.

## Live Demo

🌐 **Production:** https://1ckick-intents-git-main-intents.vercel.app

## Features

- **Multi-chain Support** - NEAR, Solana, Ethereum, Base, Arbitrum, TON
- **HOT Wallet Integration** - Seamless wallet connection across all supported chains
- **Real-time Quotes** - Instant swap rate calculations via Defuse Protocol
- **Cross-chain Swaps** - Swap tokens between different blockchains
- **Swap History** - Track your previous swaps
- **Modern UI** - Clean dark interface inspired by hex.exchange

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS + Radix UI |
| State | Zustand + TanStack Query |
| Forms | React Hook Form |
| Wallet | @hot-labs/kit |
| Protocol | @defuse-protocol/one-click-sdk |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Mister-Yo/1ckick-intents.git
cd 1ckick-intents

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The app will be available at http://localhost:5173

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── dialogs/           # Token/Chain selection dialogs
│   └── layout/            # Header, navigation
├── config/
│   ├── defuse-sdk.ts      # Defuse SDK configuration
│   └── hot-connector.ts   # HOT wallet setup
├── hooks/
│   └── useConnectWallet.ts # Wallet connection hook
├── pages/
│   └── one-click-swap/
│       ├── components/
│       │   ├── swap-form/        # Main swap form
│       │   ├── swap-input-block/ # Token input component
│       │   └── history/          # Swap history
│       └── queries/
│           ├── useSwapQuote.ts   # Quote fetching
│           └── useTokens.ts      # Token list
├── providers/
│   └── hot-connector-provider/   # Wallet provider
├── stores/
│   └── useOneClickSwapStore.ts   # Global state
└── utils/
    └── format.ts                 # Formatting utilities
```

## Supported Chains

| Chain | Native Token | Description |
|-------|--------------|-------------|
| NEAR | NEAR | NEAR Protocol |
| Solana | SOL | Solana blockchain |
| Ethereum | ETH | Ethereum mainnet |
| Base | ETH | Base L2 |
| Arbitrum | ETH | Arbitrum One |
| TON | TON | The Open Network |

## Environment Variables

Create `.env.local` file (optional):

```env
VITE_HOT_LABS_API_KEY=your_api_key_here
```

## Documentation

- [Testing Guide](./docs/TESTING.md) - For QA testers
- [Development Guide](./CLAUDE.md) - Technical details for developers

## API Reference

Base URL: `https://1click.chaindefuser.com`

### Get Tokens
```http
POST /v0/tokens
Content-Type: application/json

{ "chainIds": ["near", "eth", "sol"] }
```

### Get Quote
```http
POST /v0/quote
Content-Type: application/json

{
  "tokenIn": "near:native",
  "tokenOut": "eth:0x...",
  "amountIn": "1000000000000000000000000",
  "recipient": "0x...",
  "dry": false
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Links

- [Defuse Protocol](https://defuse.org)
- [HOT Wallet](https://hot-labs.org)
- [GitHub Repository](https://github.com/Mister-Yo/1ckick-intents)
