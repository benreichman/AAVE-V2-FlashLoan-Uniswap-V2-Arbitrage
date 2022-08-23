const Web3 = require('web3')
const { ethers, BigNumber } = require('ethers')
const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const pk = fs.readFileSync("../.secret").toString().trim();
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
const signer = new ethers.Wallet(pk, provider)
const { default: axios } = require('axios');
const { URLSearchParams } = require('url');
const IERC20 = require("@openzeppelin/contracts/build/contracts/ERC20.json");

module.exports = async function (callback) {
    const providersList = await provider.listAccounts();
    // console.log(providersList)
    var tokensArray = null;
    const tokensListRaw = await axios.get('https://cdn.furucombo.app/furucombo.tokenlist.json').then(result => {
        tokensArray = result.data.tokens;
    })
    const amt = 1;
    var flashAsset = tokensArray.filter(obj => {
        return obj.symbol === "WETH";
    })
    const flashAssetContract = new ethers.Contract(flashAsset[0].address, IERC20.abi, signer);
    var oneinch = tokensArray.filter(obj => {
        return obj.name === "1inch Exchange";
    })
    var delta = tokensArray.filter(obj => {
        return obj.name === "DELTA";
    })
    // var ampl = tokensArray.filter(obj => {
    //     return obj.symbol === "AMPL";
    // })
    const amtToSwap = ethers.utils.parseUnits(amt.toString(), flashAsset[0].decimals)
    // console.log(amtToSwap.toString())
    await onetotwo();
    // await getSpecificRoute(uni[0],ampl[0]);
    var swapParams = {
        fromTokenAddress: null, // 1INCH
        toTokenAddress: null, // DAI
        amount: null,
        fromAddress: providersList[0],
        slippage: 1,
        disableEstimate: true,
        allowPartialFill: false,
    };

    async function getQuote(_from, _to, _amt) {
        try {
            const res = await axios.get('https://api.1inch.io/v4.0/1/quote?fromTokenAddress=' + _from + '&toTokenAddress=' + _to + '&amount=' + _amt);
            return res.data;
        } catch (error) {
            if (error.response.data.description == "insufficient liquidity") {
                // console.log('insufficient liquidity');
            }
        }
    }
    async function swap(_swapParams) {
        const res = await axios.get('https://api.1inch.io/v4.0/1/swap?' + 'fromTokenAddress=', _swapParams.fromTokenAddress + '&toTokenAddress=', _swapParams.toTokenAddress + '&amount=', _swapParams.amount + '&fromAddress=', _swapParams.fromAddress + '&slippage=', _swapParams.slippage + '&disableEstimate=', _swapParams.disableEstimate + '&allowPartialFill=', _swapParams.allowPartialFill
        )
        console.log(res)
    }

    async function onetotwo() {
        // const delay = ms => new Promise(res => setTimeout(res, ms));
        for (var ix = 0; ix < parseInt(tokensArray.length); ix++) {
            console.log('Token 2 Start Token Name: ', tokensArray[ix])
            try {
                const res = await getQuote(flashAsset[0].address, tokensArray[ix].address, amtToSwap.toString())

                await twotothree(tokensArray[ix], res, ix)
                console.log(res)

            } catch (error) {
                console.log(error)
            }
            if (ix == parseInt(tokensArray.length) - 1) {
                console.log('Full Length Ran!')
            }
        }
    }

    async function twotothree(_token2, _resData, _token2Index) {
        console.log(_resData.toTokenAmount)
        for (var iy = 0; iy < parseInt(tokensArray.length); iy++) {
            if (tokensArray[iy].address != flashAsset[0].address && tokensArray[iy].address != _token2.address) {
                const res = await getQuote(_token2.address, tokensArray[iy].address, _resData.toTokenAmount);
                await threetoone(tokensArray[iy], res, iy, _token2);
            }
        }
    }

    async function threetoone(_token3, _resData, _token3Index, _token2) {
        try {
            const res = await getQuote(_token3.address, flashAsset[0].address, _resData.toTokenAmount);
            const returnedAmountParsed = parseFloat(ethers.utils.formatUnits(res.toTokenAmount, flashAsset[0].decimals));
            if (returnedAmountParsed > amt) {
                console.log('Profitable pair discovered')
                console.log(flashAsset[0].name + " -> " + _token2.name + " -> " + _token3.name)
                console.log('Returned Amount: ', parseFloat(ethers.utils.formatUnits(res.toTokenAmount, flashAsset[0].decimals)));
                await buildTriSwap(flashAsset[0], _token2, _token3)
            }
        } catch (error) {
        }
    }
    function apiRequestUrl(methodName, queryParams) {
        const apiBaseUrl = 'https://api.1inch.io/v4.0/' + 1;
        return apiBaseUrl + methodName + '?' + (new URLSearchParams(queryParams)).toString();
    }

    async function buildTxForSwap(_swapParams) {
        const url = apiRequestUrl('/swap', _swapParams);
        const data = await axios.get(url)
        return data;
    }

    // await swapExact(flashAsset[0],oneinch[0],delta[0])

    async function buildTriSwap(_token1, _token2, _token3) {
        // console.log('tri swap');
        // console.log(_token1)
        // console.log(_token2)
        // console.log(_token3)
        const res1 = await getQuote(_token1.address, _token2.address, amtToSwap.toString())
        var swapParams = {
            fromTokenAddress: res1.fromToken.address, // 1INCH
            toTokenAddress: res1.toToken.address, // DAI
            amount: amtToSwap.toString(),
            fromAddress: providersList[0],
            slippage: 1,
            disableEstimate: true,
            allowPartialFill: false,
        }
        // console.log(swapParams)
        try {
            const swapData = await buildTxForSwap(swapParams)
            console.log(swapData.data.tx)
            
            callback()
        } catch (error) {
            console.log('SWAP ERROR')
            callback()
            
        }



        // console.log(res1)
        // console.log(res1.toTokenAmount)
        // const oneinchAllowanceAddress = '0x1111111254fb6c44bac0bed2854e76f90643097d';
        // const token1Contract = new ethers.Contract("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", IERC20.abi, signer);
        // const approval1 = token1Contract.approve(oneinchAllowanceAddress, ethers.utils.formatUnits(amt.toString(), 18))
        // await approval1.wait();
        // // const allowance
        // console.log('Allowance: ')

        // try {
        //     const datahere = await buildTxForSwap(swapParams)
        //     console.log(datahere.data.tx)
        //     // callback()
        // } catch (error) {
        //     console.log(error)
        // }
    }
}