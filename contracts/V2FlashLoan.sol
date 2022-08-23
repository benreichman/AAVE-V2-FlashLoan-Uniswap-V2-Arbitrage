// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {FlashLoanReceiverBase} from "./FlashLoanReceiverBase.sol";
import {ILendingPool, ILendingPoolAddressesProvider, IERC20} from "./Interfaces.sol";
import {SafeMath} from "./Libraries.sol";

interface UniswapV2Router02 {
    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function WETH() external pure returns (address);

    function getAmountsOut(uint256 amountIn, address[] memory path)
        external
        view
        returns (uint256[] memory amounts);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

contract V2FlashLoan is FlashLoanReceiverBase {
    using SafeMath for uint256;
    UniswapV2Router02 uniswap;
    address private contractAddy;
    address public addy1;
    address public addy2;
    address public addy3;
    uint256 public newAmount;
    uint256 public newAmount2;
    constructor(ILendingPoolAddressesProvider _addressProvider)
        public
        FlashLoanReceiverBase(_addressProvider)
    {
        uniswap = UniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
        contractAddy = address(this);
    }
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        (
            address firstToken,
            address secondToken,
            address thirdToken,
            uint256 flashAmount
        ) = abi.decode(params, (address, address, address, uint256));
        addy1 = firstToken;
        addy2 = secondToken;
        addy3 = thirdToken;
        swap(firstToken, secondToken ,flashAmount, 1);
        swap(secondToken, thirdToken , newAmount, 1);
        swap(thirdToken, firstToken , newAmount, 1);
        // Approve the LendingPool contract allowance to *pull* the owed amount
        for (uint256 i = 0; i < assets.length; i++) {
            uint256 amountOwing = amounts[i].add(premiums[i]);
            IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
        }
        return true;
    }
    function myFlashLoanCall(
        address _address1,
        address _address2,
        address _address3,
        uint256 _flashAmount
    ) public {
        address receiverAddress = address(this);
        address[] memory assets = new address[](1);
        assets[0] = address(0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD); // Kovan DAI
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = _flashAmount;
        // 0 = no debt, 1 = stable, 2 = variable
        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;
        address onBehalfOf = address(this);
        bytes memory params = abi.encode(
            _address1,
            _address2,
            _address3,
            _flashAmount
        );
        uint16 referralCode = 0;
        LENDING_POOL.flashLoan(
            receiverAddress,
            assets,
            amounts,
            modes,
            onBehalfOf,
            params,
            referralCode
        );
    }
    function swap(
        address srcTokenAddress,
        address destTokenAddress,
        uint256 amountIn,
        uint256 swapNum
    ) internal returns (uint256) {
        IERC20(srcTokenAddress).approve(address(uniswap), amountIn);
        address[] memory path = new address[](2);
        path[0] = srcTokenAddress;
        path[1] = destTokenAddress;
        uint256[] memory amountouthere = uniswap.getAmountsOut(amountIn, path);
        uint256[] memory amtReturned = uniswap.swapExactTokensForTokens(
            amountIn,
            amountouthere[1],
            path,
            contractAddy,
            (block.timestamp + 300)
        ); 
        newAmount = amtReturned[1];
    }
    fallback() external payable {}
}
