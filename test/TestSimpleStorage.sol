// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MyToken.sol";

contract TestSimpleStorage {

  function testInitialBalanceUsingDeployedContract() public {
    MyToken myToken = MyToken(DeployedAddresses.MyToken());

    uint expected = 1000000;

    Assert.equal(myToken.totalSupply(), expected, "It should initialize with 1,000,000 tokens");
  }
}
