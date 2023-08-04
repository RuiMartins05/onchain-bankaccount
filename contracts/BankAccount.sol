// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BankAccount {

    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    modifier onlyOnwer {
        require(msg.sender == owner, "NOT THE ONWER");
        _;
    }

    function deposit() external payable onlyOnwer {}

    function checkBalance() external view onlyOnwer returns(uint256) {
        return address(this).balance;
    }

    function withdraw(uint256 amountInWei) external payable onlyOnwer {
        require(address(this).balance >= amountInWei, "NOT ENOUGH BALANCE");
        owner.transfer(amountInWei);
    }

    function withdrawAll() external payable onlyOnwer {
        owner.transfer(address(this).balance);
    }

    function sendTo(address payable _to, uint256 amountInWei) external payable onlyOnwer {
        require(address(this).balance >= amountInWei, "Insufficient balance");
        
        _to.transfer(amountInWei);
    }




}