const V2FlashLoan = artifacts.require("V2FlashLoan");

module.exports = function (deployer) {
  deployer.deploy(V2FlashLoan, '0x88757f2f99175387ab4c6a4b3067c77a695b0349');
};
