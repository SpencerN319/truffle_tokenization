// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CrowdSale.sol";

contract MyTokenSale is CrowdSale {

    constructor(uint256 rate, address payable wallet, IERC20 token) CrowdSale(rate, wallet, token) {}
}
