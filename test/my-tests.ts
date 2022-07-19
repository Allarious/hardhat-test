import { expect } from 'chai';
import hre from 'hardhat';
import { Contract } from "ethers";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Lock", function () {

    async function deployOneYearLockFixture(){
        const lockedAmount = 1_000_000_000;
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

        //Deploy the contract where funds can be withdrawn
        //One year in the future
        const Lock = await hre.ethers.getContractFactory("Lock");
        const lock = await Lock.deploy(unlockTime, { value: lockedAmount })

        return {lock, unlockTime, lockedAmount}
    }

    it("Should set the right unlockTime", async function() {
        const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

        expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it("Should revert when it is called too soon", async function(){
        const { lock } = await loadFixture(deployOneYearLockFixture);

        await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
    })

    it("should transfer the funds to the owner", async function() {
        const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

        await time.increaseTo(unlockTime);

        await lock.withdraw();
    });

    it("should revert with the right error when called from another account", async function(){
        const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

        const [owner, anotherAccount] = await hre.ethers.getSigners();

        await time.increaseTo(unlockTime);

        await expect(lock.connect(anotherAccount).withdraw()).to.be.revertedWith("You aren't the owner")
    })
});