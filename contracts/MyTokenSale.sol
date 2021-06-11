// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CrowdSale.sol";
import "./Kyc.sol";

contract MyTokenSale is CrowdSale {

    Kyc kyc;

    constructor(uint256 rate, address payable wallet, IERC20 token, Kyc _kyc) CrowdSale(rate, wallet, token) {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.KycCompleted(msg.sender), "KYC not completed: purchase not allowed");
    }
}
