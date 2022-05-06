const { expect } = require("chai");

let VestingContract;
let hardhatToken;
let totalBalance;
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
    //
    [advisor, partner, mentor, ...addrs] = await ethers.getSigners();

    VestingContract = await ethers.getContractFactory('VestingContract');

    hardhatToken = await VestingContract.deploy(advisor.address, partner.address, mentor.address);
});

describe('Token Vesting', function () {
    it('Total supply of token on the deployed address must be 100 million', async function() {
        expect(await hardhatToken.totalSupply()).to.equal(100000000);
    });

    it('Total balance in the smart contract must be 88 million', async function () {      
        totalBalance = await hardhatToken.balanceOf(hardhatToken.address);

        advisorAccount = await hardhatToken.balanceOf(advisor.address);
        advisorBalance = advisorAccount.toNumber();
        partnerAccount = await hardhatToken.balanceOf(partner.address);
        partnerBalance = partnerAccount.toNumber();
        mentorAccount = await hardhatToken.balanceOf(mentor.address);
        mentorBalance = mentorAccount.toNumber();
        expect(totalBalance).to.equal(await hardhatToken.totalSupply() - (advisorBalance + partnerBalance + mentorBalance));
    });

    it('Balance of advisor just after TGE is 5 million', async function() {
        expect(advisorBalance).to.equal(5000000);
    });
    it('Balance of partner just after TGE is 0 million', async function() {
        expect(partnerBalance).to.equal(0);
    });
    it('Balance of mentor just after TGE is 7 million', async function() {
        expect(mentorBalance).to.equal(7000000);
    });
});