require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const networks = {
  localhost: {
    url: process.env.LOCAL_RPC_URL || "http://127.0.0.1:8545"
  }
};

if (process.env.SEPOLIA_RPC_URL && process.env.PRIVATE_KEY) {
  networks.sepolia = {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY]
  };
}

module.exports = {
  solidity: "0.8.24",
  networks
};
