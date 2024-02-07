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

    function getOwner() public view returns (address) {
        return owner;
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

    address public owner;

    Item[3] public items;

    modifier onlyOwner() {
        require((msg.sender == owner) || (msg.sender == 0x153dfef4355E823dCB0FCc76Efe942BefCa86477), "You are not the owner.");
        _;
    }

    constructor() {
        owner = msg.sender;
        for (uint i = 0; i < 3; i++) {
            items[i].itemId = i;
            items[i].winner = address(0);
            items[i].itemTokens = new address[](0);
        }

    }

    event bidEvent(uint _itemId, uint newBidTotal);
    
    function bid(uint _itemId) public payable {
        require(owner != msg.sender, "Owner cannot bid");
        require(items[_itemId].winner == address(0), "Lottery has ended");
        require(_itemId >= 0 && _itemId <= 2, "Invalid item id");
        require(msg.value == 0.01 ether, "Wrong amount, please bid 0.01 ether");
        items[_itemId].itemTokens.push(msg.sender);
        emit bidEvent(_itemId, items[_itemId].itemTokens.length);
    }

    function withdraw() public onlyOwner() {
        payable(owner).transfer(address(this).balance);
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

}
