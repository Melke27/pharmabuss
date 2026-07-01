const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const priceEth = process.env.SUBSCRIPTION_PRICE_ETH || "0.01";
  const periodSeconds = Number(process.env.SUBSCRIPTION_PERIOD_SECONDS || 30 * 24 * 60 * 60);

  const subscriptionPriceWei = ethers.parseEther(priceEth);

  const SubscriptionPayments = await ethers.getContractFactory("SubscriptionPayments");
  const contract = await SubscriptionPayments.deploy(subscriptionPriceWei, periodSeconds);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  console.log("SubscriptionPayments deployed");
  console.log("Address:", address);
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", chainId);
  console.log("Plan price (ETH):", priceEth);
  console.log("Plan period (seconds):", periodSeconds);

  const configPath = path.join(__dirname, "..", "frontend", "contract-config.json");
  const frontendConfig = {
    contractAddress: address,
    network: hre.network.name,
    chainId,
    deployedAt: new Date().toISOString(),
    defaults: {
      subscriptionPriceEth: priceEth,
      subscriptionPeriodSeconds: periodSeconds
    }
  };

  fs.writeFileSync(configPath, JSON.stringify(frontendConfig, null, 2));
  console.log("Frontend config written:", configPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
