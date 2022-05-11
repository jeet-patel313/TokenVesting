const { expect } = require("chai");
const { ethers } = require('hardhat');
const { BigNumber } = require('ethers');

let VestingContract;
let hardhatToken;
let totalBalance;
let owner;
let advisor;
let partner;
let mentor;
let addrs;
let advisorAccount;
let advisorBalance;
let partnerAccount;
let partnerBalance;
let mentorAccount;
let mentorBalance;

beforeEach(async function() {
    [owner, advisor, partner, mentor, ...addrs] = await ethers.getSigners();

    VestingContract = await ethers.getContractFactory('VestingContract');

    hardhatToken = await VestingContract.deploy(advisor.address, partner.address, mentor.address);
});

describe('Token Vesting contract deployed', function () {
    it('total supply of token must be 100 million', async function() {
        expect(await hardhatToken.totalSupply()).to.equal(BigNumber.from(100000000).mul(BigNumber.from(10).pow(18)));
    });    
});

describe('Cliff not expired', function () {
    // total tokens in the owner account is still 100 million
    it('total tokens in the owner account is 100 million', async function() {
        expect(await hardhatToken.totalSupply()).to.equal(BigNumber.from(100000000).mul(BigNumber.from(10).pow(18)));
    });

    // advisor balance = 0
    it('advisor account has 0 tokens since cliff period has not expired', async function() {
        await expect(hardhatToken.connect(advisor).withdrawToken()).to.be.revertedWith('Cliff not expired');
    })
});

describe('Cliff period terminated', function () {

    // single month
    it('advisor balance 1 month from cliff period termination is 227,272.727 tokens', async function() {
        const threeMonthsLater = 92 * 24 * 60 * 60;

        const blockNumBefore = await ethers.provider.getBlockNumber();
        const blockBefore = await ethers.provider.getBlock(blockNumBefore);
        const timestampBefore = blockBefore.timestamp;

        await ethers.provider.send('evm_increaseTime', [threeMonthsLater]);
        await ethers.provider.send('evm_mine');

        const blockNumAfter = await ethers.provider.getBlockNumber();
        const blockAfter = await ethers.provider.getBlock(blockNumAfter);
        const timestampAfter = blockAfter.timestamp;
      
        await hardhatToken.connect(advisor).withdrawToken();
        let testingVar = await hardhatToken.balanceOf(advisor.address);
        expect(testingVar.toString()).to.equal('227272727272727272727272');
    });
});

describe('22 months linear vesting completed', function () {
    it('total tokens with the advisor should be 5 million ', async function () {      
        const vestingPeriodCompleted = 721 * 24 * 60 * 60;

        const blockNumBefore = await ethers.provider.getBlockNumber();
        const blockBefore = await ethers.provider.getBlock(blockNumBefore);
        const timestampBefore = blockBefore.timestamp;

        await ethers.provider.send('evm_increaseTime', [vestingPeriodCompleted]);
        await ethers.provider.send('evm_mine');

        const blockNumAfter = await ethers.provider.getBlockNumber();
        const blockAfter = await ethers.provider.getBlock(blockNumAfter);
        const timestampAfter = blockAfter.timestamp;
      
        await hardhatToken.connect(advisor).withdrawToken();
        let testingVar = await hardhatToken.balanceOf(advisor.address);
        expect(testingVar.toString()).to.equal('4999999999999999999999984');        
    });
});
