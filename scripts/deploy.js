async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const VestingContract = await ethers.getContractFactory("VestingContract");
    
    const hardhatToken = await VestingContract.deploy(
        '0x69b415BCF3F562bed1eb743C4ca30D479B01D82B', 
        '0x6fB067e8b975a0aa301a194d583F3cf175C8e65e', 
        '0x217bD156ed0f9A527cF2f64b70978dF395C4dA5B'
    );

    console.log("Token address:", hardhatToken.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });