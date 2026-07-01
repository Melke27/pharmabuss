// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SubscriptionPayments {
    address public owner;
    uint256 public subscriptionPriceWei;
    uint256 public subscriptionPeriodSeconds;
    bool public paused;

    mapping(address => uint256) private _subscriptionExpiry;

    event Subscribed(address indexed subscriber, uint256 amount, uint256 expiresAt);
    event Cancelled(address indexed subscriber, uint256 cancelledAt);
    event PlanUpdated(uint256 newPriceWei, uint256 newPeriodSeconds);
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);
    event Withdrawal(address indexed to, uint256 amount);
    event Paused(bool isPaused);
    event SubscriptionGranted(address indexed user, uint256 addedSeconds, uint256 newExpiry);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract paused");
        _;
    }

    constructor(uint256 priceWei, uint256 periodSeconds) {
        require(priceWei > 0, "Price must be > 0");
        require(periodSeconds > 0, "Period must be > 0");

        owner = msg.sender;
        subscriptionPriceWei = priceWei;
        subscriptionPeriodSeconds = periodSeconds;
    }

    function subscribe() external payable whenNotPaused {
        _processSubscription(msg.sender);
    }

    function renew() external payable whenNotPaused {
        _processSubscription(msg.sender);
    }

    function subscribeFor(address beneficiary) external payable whenNotPaused {
        require(beneficiary != address(0), "Invalid beneficiary");
        _processSubscription(beneficiary);
    }

    function cancel() external {
        require(_subscriptionExpiry[msg.sender] > block.timestamp, "No active subscription");
        _subscriptionExpiry[msg.sender] = block.timestamp;

        emit Cancelled(msg.sender, block.timestamp);
    }

    function setPlan(uint256 newPriceWei, uint256 newPeriodSeconds) external onlyOwner {
        require(newPriceWei > 0, "Price must be > 0");
        require(newPeriodSeconds > 0, "Period must be > 0");

        subscriptionPriceWei = newPriceWei;
        subscriptionPeriodSeconds = newPeriodSeconds;

        emit PlanUpdated(newPriceWei, newPeriodSeconds);
    }

    function setPaused(bool shouldPause) external onlyOwner {
        paused = shouldPause;
        emit Paused(shouldPause);
    }

    function grantSubscription(address user, uint256 addedSeconds) external onlyOwner {
        require(user != address(0), "Invalid user");
        require(addedSeconds > 0, "Seconds must be > 0");

        uint256 base = _subscriptionExpiry[user] > block.timestamp
            ? _subscriptionExpiry[user]
            : block.timestamp;
        uint256 newExpiry = base + addedSeconds;
        _subscriptionExpiry[user] = newExpiry;

        emit SubscriptionGranted(user, addedSeconds, newExpiry);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");

        address oldOwner = owner;
        owner = newOwner;

        emit OwnershipTransferred(oldOwner, newOwner);
    }

    function withdraw(address payable to, uint256 amount) external onlyOwner {
        _withdraw(to, amount);
    }

    function withdrawAll(address payable to) external onlyOwner {
        _withdraw(to, address(this).balance);
    }

    function _withdraw(address payable to, uint256 amount) internal {
        require(to != address(0), "Invalid recipient");
        require(amount <= address(this).balance, "Insufficient balance");

        (bool sent, ) = to.call{value: amount}("");
        require(sent, "Transfer failed");

        emit Withdrawal(to, amount);
    }

    function isActive(address user) public view returns (bool) {
        return _subscriptionExpiry[user] > block.timestamp;
    }

    function expiresAt(address user) external view returns (uint256) {
        return _subscriptionExpiry[user];
    }

    function timeLeft(address user) external view returns (uint256) {
        if (_subscriptionExpiry[user] <= block.timestamp) {
            return 0;
        }

        return _subscriptionExpiry[user] - block.timestamp;
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function _processSubscription(address beneficiary) internal {
        require(msg.value == subscriptionPriceWei, "Incorrect payment amount");

        uint256 base = _subscriptionExpiry[beneficiary] > block.timestamp
            ? _subscriptionExpiry[beneficiary]
            : block.timestamp;

        uint256 newExpiry = base + subscriptionPeriodSeconds;
        _subscriptionExpiry[beneficiary] = newExpiry;

        emit Subscribed(beneficiary, msg.value, newExpiry);
    }
}
