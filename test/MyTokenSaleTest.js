const MyTokenSale = artifacts.require("./MyTokenSale.sol");
const MyToken = artifacts.require("./MyToken.sol");
const Kyc = artifacts.require('./Kyc.sol');
require("dotenv").config({path: "../.env"});

contract("MyTokenSale Tests", accounts => {
    const [deployerAccount, recipientAccount] = accounts;

    it('Should not have any tokens in my deployerAccount', async () => {
        let myTokenInstance = await MyToken.deployed();
        const deployerBalance = await myTokenInstance.balanceOf(deployerAccount);

        return assert.equal(
            deployerBalance.toNumber(),
            0,
            "Deployer account was not zero."
        );
    });

    it('Should contain all tokens in TokenSale Contract by default', async () => {
        let myTokenInstance = await MyToken.deployed();
        const myTokenSaleBalance = await myTokenInstance.balanceOf(MyTokenSale.address);
        const totalSupply = await myTokenInstance.totalSupply();

        return assert.equal(
            myTokenSaleBalance.toNumber(),
            totalSupply.toNumber(),
            "MyTokenSale Contract was not initialized with all tokens."
        );
    });

    it('Should contain all tokens in TokenSale Contract by default', async () => {
        const myTokenInstance = await MyToken.deployed();
        const myTokenSaleInstance = await MyTokenSale.deployed();
        const preMyTokenSaleBalance = await myTokenInstance.balanceOf(MyTokenSale.address);
        const preDeployerAccountBalance = await myTokenInstance.balanceOf(deployerAccount);
        await myTokenSaleInstance.sendTransaction({from: deployerAccount, value: web3.utils.toWei("1", "wei")});
        const postMyTokenSaleBalance = await myTokenInstance.balanceOf(MyTokenSale.address);
        const postDeployerAccountBalance = await myTokenInstance.balanceOf(deployerAccount);

        assert.equal(
            postDeployerAccountBalance.toNumber(),
            preDeployerAccountBalance.toNumber() + 1,
            "Deployer account did not receive 1 token."
        )

        return assert.equal(
            postMyTokenSaleBalance.toNumber(),
            preMyTokenSaleBalance.toNumber() - 1,
            "MyTokenSale was not decremented 1 token."
        );
    });
});
