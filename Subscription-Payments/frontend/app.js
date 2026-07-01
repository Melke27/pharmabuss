const FALLBACK_ABI = [
  { "inputs": [], "name": "subscribe", "outputs": [], "stateMutability": "payable", "type": "function" },
  { "inputs": [], "name": "renew", "outputs": [], "stateMutability": "payable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "beneficiary", "type": "address" }], "name": "subscribeFor", "outputs": [], "stateMutability": "payable", "type": "function" },
  { "inputs": [], "name": "cancel", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "subscriptionPriceWei", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "subscriptionPeriodSeconds", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "contractBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "isActive", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "expiresAt", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "timeLeft", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "newPriceWei", "type": "uint256" }, { "internalType": "uint256", "name": "newPeriodSeconds", "type": "uint256" }], "name": "setPlan", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "bool", "name": "shouldPause", "type": "bool" }], "name": "setPaused", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }, { "internalType": "uint256", "name": "addedSeconds", "type": "uint256" }], "name": "grantSubscription", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address payable", "name": "to", "type": "address" }], "name": "withdrawAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

const ARTIFACT_ABI_PATH = "../artifacts/contracts/SubscriptionPayments.sol/SubscriptionPayments.json";
const FRONTEND_CONFIG_PATH = "./contract-config.json";
const STORAGE_KEY = "subscriptionPayments.contractAddress";

const NETWORK_NAMES = {
  "0x1": "Ethereum Mainnet",
  "0xaa36a7": "Sepolia",
  "0x7a69": "Hardhat Localhost",
  "0x539": "Localhost 1337"
};

const state = {
  web3: null,
  account: null,
  contract: null,
  chainId: null,
  owner: null,
  paused: false,
  isOwner: false,
  contractAbi: FALLBACK_ABI,
  abiSource: "Fallback",
  refreshIntervalId: null,
  refreshing: false
};

const el = {
  contractAddress: document.getElementById("contractAddress"),
  beneficiaryAddress: document.getElementById("beneficiaryAddress"),
  ownerPriceEth: document.getElementById("ownerPriceEth"),
  ownerPeriodDays: document.getElementById("ownerPeriodDays"),
  grantAddress: document.getElementById("grantAddress"),
  grantDays: document.getElementById("grantDays"),
  withdrawAddress: document.getElementById("withdrawAddress"),
  networkBadge: document.getElementById("networkBadge"),
  walletBadge: document.getElementById("walletBadge"),
  ownerBadge: document.getElementById("ownerBadge"),
  lastRefreshBadge: document.getElementById("lastRefreshBadge"),
  syncStatus: document.getElementById("syncStatus"),
  planPrice: document.getElementById("planPrice"),
  planPeriod: document.getElementById("planPeriod"),
  planPaused: document.getElementById("planPaused"),
  contractOwner: document.getElementById("contractOwner"),
  contractBalance: document.getElementById("contractBalance"),
  abiSource: document.getElementById("abiSource"),
  isActive: document.getElementById("isActive"),
  expiry: document.getElementById("expiry"),
  timeLeft: document.getElementById("timeLeft"),
  connectBtn: document.getElementById("connectBtn"),
  attachBtn: document.getElementById("attachBtn"),
  switchLocalBtn: document.getElementById("switchLocalBtn"),
  subscribeBtn: document.getElementById("subscribeBtn"),
  renewBtn: document.getElementById("renewBtn"),
  subscribeForBtn: document.getElementById("subscribeForBtn"),
  cancelBtn: document.getElementById("cancelBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  setPlanBtn: document.getElementById("setPlanBtn"),
  grantBtn: document.getElementById("grantBtn"),
  pauseToggleBtn: document.getElementById("pauseToggleBtn"),
  withdrawAllBtn: document.getElementById("withdrawAllBtn"),
  logPanel: document.getElementById("logPanel"),
  toast: document.getElementById("toast")
};

let toastTimer;

async function init() {
  renderEmptyLog();
  bindEvents();
  attachWalletListeners();
  updateOwnerControls();
  updateActionButtons();

  const rememberedAddress = window.localStorage.getItem(STORAGE_KEY);
  if (rememberedAddress) {
    el.contractAddress.value = rememberedAddress;
  }

  log("UI ready. Loading Web3 resources...");
  await loadArtifactAbi();
  await loadFrontendConfig();
  await warmupWalletContext();

  setSyncStatus("Ready");

  if (state.account && el.contractAddress.value.trim()) {
    attachContract(false);
  }
}

function bindEvents() {
  el.connectBtn.addEventListener("click", connectWallet);
  el.attachBtn.addEventListener("click", () => attachContract(true));
  el.switchLocalBtn.addEventListener("click", switchToLocalNetwork);
  el.subscribeBtn.addEventListener("click", () => payAction("subscribe"));
  el.renewBtn.addEventListener("click", () => payAction("renew"));
  el.subscribeForBtn.addEventListener("click", subscribeForAddress);
  el.cancelBtn.addEventListener("click", cancelSubscription);
  el.refreshBtn.addEventListener("click", refreshAll);
  el.setPlanBtn.addEventListener("click", updatePlanByOwner);
  el.grantBtn.addEventListener("click", grantSubscriptionByOwner);
  el.pauseToggleBtn.addEventListener("click", togglePauseByOwner);
  el.withdrawAllBtn.addEventListener("click", withdrawAllByOwner);
}

function attachWalletListeners() {
  if (!window.ethereum) {
    return;
  }

  window.ethereum.on("accountsChanged", async (accounts) => {
    state.account = accounts[0] || null;
    updateWalletBadge();
    updateOwnerControls();
    updateActionButtons();
    await refreshAll();
    showToast("Wallet account changed");
  });

  window.ethereum.on("chainChanged", async (chainId) => {
    state.chainId = chainId;
    updateNetworkBadge();
    updateOwnerControls();
    updateActionButtons();
    await refreshAll();
    showToast("Network changed");
  });
}

async function warmupWalletContext() {
  if (!window.ethereum) {
    setSyncStatus("MetaMask not detected");
    return;
  }

  state.web3 = new window.Web3(window.ethereum);

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    state.account = accounts[0] || null;
    state.chainId = await window.ethereum.request({ method: "eth_chainId" });
    updateWalletBadge();
    updateNetworkBadge();
  } catch (error) {
    handleError(error, "Wallet warmup failed");
  }
}

async function loadArtifactAbi() {
  try {
    const response = await fetch(ARTIFACT_ABI_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`ABI fetch failed (${response.status})`);
    }

    const artifact = await response.json();
    if (Array.isArray(artifact.abi) && artifact.abi.length > 0) {
      state.contractAbi = artifact.abi;
      state.abiSource = "Artifact";
      el.abiSource.textContent = "Artifact";
      log("Loaded ABI from Hardhat artifact.");
      return;
    }

    throw new Error("Artifact ABI missing");
  } catch (error) {
    state.contractAbi = FALLBACK_ABI;
    state.abiSource = "Fallback";
    el.abiSource.textContent = "Fallback";
    log("ABI artifact unavailable. Using fallback ABI.");
  }
}

