const Web3 = require('web3')
const { ethers, BigNumber } = require('ethers')
const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const pk = fs.readFileSync("../.secret").toString().trim();
const provider = new ethers.providers.JsonRpcProvider("https://kovan.infura.io/v3/5bc85b325dcf4bfe877b2254e9d7addf");
const signer = new ethers.Wallet(pk,provider)
const uniswapRouterV2Rinkeby = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const constantshere = require('../abi/constants')
// const abi = constantshere.uniabi;
const uniswapRouterV2RinkebyABI = constantshere.uniabi;
const uniswapRouterV2 = new ethers.Contract(uniswapRouterV2Rinkeby, uniswapRouterV2RinkebyABI, signer);


module.exports = async function (callback) {
    const signerArray = await provider.listAccounts();
    const check = await uniswapRouterV2.factory();
    const WETH = await uniswapRouterV2.WETH();
    const flashLoanContractAddress = "0x18Bf2e3D20D75B4177786086743036c9931762f1";
    const flashLoanContractABI = [
        {
            "inputs": [
                {
                    "internalType": "address[]",
                    "name": "assets",
                    "type": "address[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "amounts",
                    "type": "uint256[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "premiums",
                    "type": "uint256[]"
                },
                {
                    "internalType": "address",
                    "name": "initiator",
                    "type": "address"
                },
                {
                    "internalType": "bytes",
                    "name": "params",
                    "type": "bytes"
                }
            ],
            "name": "executeOperation",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_address1",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_address2",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_address3",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_flashAmount",
                    "type": "uint256"
                }
            ],
            "name": "myFlashLoanCall",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "contract ILendingPoolAddressesProvider",
                    "name": "_addressProvider",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "inputs": [],
            "name": "ADDRESSES_PROVIDER",
            "outputs": [
                {
                    "internalType": "contract ILendingPoolAddressesProvider",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "addy1",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "addy2",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "addy3",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "LENDING_POOL",
            "outputs": [
                {
                    "internalType": "contract ILendingPool",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "newAmount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "newAmount2",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const flashLoanContract = new ethers.Contract(flashLoanContractAddress, flashLoanContractABI, signer);

    const tokensList = ["0x075A36BA8846C6B6F53644fDd3bf17E5151789DC", "0xB597cd8D3217ea6477232F9217fa70837ff667Af", "0x2d12186Fbb9f9a8C28B3FfdD4c42920f8539D738", "0x7FDb81B0b8a010dd4FFc57C3fecbf145BA8Bd947", "0xAD5ce863aE3E4E9394Ab43d4ba0D80f419F61789", "0x7FDb81B0b8a010dd4FFc57C3fecbf145BA8Bd947"]
    const token2 = "0x075A36BA8846C6B6F53644fDd3bf17E5151789DC";
    const token2Decimals = "0x075A36BA8846C6B6F53644fDd3bf17E5151789DC";
    const srcTokenDecimals = 18;
    const amt = 10;
    const amtToSwap = ethers.utils.parseUnits(amt.toString(), srcTokenDecimals)
    async function main() {
        for (var ix = 0; ix < tokensList.length; ix++) {
            await strategy1(tokensList[ix]);
        }
        callback();
    }
    async function strategy1(_token2) {
        const getAmountsOut = await uniswapRouterV2.getAmountsOut(amtToSwap, ["0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD", _token2])
        console.log('Swap 1 Received: ', ethers.utils.formatEther(getAmountsOut[1].toString()));
        const getAmountsOut2 = await uniswapRouterV2.getAmountsOut(getAmountsOut[1], [_token2, WETH])
        console.log('Swap 2 Received: ', ethers.utils.formatEther(getAmountsOut2[1].toString()));
        const getAmountsOut3 = await uniswapRouterV2.getAmountsOut(getAmountsOut2[1], [WETH, "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD"])
        console.log('Swap 3 Received: ', ethers.utils.formatEther(getAmountsOut3[1].toString()));
        //TODO: Include gas prices in profitable equation.
        const profitable = amt < ethers.utils.formatEther(getAmountsOut3[1].toString());
        console.log("Profitable?: ", profitable);
        if (profitable) {
            await swapFunc("0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD", _token2, WETH, amtToSwap)
        }
    }
    async function swapFunc(_arg1, _arg2, _arg3, _arg4) {
        console.log('running swap func......')
        try {
            const tx = await flashLoanContract.myFlashLoanCall(_arg1, _arg2, _arg3, _arg4)
            console.log(tx)
            await tx.wait()
            console.log('Flashed Successfully!')
            console.log(tx.hash);
            callback()
            
        } catch (error) {
            console.log(error)
        }
    }
    main()

}