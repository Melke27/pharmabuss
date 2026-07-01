const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("SubscriptionPayments", function () {
  const PRICE = ethers.parseEther("0.01");
  const PERIOD = 30 * 24 * 60 * 60;
  const BONUS_SECONDS = 7 * 24 * 60 * 60;

  async function deployFixture() {
    const [owner, alice, bob] = await ethers.getSigners();
    const SubscriptionPayments = await ethers.getContractFactory("SubscriptionPayments");
    const contract = await SubscriptionPayments.deploy(PRICE, PERIOD);
    await contract.waitForDeployment();

    return { contract, owner, alice, bob };
  }

  it("subscribes with exact payment", async function () {
    const { contract, alice } = await deployFixture();

    await expect(contract.connect(alice).subscribe({ value: PRICE }))
      .to.emit(contract, "Subscribed")
      .withArgs(alice.address, PRICE, anyValue);

    expect(await contract.isActive(alice.address)).to.equal(true);
  });

  it("allows paying for another user via subscribeFor", async function () {
    const { contract, alice, bob } = await deployFixture();

    await expect(contract.connect(alice).subscribeFor(bob.address, { value: PRICE }))
      .to.emit(contract, "Subscribed")
      .withArgs(bob.address, PRICE, anyValue);

    expect(await contract.isActive(bob.address)).to.equal(true);
  });

  it("extends expiry when renewing an active subscription", async function () {
    const { contract, alice } = await deployFixture();

    await contract.connect(alice).subscribe({ value: PRICE });
    const firstExpiry = await contract.expiresAt(alice.address);

    await contract.connect(alice).renew({ value: PRICE });
    const secondExpiry = await contract.expiresAt(alice.address);

    expect(secondExpiry).to.equal(firstExpiry + BigInt(PERIOD));
  });

  it("rejects incorrect payment amount", async function () {
    const { contract, alice } = await deployFixture();

    await expect(
      contract.connect(alice).subscribe({ value: ethers.parseEther("0.005") })
    ).to.be.revertedWith("Incorrect payment amount");
  });

  it("allows active user to cancel", async function () {
    const { contract, alice } = await deployFixture();

    await contract.connect(alice).subscribe({ value: PRICE });
    await contract.connect(alice).cancel();

    expect(await contract.isActive(alice.address)).to.equal(false);
  });

  it("blocks subscribe when contract is paused", async function () {
    const { contract, owner, alice } = await deployFixture();

    await contract.connect(owner).setPaused(true);

    await expect(
      contract.connect(alice).subscribe({ value: PRICE })
    ).to.be.revertedWith("Contract paused");
  });

  it("allows owner to grant manual subscription time", async function () {
    const { contract, owner, bob } = await deployFixture();

    await expect(contract.connect(owner).grantSubscription(bob.address, BONUS_SECONDS))
      .to.emit(contract, "SubscriptionGranted")
      .withArgs(bob.address, BONUS_SECONDS, anyValue);

    expect(await contract.isActive(bob.address)).to.equal(true);
  });

  it("allows owner to withdraw and withdrawAll", async function () {
    const { contract, owner, alice, bob } = await deployFixture();

    await contract.connect(alice).subscribe({ value: PRICE });
    await contract.connect(bob).subscribe({ value: PRICE });

    await expect(contract.connect(owner).withdraw(owner.address, PRICE))
      .to.emit(contract, "Withdrawal")
      .withArgs(owner.address, PRICE);

    await expect(contract.connect(owner).withdrawAll(owner.address))
      .to.emit(contract, "Withdrawal")
      .withArgs(owner.address, PRICE);

    expect(await contract.contractBalance()).to.equal(0n);
  });

  it("blocks non-owner from admin actions", async function () {
    const { contract, bob } = await deployFixture();

    await expect(contract.connect(bob).setPlan(PRICE, PERIOD)).to.be.revertedWith("Only owner");
    await expect(contract.connect(bob).setPaused(true)).to.be.revertedWith("Only owner");
    await expect(contract.connect(bob).grantSubscription(bob.address, BONUS_SECONDS)).to.be.revertedWith("Only owner");
  });
});
