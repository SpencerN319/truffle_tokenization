require("dotenv").config({path: "../.env"});
var MyToken = artifacts.require("./MyToken.sol");
var MyTokenSale = artifacts.require("./MyTokenSale.sol");
var Kyc = artifacts.require("./Kyc.sol");

module.exports = async function (deployer) {
  const INITIAL_AMOUNT = process.env.INITIAL_TOKENS;
  const [deployerAccount] = await web3.eth.getAccounts();
  await deployer.deploy(MyToken, INITIAL_AMOUNT);
  await deployer.deploy(Kyc);
  await deployer.deploy(MyTokenSale, 1, deployerAccount, MyToken.address, Kyc.address);
  const myTokenInstance = await MyToken.deployed();
  await myTokenInstance.transfer(MyTokenSale.address, INITIAL_AMOUNT);
  const kycInstance = await Kyc.deployed();
  await kycInstance.setKycCompleted(deployerAccount, {from: deployerAccount});
};