async function loadFrontendConfig() {
  try {
    const response = await fetch(FRONTEND_CONFIG_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Config file not found");
    }

    const config = await response.json();
    const configuredAddress = String(config.contractAddress || "").trim();

    if (configuredAddress) {
      if (!el.contractAddress.value.trim()) {
        el.contractAddress.value = configuredAddress;
      }

      setSyncStatus(`Config loaded for ${config.network || "network"}`);
      log(`Loaded frontend config address: ${shortAddress(configuredAddress)}`);
    }

    if (config.defaults?.subscriptionPriceEth && !el.ownerPriceEth.value) {
      el.ownerPriceEth.value = config.defaults.subscriptionPriceEth;
    }

    if (config.defaults?.subscriptionPeriodSeconds && !el.ownerPeriodDays.value) {
      el.ownerPeriodDays.value = Math.max(1, Math.floor(Number(config.defaults.subscriptionPeriodSeconds) / 86400));
    }
  } catch (error) {
    setSyncStatus("No frontend config found yet");
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    showToast("MetaMask not found");
    log("Install MetaMask first.");
    return;
  }

  setBusy(el.connectBtn, true, "Connecting...");

  try {
    state.web3 = new window.Web3(window.ethereum);
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    state.account = accounts[0] || null;
    state.chainId = await window.ethereum.request({ method: "eth_chainId" });

    updateWalletBadge();
    updateNetworkBadge();
    updateOwnerControls();
    updateActionButtons();

    log(`Wallet connected: ${shortAddress(state.account)}`);
    showToast("Wallet connected");

    if (state.contract) {
      await refreshAll();
    }
  } catch (error) {
    handleError(error, "Wallet connection failed");
  } finally {
    setBusy(el.connectBtn, false, "Connect Wallet");
  }
}

