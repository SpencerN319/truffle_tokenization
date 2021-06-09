const MyToken = artifacts.require("./MyToken.sol");

contract("MyToken", async accounts => {
  it("Should initialize account[0] with 1,000,000 tokens.", async () => {
    const myTokenInstance = await MyToken.deployed();
    const balance = await myTokenInstance.totalSupply();

    assert.equal(
        balance.valueOf(),
        1000000,
        "1,000,000 was not in the first account."
    );
  });
});
