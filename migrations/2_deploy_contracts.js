var MyToken = artifacts.require("./MyToken.sol");
var MyTokenSale = artifacts.require("./MyTokenSale.sol");

module.exports = async function (deployer) {
  let INITIAL_AMOUNT = 1000000;
  let addr = await web3.eth.getAccounts();
  await deployer.deploy(MyToken, INITIAL_AMOUNT);
  await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address);
  let myTokenInstance = await MyToken.deployed();
  await myTokenInstance.transfer(MyTokenSale.address, INITIAL_AMOUNT);
};