async function switchToLocalNetwork() {
  if (!window.ethereum) {
    showToast("MetaMask not found");
    return;
  }

  setBusy(el.switchLocalBtn, true, "Switching...");

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x7a69" }]
    });

    showToast("Switched to localhost");
    log("Network switched to localhost (31337).");
  } catch (error) {
    if (error?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x7a69",
          chainName: "Hardhat Localhost",
          rpcUrls: ["http://127.0.0.1:8545"],
          nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }
        }]
      });
      showToast("Localhost network added");
      log("Added Hardhat localhost network in wallet.");
    } else {
      handleError(error, "Network switch failed");
    }
  } finally {
    setBusy(el.switchLocalBtn, false, "Switch to Localhost");
  }
}

function attachContract(showFeedback = true) {
  if (!state.web3) {
    showToast("Connect wallet first");
    return;
  }

  const address = el.contractAddress.value.trim();
  if (!state.web3.utils.isAddress(address)) {
    showToast("Invalid contract address");
    return;
  }

  state.contract = new state.web3.eth.Contract(state.contractAbi, address);
  window.localStorage.setItem(STORAGE_KEY, address);

  updateActionButtons();
  startAutoRefresh();

  if (showFeedback) {
    log(`Contract attached: ${shortAddress(address)} (${state.abiSource} ABI)`);
    showToast("Contract attached");
  }

  refreshAll();
}

async function refreshAll() {
  if (!state.contract || !state.account || state.refreshing) {
    return;
  }

  state.refreshing = true;
  setBusy(el.refreshBtn, true, "Refreshing...");

  try {
    const [priceWei, periodSeconds, paused, owner, balanceWei, active, expiryUnix, timeLeftSeconds] = await Promise.all([
      safeCall("subscriptionPriceWei", [], "0"),
      safeCall("subscriptionPeriodSeconds", [], "0"),
      safeCall("paused", [], false),
      safeCall("owner", [], "0x0000000000000000000000000000000000000000"),
      safeCall("contractBalance", [], "0"),
      safeCall("isActive", [state.account], false),
      safeCall("expiresAt", [state.account], "0"),
      safeCall("timeLeft", [state.account], "0")
    ]);

    state.paused = normalizeBool(paused);
    state.owner = owner;
    state.isOwner = owner && state.account
      ? owner.toLowerCase() === state.account.toLowerCase()
      : false;

    el.planPrice.textContent = `${state.web3.utils.fromWei(String(priceWei), "ether")} ETH`;
    el.planPeriod.textContent = humanPeriod(Number(periodSeconds));
    el.planPaused.textContent = state.paused ? "Yes" : "No";
    el.contractOwner.textContent = shortAddress(owner);
    el.contractBalance.textContent = `${state.web3.utils.fromWei(String(balanceWei), "ether")} ETH`;
    el.isActive.textContent = normalizeBool(active) ? "Yes" : "No";
    el.expiry.textContent = Number(expiryUnix) > 0 ? formatDate(Number(expiryUnix)) : "-";
    el.timeLeft.textContent = humanDuration(Number(timeLeftSeconds));

    updateOwnerControls();
    updateActionButtons();
    updatePauseButtonLabel();
    updateLastRefresh();
    setSyncStatus("Synced");
  } catch (error) {
    handleError(error, "Could not refresh contract state");
  } finally {
    state.refreshing = false;
    setBusy(el.refreshBtn, false, "Refresh");
  }
}

