# TicketX

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

> A blockchain-based ticket booking system built on Ethereum

TicketX is a decentralized application (dApp) that allows users to book tickets using cryptocurrency. The system calculates fare based on distance, processes payments through smart contracts, and stores ticket data both on-chain and in a traditional database.

![TicketX Screenshot](https://via.placeholder.com/800x400?text=TicketX+Screenshot)

## Features

✅ Book tickets using Ethereum cryptocurrency  
✅ Automatic fare calculation based on distance  
✅ MetaMask wallet integration  
✅ Blockchain transaction verification  
✅ Ticket history and management  
✅ PDF ticket generation  

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contracts**: Solidity

## Installation

### Prerequisites

- Node.js (v14+)
- PostgreSQL
- MetaMask browser extension
- Sepolia testnet ETH

### Clone the repository

```bash
git clone https://github.com/yourusername/TicketX.git
cd TicketX
```

### Smart Contract Setup

```bash
cd smart-contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

Note the deployed contract address for configuration.

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Update the `.env` file with your PostgreSQL and contract details:

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5431
POSTGRES_DB=your_database
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
CONTRACT_ADDRESS=your_contract_address
```

Start the backend server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Update the `.env` file with your contract address and backend URL:

```
REACT_APP_CONTRACT_ADDRESS=your_contract_address
REACT_APP_BACKEND_URL=http://localhost:3001
```

Start the frontend development server:

```bash
npm start
```

## Usage

1. Connect your MetaMask wallet to Sepolia testnet
2. Enter source and destination locations
3. Review the calculated fare
4. Confirm booking and approve the transaction in MetaMask
5. View your ticket in the "My Tickets" section

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Ethereum](https://ethereum.org/) - Blockchain platform
- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [Ethers.js](https://docs.ethers.io/) - Ethereum library
- [React](https://reactjs.org/) - Frontend framework
- [Express](https://expressjs.com/) - Backend framework
- [Sequelize](https://sequelize.org/) - ORM for PostgreSQL
