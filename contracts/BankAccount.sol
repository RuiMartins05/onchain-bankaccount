// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BankAccount {

    address payable private owner;

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

    function withdraw(uint256 amountInEth) external payable onlyOnwer {
        uint256 amountInWei = amountInEth * 1 ether;
        require(address(this).balance >= amountInWei, "NOT ENOUGH BALANCE");
        owner.transfer(amountInWei);
    }

    function withdrawAll() external payable onlyOnwer {
        owner.transfer(address(this).balance);
    }

    function sendTo(address payable _to, uint256 amountInEth) external payable onlyOnwer {
        uint256 amountInWei = amountInEth * 1 ether;
        require(address(this).balance >= amountInWei, "Insufficient balance");
        
        _to.transfer(amountInWei);
    }




}