async function payAction(methodName) {
  if (!checkUserAction(methodName)) {
    return;
  }

  const button = methodName === "subscribe" ? el.subscribeBtn : el.renewBtn;
  const baseLabel = methodName === "subscribe" ? "Subscribe" : "Renew";

  setBusy(button, true, `${baseLabel}...`);

  try {
    const priceWei = await safeCall("subscriptionPriceWei", [], "0");
    const tx = await state.contract.methods[methodName]().send({ from: state.account, value: priceWei });

    log(`${baseLabel} success. Tx: ${shortHash(tx.transactionHash)}`);
    showToast(`${baseLabel} confirmed`);
    await refreshAll();
  } catch (error) {
    handleError(error, `${baseLabel} failed`);
  } finally {
    setBusy(button, false, baseLabel);
    updateActionButtons();
  }
}

async function subscribeForAddress() {
  if (!checkUserAction("subscribeFor")) {
    return;
  }

  const beneficiary = el.beneficiaryAddress.value.trim() || state.account;
  if (!state.web3.utils.isAddress(beneficiary)) {
    showToast("Invalid beneficiary address");
    return;
  }

  setBusy(el.subscribeForBtn, true, "Sending...");

  try {
    const priceWei = await safeCall("subscriptionPriceWei", [], "0");
    const tx = await state.contract.methods.subscribeFor(beneficiary).send({ from: state.account, value: priceWei });

    log(`Subscribe for ${shortAddress(beneficiary)} success. Tx: ${shortHash(tx.transactionHash)}`);
    showToast("Sponsored subscription confirmed");
    await refreshAll();
  } catch (error) {
    handleError(error, "Subscribe for failed");
  } finally {
    setBusy(el.subscribeForBtn, false, "Subscribe For");
    updateActionButtons();
  }
}

async function cancelSubscription() {
  if (!checkUserAction("cancel")) {
    return;
  }

  setBusy(el.cancelBtn, true, "Cancelling...");

  try {
    const tx = await state.contract.methods.cancel().send({ from: state.account });
    log(`Cancel success. Tx: ${shortHash(tx.transactionHash)}`);
    showToast("Subscription cancelled");
    await refreshAll();
  } catch (error) {
    handleError(error, "Cancel failed");
  } finally {
    setBusy(el.cancelBtn, false, "Cancel");
    updateActionButtons();
  }
}

async function updatePlanByOwner() {
  if (!checkOwnerAction("setPlan")) {
    return;
  }

  const priceEth = String(el.ownerPriceEth.value || "").trim();
  const periodDays = Number(el.ownerPeriodDays.value || 0);

  if (!priceEth || Number(priceEth) <= 0 || !Number.isFinite(periodDays) || periodDays <= 0) {
    showToast("Set valid price and period");
    return;
  }

  setBusy(el.setPlanBtn, true, "Updating...");

  try {
    const newPriceWei = state.web3.utils.toWei(priceEth, "ether");
    const newPeriodSeconds = Math.floor(periodDays * 86400);

    const tx = await state.contract.methods.setPlan(newPriceWei, newPeriodSeconds).send({ from: state.account });
    log(`Plan updated. Tx: ${shortHash(tx.transactionHash)}`);
    showToast("Plan updated");
    await refreshAll();
  } catch (error) {
    handleError(error, "Plan update failed");
  } finally {
    finishOwnerAction(el.setPlanBtn, "Update Plan");
  }
}

async function grantSubscriptionByOwner() {
  if (!checkOwnerAction("grantSubscription")) {
    return;
  }

  const user = el.grantAddress.value.trim();
  const grantDays = Number(el.grantDays.value || 0);

  if (!state.web3.utils.isAddress(user)) {
    showToast("Enter valid user address");
    return;
  }

  if (!Number.isFinite(grantDays) || grantDays <= 0) {
    showToast("Grant days must be > 0");
    return;
  }

  setBusy(el.grantBtn, true, "Granting...");

  try {
    const seconds = Math.floor(grantDays * 86400);
    const tx = await state.contract.methods.grantSubscription(user, seconds).send({ from: state.account });
    log(`Granted ${grantDays} day(s) to ${shortAddress(user)}. Tx: ${shortHash(tx.transactionHash)}`);
    showToast("Subscription time granted");
    await refreshAll();
  } catch (error) {
    handleError(error, "Grant failed");
  } finally {
    finishOwnerAction(el.grantBtn, "Grant Subscription Time");
  }
}

