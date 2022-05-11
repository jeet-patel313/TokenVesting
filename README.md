## Token Vesting Smart Contract

#### Create a Token Vesting Contract with 3 roles (Advisor, Partners, Mentors) with 5% TGE for Advisors, 10 % TGE for Partners and 7% TGE for Mentors with 2 months cliff and 22 months linear vesting for all roles

## How To Use

~ Fire up your default terminal and type the following commands.

```
git clone https://github.com/jeet-patel313/TokenVesting.git
```

```
cd TokenVesting
```

```
npm install
```

## Crucial Step

```
create a .env in your root directory and add your ALCHEMY_API_KEY and ROPSTEN_PRIVATE_KEY
```

-Get Your API Key

- [Infura](https://infura.io/)
- [Alchemy](https://alchemy.com/?r=TM0MzU2NTQyNDg1M)

## NPM Packages

- [Openzeppelin](https://www.npmjs.com/package/@openzeppelin/contracts)
- [Hardhat-Ethers](https://www.npmjs.com/package/hardhat-ethers)
- [Chai](https://www.npmjs.com/package/chai)
- [Ethers](https://www.npmjs.com/package/ethers)
- [Ethereum-Waffle](https://www.npmjs.com/package/ethereum-waffle)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Hardhat-Etherscan](https://www.npmjs.com/package/hardhat-etherscan)

## Tech Stack

- [Node](https://nodejs.org/en/)
- [Hardhat](https://hardhat.org/)
- [Solidity](https://docs.soliditylang.org/)
- [Openzeppelin](https://openzeppelin.com/)

## Run Locally

Setting up your environment

```bash
  npm install
```

Compile TokenVesting Contract

```bash
  npx hardhat compile
```

Run Tests

```bash
  npx hardhat test
```

Deploy on Ropsten

```bash
  npx hardhat run scripts/deploy.js --network ropsten
```

Verify Contract

```bash
npx hardhat verify --network ropsten <YOUR_CONTRACT_ADDRESS>
```

Help

```bash
  npx hardhat help
```

## Check on Ropsten Explorer

- [coming soon]
