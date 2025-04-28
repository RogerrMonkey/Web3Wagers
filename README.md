# Web3Wagers 🌐

A decentralized prediction market platform built on Ethereum where users can create, participate in, and resolve prediction markets. Powered by Next.js, Tailwind CSS, and thirdweb, Web3Wagers brings blockchain betting into a sleek, intuitive user experience.

## Features 🚀

### Market Interaction
- **Create Prediction Markets**: Admins can easily set up binary (Yes/No) prediction markets.
- **Place Bets with Sepolia ETH**: Users can bet on outcomes directly using Sepolia testnet ETH.
- **Real-time Market Stats**: See total pool size and outcome distributions live.
- **Claim Winnings**: Winners can claim their rewards post-market resolution.

### Platform Navigation
- **Market Categories**: View markets sorted as Active, Pending Resolution, and Resolved.
- **Admin Dashboard**: Admins get a special dashboard for managing markets.
- **Wallet Integration**: Securely connect and interact using your Ethereum wallet (like MetaMask).

## Tech Stack 🛠️
- **Frontend**: Next.js 15.x, React 18.x
- **Styling**: Tailwind CSS, tailwind-merge, tailwindcss-animate
- **Web3 Integration**: thirdweb SDK, ethers.js
- **Components**: Radix UI, Lucide React icons
- **State Management**: React Query
- **Blockchain**: Smart contract deployed on Sepolia Testnet

## Smart Contract 🔖
- Deployed Address: `0x483E9ea94E903Eb87176F926d3a90221FcD1d5d8`
- Network: Ethereum Sepolia Testnet

## Setup Instructions 💻

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Web3Wagers.git
cd Web3Wagers
```

### 2. Install Dependencies
```bash
npm install
# or
yarn
```

### 3. Configure Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your-thirdweb-client-id
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) to explore the app.

## How to Use 🖋️

### For Users
1. Connect your Ethereum wallet.
2. Browse available prediction markets.
3. Place your bets using Sepolia ETH.
4. Claim rewards if your prediction wins after market resolution!

### For Administrators
1. Navigate to `/admin` dashboard.
2. Create new markets with questions, options, and expiration.
3. Resolve finished markets by selecting the winning outcome.

### Connecting to Sepolia Testnet
- Configure your wallet to the Sepolia network.
- Grab Sepolia ETH from a faucet like [Alchemy's Sepolia Faucet](https://sepoliafaucet.com/).

## Development 🚀

### Build for Production
```bash
npm run build
# or
yarn build
```

### Start Production Server
```bash
npm start
# or
yarn start
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## Future Improvements ✨
- Add multi-option prediction markets (not just Yes/No)
- Implement dynamic odds based on betting pool ratios
- Expand to mainnet deployment for real-world use
- Mobile app integration

## Contributions 🤝
Contributions are welcome! Feel free to fork, make changes, and submit a pull request.

## Contact 📨
Questions or feedback? Reach out at [harshpatil.prf@gmail.com].

