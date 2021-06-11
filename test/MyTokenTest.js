const MyToken = artifacts.require("./MyToken.sol");
require("dotenv").config({path: "../.env"});

contract("MyToken", accounts => {
  const INITIAL_TOKENS = process.env.INITIAL_TOKENS;
  const [deployerAccount, recipientAccount] = accounts;

  beforeEach( async () => {

    this.myToken = await MyToken.new(INITIAL_TOKENS);
  })

  it("Should initialize a total supply with 1,000,000 tokens.", async () => {
    const myTokenInstance = this.myToken;
    const balance = await myTokenInstance.totalSupply();

    return assert.equal(
        balance.toNumber(),
        1000000,
        "1,000,000 was not initialized as the total supply."
    );
  });

  it("Should initialize deployerAccount with 1,000,000 tokens.", async () => {
    const myTokenInstance = this.myToken;
    const balance = await myTokenInstance.balanceOf(deployerAccount);

    return assert.equal(
        balance.toNumber(),
        INITIAL_TOKENS,
        "1,000,000 was not in the first account."
    );
  });

  it("Is possible to send tokens between accounts.", async () => {
    const amount = 100;
    const myTokenInstance = this.myToken;
    await myTokenInstance.transfer(recipientAccount, amount);
    const totalBalance = await myTokenInstance.totalSupply();
    const deployerBalance = await myTokenInstance.balanceOf(deployerAccount);
    const recipientBalance = await myTokenInstance.balanceOf(recipientAccount);

    assert.equal(
        deployerBalance.toNumber(),
        totalBalance.toNumber() - amount,
        `Deployer account was not deducted ${amount}`
    );

    return assert.equal(
        recipientBalance.toNumber(),
        amount,
        `Recipient account was not incremented ${amount}`
    );
  });

  it('Is not possible to send more tokens then available', async () => {
    const amount = 100;
    const myTokenInstance = this.myToken;
    await myTokenInstance.transfer(recipientAccount, amount);
    const deployerBalance = await myTokenInstance.balanceOf(deployerAccount);
    const preRecipientBalance = await myTokenInstance.balanceOf(recipientAccount);

    try {
      await myTokenInstance.transfer(recipientAccount, deployerBalance.toNumber() + 1)
    } catch (error) {
      return assert.include(
          error.message,
          'revert',
          'Cannot send more than the total supply of tokens.'
      );
    }

    const postRecipientBalance = await myTokenInstance.balanceOf(recipientAccount);

    return assert.equal(
        preRecipientBalance.toNumber(),
        postRecipientBalance.toNumber(),
        'Balance should not change on revert.'
    );
  });
});