async function togglePauseByOwner() {
  if (!checkOwnerAction("setPaused")) {
    return;
  }

  setBusy(el.pauseToggleBtn, true, state.paused ? "Unpausing..." : "Pausing...");

  try {
    const nextPaused = !state.paused;
    const tx = await state.contract.methods.setPaused(nextPaused).send({ from: state.account });
    log(`${nextPaused ? "Pause" : "Unpause"} executed. Tx: ${shortHash(tx.transactionHash)}`);
    showToast(nextPaused ? "Contract paused" : "Contract unpaused");
    await refreshAll();
  } catch (error) {
    handleError(error, "Pause toggle failed");
  } finally {
    finishOwnerAction(el.pauseToggleBtn, state.paused ? "Unpause Contract" : "Pause Contract");
  }
}

async function withdrawAllByOwner() {
  if (!checkOwnerAction("withdrawAll")) {
    return;
  }

  const destination = el.withdrawAddress.value.trim() || state.account;
  if (!state.web3.utils.isAddress(destination)) {
    showToast("Invalid withdraw address");
    return;
  }

  setBusy(el.withdrawAllBtn, true, "Withdrawing...");

  try {
    const tx = await state.contract.methods.withdrawAll(destination).send({ from: state.account });
    log(`Withdraw all to ${shortAddress(destination)}. Tx: ${shortHash(tx.transactionHash)}`);
    showToast("Contract funds withdrawn");
    await refreshAll();
  } catch (error) {
    handleError(error, "Withdraw failed");
  } finally {
    finishOwnerAction(el.withdrawAllBtn, "Withdraw All");
  }
}

function checkUserAction(methodName) {
  if (!state.contract || !state.account) {
    showToast("Connect wallet and attach contract first");
    return false;
  }

  if (!hasMethod(methodName)) {
    showToast(`Method ${methodName} not found in contract`);
    return false;
  }

  return true;
}

function checkOwnerAction(methodName) {
  if (!checkUserAction(methodName)) {
    return false;
  }

  if (!state.isOwner) {
    showToast("Only owner wallet can do that");
    return false;
  }

  return true;
}

function updateOwnerControls() {
  const ownerEnabled = Boolean(state.contract && state.account && state.isOwner);
  el.ownerBadge.textContent = ownerEnabled ? "Role: Owner" : "Role: Viewer";

  const ownerButtons = [el.setPlanBtn, el.grantBtn, el.pauseToggleBtn, el.withdrawAllBtn];
  for (const button of ownerButtons) {
    if (button.dataset.busy === "true") {
      continue;
    }
    button.disabled = !ownerEnabled;
  }
}

function updateActionButtons() {
  const ready = Boolean(state.contract && state.account);

  const actions = [el.subscribeBtn, el.renewBtn, el.subscribeForBtn, el.cancelBtn, el.refreshBtn];
  for (const button of actions) {
    if (button.dataset.busy === "true") {
      continue;
    }
    button.disabled = !ready;
  }

  if (ready && state.paused) {
    if (el.subscribeBtn.dataset.busy !== "true") {
      el.subscribeBtn.disabled = true;
    }
    if (el.renewBtn.dataset.busy !== "true") {
      el.renewBtn.disabled = true;
    }
    if (el.subscribeForBtn.dataset.busy !== "true") {
      el.subscribeForBtn.disabled = true;
    }
  }
}

function updatePauseButtonLabel() {
  if (!state.contract || !state.account || !state.isOwner) {
    el.pauseToggleBtn.textContent = "Pause / Unpause";
    return;
  }

  el.pauseToggleBtn.textContent = state.paused ? "Unpause Contract" : "Pause Contract";
}

function finishOwnerAction(button, label) {
  button.dataset.busy = "false";
  button.textContent = label;
  updateOwnerControls();
  updatePauseButtonLabel();
}

function setBusy(button, isBusy, label) {
  button.dataset.busy = isBusy ? "true" : "false";
  button.disabled = isBusy;
  button.textContent = label;
}

function hasMethod(name) {
  return Boolean(state.contract?.methods?.[name]);
}

