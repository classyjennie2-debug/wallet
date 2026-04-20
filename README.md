# Web3 Wallet Manager

A modern, feature-rich Web3 wallet management application built with Next.js, TypeScript, and Tailwind CSS. This application provides an intuitive interface for managing cryptocurrency portfolios across multiple blockchain networks.

## 🌟 Features

### Core Wallet Features
- **Multi-Chain Support**: Seamlessly manage assets across Ethereum, Polygon, Arbitrum, and Base
- **Wallet Connection**: Connect using Web3Modal with support for MetaMask, Ledger, Trezor, and other wallet providers
- **Real-time Portfolio Dashboard**: View your complete portfolio with live balance tracking
- **Token Transfers**: Send tokens to any Ethereum address with validation
- **Token Swaps**: Execute token swaps directly from the application (requires integration with DEX)

### Advanced Features
- **Dead Coin Detector**: Identify and analyze potentially worthless tokens in your wallet
  - Detects zero liquidity tokens
  - Identifies renounced contracts
  - Alerts on honeypot tokens
  - Flags unverified contracts
  - Detects tokens with no trading activity
  
- **One-Click Dead Coin Removal**: Easily remove identified dead coins from your tracking
- **Multi-Network Analysis**: Analyze your holdings across all supported chains simultaneously

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Web3 wallet (MetaMask, Ledger, etc.)
- Alchemy or Infura API key (for RPC endpoints)
- WalletConnect Project ID (from [Reown Dashboard](https://dashboard.reown.com))

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_from_reown
   NEXT_PUBLIC_ETHEREUM_RPC=your_ethereum_rpc_url
   NEXT_PUBLIC_POLYGON_RPC=your_polygon_rpc_url
   NEXT_PUBLIC_ARBITRUM_RPC=your_arbitrum_rpc_url
   NEXT_PUBLIC_BASE_RPC=your_base_rpc_url
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── wallet-connect.tsx  # Wallet connection button
│   ├── portfolio.tsx       # Portfolio dashboard
│   ├── dead-coin-detector.tsx  # Dead coin analysis
│   ├── token-swap.tsx      # Token swap interface
│   └── send-token.tsx      # Token transfer interface
└── lib/
    ├── providers.tsx       # Wagmi and React Query providers
    ├── wallet-context.tsx  # Wallet state management
    └── web3-config.ts      # Web3 configuration
```

## 🔌 Supported Networks

| Network | Chain ID | Mainnet | Testnet |
|---------|----------|---------|---------|
| Ethereum | 1 | ✅ | Sepolia (11155111) |
| Polygon | 137 | ✅ | Mumbai (80001) |
| Arbitrum | 42161 | ✅ | Sepolia (421614) |
| Base | 8453 | ✅ | Sepolia (84532) |

## 🔐 Security Features

- **No Private Key Storage**: Uses Web3Modal for secure wallet connection
- **Client-Side Only**: All operations happen in the browser
- **Read-Only RPC**: Uses public RPC endpoints for blockchain queries
- **Contract Validation**: Verifies contract legitimacy before interactions

## 📊 Key Components

### Portfolio Dashboard
Displays:
- Total portfolio value in USD
- Individual token holdings with balances
- Token images and metadata
- Real-time price tracking

### Dead Coin Detector
Analyzes tokens for:
- Zero trading volume
- Renounced ownership
- Locked liquidity
- Honeypot detection
- Unverified smart contracts

### Token Operations
- **Swap**: Execute token-to-token swaps
- **Send**: Transfer tokens to addresses
- **Track**: Monitor portfolio across chains

## 🛠️ Technology Stack

- **Frontend**: React 19 + Next.js 16
- **Blockchain**: Wagmi + Ethers.js v6 + Viem
- **Wallet**: Web3Modal + WalletConnect
- **Styling**: Tailwind CSS
- **State Management**: React Context + TanStack React Query
- **Type Safety**: TypeScript

## 📦 Main Dependencies

```json
{
  "dependencies": {
    "wagmi": "^2.x",
    "viem": "^2.x",
    "ethers": "^6.x",
    "@web3modal/wagmi": "^5.x",
    "@tanstack/react-query": "^5.x",
    "next": "^16.x",
    "react": "^19.x"
  }
}
```

## 🚦 Commands

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## ⚠️ Disclaimer

This application is provided as-is for educational and informational purposes. It is not financial advice. Users are solely responsible for their actions and decisions related to cryptocurrency transactions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Useful Links

- [Web3Modal Docs](https://docs.reown.com)
- [Wagmi Documentation](https://wagmi.sh)
- [Ethers.js v6](https://docs.ethers.org/v6/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

**Built with ❤️ for the Web3 community**

