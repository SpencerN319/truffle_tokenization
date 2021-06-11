var MyToken = artifacts.require("./MyToken.sol");
var MyTokenSale = artifacts.require("./MyTokenSale.sol");
var Kyc = artifacts.require("./Kyc.sol");
require("dotenv").config({path: "../.env"});

module.exports = async function (deployer) {
  const INITIAL_AMOUNT = process.env.INITIAL_TOKENS;
  let addr = await web3.eth.getAccounts();
  await deployer.deploy(MyToken, INITIAL_AMOUNT);
  await deployer.deploy(Kyc);
  await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address, Kyc);
  let myTokenInstance = await MyToken.deployed();
  await myTokenInstance.transfer(MyTokenSale.address, INITIAL_AMOUNT);
};