async function safeCall(methodName, args = [], fallback = null) {
  if (!hasMethod(methodName)) {
    return fallback;
  }

  try {
    return await state.contract.methods[methodName](...args).call();
  } catch {
    return fallback;
  }
}

function normalizeBool(value) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return Boolean(value);
}

function updateWalletBadge() {
  if (!state.account) {
    el.walletBadge.textContent = "Wallet: Not connected";
    return;
  }

  el.walletBadge.textContent = `Wallet: ${shortAddress(state.account)}`;
}

function updateNetworkBadge() {
  if (!state.chainId) {
    el.networkBadge.textContent = "Network: Not connected";
    return;
  }

  const networkName = NETWORK_NAMES[state.chainId] || `Chain ${state.chainId}`;
  el.networkBadge.textContent = `Network: ${networkName}`;
}

function updateLastRefresh() {
  el.lastRefreshBadge.textContent = `Last refresh: ${new Date().toLocaleTimeString()}`;
}

function setSyncStatus(message) {
  el.syncStatus.textContent = `Sync status: ${message}`;
}

function startAutoRefresh() {
  stopAutoRefresh();

  state.refreshIntervalId = window.setInterval(() => {
    refreshAll();
  }, 15000);
}

function stopAutoRefresh() {
  if (state.refreshIntervalId) {
    window.clearInterval(state.refreshIntervalId);
    state.refreshIntervalId = null;
  }
}

function shortAddress(address) {
  if (!address || typeof address !== "string") {
    return "-";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function shortHash(hash) {
  if (!hash || hash.length < 12) {
    return hash || "submitted";
  }

  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

function formatDate(unixSeconds) {
  return new Date(unixSeconds * 1000).toLocaleString();
}

function humanPeriod(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return "-";
  }

  const days = Math.floor(totalSeconds / 86400);
  if (days > 0) {
    return `${days} day${days === 1 ? "" : "s"}`;
  }

  const hours = Math.floor(totalSeconds / 3600);
  if (hours > 0) {
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  return `${totalSeconds} sec`;
}

function humanDuration(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return "0 sec";
  }

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const chunks = [];
  if (days) {
    chunks.push(`${days}d`);
  }
  if (hours) {
    chunks.push(`${hours}h`);
  }
  if (minutes) {
    chunks.push(`${minutes}m`);
  }
  if (!chunks.length) {
    chunks.push(`${totalSeconds}s`);
  }

  return chunks.join(" ");
}

function log(message) {
  const entry = document.createElement("div");
  entry.className = "log-item";
  entry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;

  const empty = el.logPanel.querySelector(".log-empty");
  if (empty) {
    empty.remove();
  }

  el.logPanel.prepend(entry);

  while (el.logPanel.childElementCount > 12) {
    el.logPanel.removeChild(el.logPanel.lastElementChild);
  }
}

function renderEmptyLog() {
  if (!el.logPanel.querySelector(".log-empty")) {
    const empty = document.createElement("div");
    empty.className = "log-empty";
    empty.textContent = "No transactions yet.";
    el.logPanel.appendChild(empty);
  }
}

function showToast(message) {
  clearTimeout(toastTimer);
  el.toast.textContent = message;
  el.toast.classList.add("show");

  toastTimer = setTimeout(() => {
    el.toast.classList.remove("show");
  }, 2400);
}

function handleError(error, label) {
  const parsed = parseRpcError(error);
  log(`${label}: ${parsed}`);
  showToast(`${label}`);
  setSyncStatus(label);
}

function parseRpcError(error) {
  const raw = error?.reason || error?.message || "Unknown error";
  const text = String(raw);

  if (/user rejected|user denied|rejected the request/i.test(text)) {
    return "User rejected wallet request";
  }
  if (/Only owner/i.test(text)) {
    return "Only owner wallet is allowed";
  }
  if (/Contract paused/i.test(text)) {
    return "Contract is paused";
  }
  if (/Incorrect payment amount/i.test(text)) {
    return "Incorrect payment amount";
  }

  return text.length > 180 ? `${text.slice(0, 177)}...` : text;
}

window.addEventListener("beforeunload", () => {
  stopAutoRefresh();
});

init().catch((error) => {
  handleError(error, "Initialization failed");
});
