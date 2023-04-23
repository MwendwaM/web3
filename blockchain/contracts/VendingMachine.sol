// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract    VendingMachine{
    address public owner;
    mapping (address => uint) public donutBalances;

    constructor(){
        owner = msg.sender;
        donutBalances[address(this)] = 100;
    }

    function getVendingMachineBalance() public view returns(uint) {
        return donutBalances[address(this)];
    }

    function restock(uint amount) public {
        require(msg.sender == owner, 'only the owner can restock this machine. ');
        donutBalances[address(this)] += amount;
    }

    function purchase (uint amount) public payable {
        require(msg.value >= amount * 0.00000001 ether, "put the right amount... 2 ether per nft");
        require(donutBalances[address(this)] >= amount, "The machine has not been restocked. ");
        donutBalances[address(this)] -= amount;
    }
}

