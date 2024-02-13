// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    
    struct Item {
        uint itemId;
        address[] itemTokens;
        address winner;
    }
    
    struct Person {
        uint personId;
        address addr;
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getItems() public view returns (Item[3] memory) {
        return items;
    }

    function getPerson() public view returns (Person memory) {
        return Person({personId: 1, addr: msg.sender});
    }

    function getItemBidNumber(uint _itemId) public view returns (uint) {
        return items[_itemId].itemTokens.length;
    }

    function getAllItemBidNumber() public view returns (uint[3] memory) {
        uint[3] memory result;
        for (uint i = 0; i < 3; i++) {
            result[i] = items[i].itemTokens.length;
        }
        return result;
    }

    address[] public owners;

    Item[3] public items;

    modifier onlyOwner() {
        bool ownerFlag = false;
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == msg.sender) {
                ownerFlag = true;
                break;
            }
        }
        require(ownerFlag, "Only owner can call this function");
        _;
    }

    constructor() {
        owners.push(msg.sender);
        for (uint i = 0; i < 3; i++) {
            items[i].itemId = i;
            items[i].winner = address(0);
            items[i].itemTokens = new address[](0);
        }

    }
    
    modifier notForOwners(){
        bool ownerFlag = false;
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == msg.sender) {
                ownerFlag = true;
                break;
            }
        }
        require(!ownerFlag, "Owner cannot bid");
        _;
    }

    event bidEvent(uint _itemId, uint newBidTotal);

    function bid(uint _itemId) public payable notForOwners() {
        require(items[_itemId].winner == address(0), "Lottery has ended");
        require(_itemId >= 0 && _itemId <= 2, "Invalid item id");
        require(msg.value == 0.01 ether, "Wrong amount, please bid 0.01 ether");
        items[_itemId].itemTokens.push(msg.sender);
        emit bidEvent(_itemId, items[_itemId].itemTokens.length);
    }

    function withdraw() public onlyOwner() {
        payable(msg.sender).transfer(address(this).balance);
    }

    event winnerEvent(uint _itemId, address winner);
    
    function DeclareWinner(uint _itemId) public onlyOwner() {
        require(items[_itemId].winner == address(0), "Winner already declared");
        if (items[_itemId].itemTokens.length == 0) {
            items[_itemId].winner = address(0);
            emit winnerEvent(_itemId, address(0));
            return;
        }
        uint randomIndex = (block.number / items[_itemId].itemTokens.length) % items[_itemId].itemTokens.length;
        items[_itemId].winner = items[_itemId].itemTokens[randomIndex];
        emit winnerEvent(_itemId, items[_itemId].winner);
    }

    function DeclareAllWinners() public onlyOwner() {
        for (uint i = 0; i < 3; i++) {
            DeclareWinner(i);
        }
    }

    function selfDestruct() public onlyOwner() {
        //https://eips.ethereum.org/EIPS/eip-4758
        selfdestruct(payable(msg.sender));
    }

    function reset() public onlyOwner() {
        for (uint i = 0; i < 3; i++) {
            items[i].winner = address(0);
            items[i].itemTokens = new address[](0);
        }
    }

    function transferOwnership(address newOwner) public onlyOwner() {
        //delete old owners
        delete owners;

        //add new owner
        owners.push(newOwner);
    }

    function addOwner(address newOwner) public onlyOwner() {
        owners.push(newOwner);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
