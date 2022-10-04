# AAVE-V2-FlashLoan-Uniswap-V2-Arbitrage
 AAVE V2 FlashLoan contract + UniswapV2 Bot which searches for profitable oppurtunities, and executes when called upon.

## Technology Stack & Tools

- Solidity (FlashLoan contract itself)
- NodeJS (Truffle scripts)
- [Truffle](https://www.trufflesuite.com/docs/truffle/overview) (Development Framework)
- [Ganache-cli](https://github.com/trufflesuite/ganache) (For Local Blockchain)
- [Infura RPC](https://www.infura.com/) (For forking the Ethereum mainnet)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/), I recommend using node version 16.5.0 to avoid any potential dependency issues
- Install [Truffle](https://www.trufflesuite.com/docs/truffle/overview), In your terminal, you can check to see if you have truffle by running `truffle --version`. To install truffle run `npm i -g truffle`.
- Install [Ganache-cli](https://github.com/trufflesuite/ganache). To see if you have ganache-cli installed, in your command line type `ganache-cli --version`. To install, in your command line type `npm install ganache-cli --global`

## Setting Up
### 1. Clone/Download the Repository + Move into the working directory
`$ git clone https://github.com/benreichman/AAVE-V2-FlashLoan-Uniswap-V2-Arbitrage.git`
<br />
`$ cd AAVE-V2-FlashLoan-Uniswap-V2-Arbitrage/`

### 2. Install Dependencies:
`$ npm install`

### 3. Start Ganache CLI
To start a local ganche fork on your machine, In your terminal run:
```
ganache-cli -f https://mainnet.infura.io/v3/<YOUR_INFURA_KEY_GOES_HERE> -m <mnemonic_here> -p 7545
```

Replace Your-App-Key with your Infura Project ID located in the settings of your project. Replace Your-Mnemonic-Phrase with your own mnemonic phrase. If you don't have a mnemonic phrase to include, you can omit it.

### 4, Deploy FlashLoan Contact (V2FlashLoan.sol)
In a new terminal, type and run:
```
truffle migrate --network development
```
Make sure to copy the address of the deployed contract, as you will need it to successfully run the script.

### 5. To Run the script and start looking for profitable oppurtunities, run:
`$ truffle exec ./scripts/FlashLoanBotMainnet.js`


