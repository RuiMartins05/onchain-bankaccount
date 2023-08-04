# Introduction
This project simulates a bank account based on a smart contract on the testing network, Sepolia

## Features
- Deposit
- Withdraw
- Send money to other accounts

## Setup
```bash
npm install
```

## Dependencies
```bash
npm install @openzeppelin/contracts
npm install @rainbow-me/rainbowkit wagmi viem
npm install dotenv
```

## Requirements
- Have a MetaMask account (Never use an account with real funds)
- Have Eth on the Sepolia network (Get funds here: https://sepoliafaucet.com/)
- Create a .env file with the following information:
    ```env
    ETHERSCAN_API_KEY="..."
    RPC_URL="..."
    PRIVATE_KEY="..."
    ```
    - use a QuickNode endpoint (https://dashboard.quicknode.com/endpoints) for the RPC 
- Deploy the contract in "scripts/deploy.js"
- Make sure to login the account that is the owner of the deployed contract

## Limitations
- Design: This project wasn't meant to have a nice design
