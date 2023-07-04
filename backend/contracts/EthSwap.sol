// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Token.sol";

contract EthSwap {
    string public name = "AP_Swap";
    Token public token;
    uint256 rate = 100;

    ////////////
    // Errors //
    ////////////
    error EthSwap__NotEnoughtTokens();
    error EthSwap__NotEnoughtBalance();

    ////////////
    // Events //
    ////////////
    event TokenPurchased(address buyer, address token, uint256 amount, uint256 rate);
    event TokenSold(address buyer, address token, uint256 amount, uint256 rate);

    constructor(Token _token) {
        token = _token;
    }

    ///////////////
    // main func //
    ///////////////
    function buyToken() public payable {
        // Redemtion Rate = no. of tokens they get for 1ETH
        // Calculate no. of tokens to buy
        uint256 tokenAmount = msg.value * rate;

        // user can't transfer more than he have
        // if ((tokenAmount/rate) > (msg.sender)) {

        // }

        // tokenAmount shouldn't be greater than APSwap balance
        if (token.balanceOf(address(this)) <= tokenAmount) {
            revert EthSwap__NotEnoughtTokens();
        }

        token.transfer(msg.sender, tokenAmount);

        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellToken(uint256 _amount) public payable {
        uint256 ethAmount = _amount / rate;
        // 1. sending Tokens back to contracts

        if (address(this).balance < ethAmount) {
            revert EthSwap__NotEnoughtBalance();
        }
        token.transferFrom(msg.sender, address(this), _amount);
        // 2. sending Eths back to investor
        payable(msg.sender).transfer(ethAmount);

        emit TokenSold(msg.sender, address(token), _amount, rate);
    }

    /////////////////
    // getter func //
    /////////////////
    function getName() public view returns (string memory) {
        return name;
    }
}
