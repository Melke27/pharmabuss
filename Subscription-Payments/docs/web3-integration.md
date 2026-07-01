# Web3.js Integration Guide

This guide shows how to connect your app to the deployed `SubscriptionPayments` contract using `web3.js`.

If you want a ready UI, use the included frontend in `frontend/` (see `docs/frontend-ui.md`).

Enhanced contract methods also include `subscribeFor`, `setPaused`, `grantSubscription`, and `withdrawAll`.
The built-in frontend auto-loads ABI from Hardhat artifacts and contract config from `frontend/contract-config.json`.

## 1. Install web3

```bash
npm install web3
```

## 2. Frontend example

```javascript
import Web3 from "web3";

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

const abi = [
  {
    "inputs": [],
    "name": "subscribe",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renew",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "subscriptionPriceWei",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "isActive",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "expiresAt",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "cancel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function setup() {
  if (!window.ethereum) {
    throw new Error("MetaMask not detected");
  }

  const web3 = new Web3(window.ethereum);
  await window.ethereum.request({ method: "eth_requestAccounts" });

  const [account] = await web3.eth.getAccounts();
  const contract = new web3.eth.Contract(abi, contractAddress);

  return { web3, account, contract };
}

export async function subscribeUser() {
  const { account, contract } = await setup();

  const price = await contract.methods.subscriptionPriceWei().call();
  await contract.methods.subscribe().send({ from: account, value: price });
}

export async function renewUser() {
  const { account, contract } = await setup();

  const price = await contract.methods.subscriptionPriceWei().call();
  await contract.methods.renew().send({ from: account, value: price });
}

export async function cancelUser() {
  const { account, contract } = await setup();

  await contract.methods.cancel().send({ from: account });
}

export async function readSubscriptionStatus(userAddress) {
  const { contract } = await setup();

  const active = await contract.methods.isActive(userAddress).call();
  const expiry = await contract.methods.expiresAt(userAddress).call();

  return {
    active,
    expiryUnix: Number(expiry),
    expiryDate: new Date(Number(expiry) * 1000).toISOString()
  };
}
```

## 3. Backend script example (Node.js)

```javascript
const Web3 = require("web3");

async function checkUserStatus() {
  const web3 = new Web3(process.env.RPC_URL);

  const abi = [
    {
      "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
      "name": "isActive",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
  const active = await contract.methods.isActive(process.env.USER_ADDRESS).call();

  console.log("Active:", active);
}

checkUserStatus().catch(console.error);
```

## 4. Recommended production checks

- Confirm network/chain ID before sending transactions.
- Show gas estimate to users before they approve.
- Handle rejected transactions and pending confirmations in UI.
- Store subscription state both on-chain and in your app database for faster querying.
