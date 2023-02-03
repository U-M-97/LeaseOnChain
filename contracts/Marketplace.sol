// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {

    address payable immutable public marketplaceAccount;
    uint immutable public feePercentage;
    uint public totalListings;

    struct Listing {
        uint listingId;
        IERC721 nft;
        uint tokenId;
        uint rent; 
        address payable owner;
        bool occupied;
        uint start;
        uint end;
    }

    mapping (uint => Listing) public listings;
    

    event listed(
        uint listingId,
        address indexed nft,
        uint tokenId,
        uint rent, 
        address indexed owner
    );

    event occupied(
        uint listingId,
        address indexed nft,
        uint tokenId,
        uint rent, 
        address indexed owner,
        address indexed tenant, 
        bool occupied,
        uint start, 
        uint end
    );

    constructor (uint _feePercentage) {
        feePercentage = _feePercentage;
        marketplaceAccount = payable(msg.sender);
    }

    function listProperty(IERC721 _nft, uint _tokenId, uint _rent) external nonReentrant {
        require(_rent > 0, "Rent must be greater than zero");
        require(_nft.ownerOf(_tokenId) == msg.sender, "You are not the owner of NFT");
        totalListings++; 
        listings[totalListings] = Listing (totalListings, _nft, _tokenId, _rent, payable(msg.sender), false, 0, 0);
        emit listed(totalListings, address(_nft), _tokenId, _rent, msg.sender);
    }

    function escrow(uint _listingId, uint _start, uint _end) public payable nonReentrant  {
        uint totalAmount = getTotalPrice(_listingId);
        Listing storage item = listings[_listingId];
        require(msg.value >= totalAmount, "Not enough balance");
        require(item.occupied != true, "Already Occupied");
        require(_listingId > 0 && _listingId <= totalListings, "Listing doesn't exist");
        item.owner.transfer(item.rent);
        marketplaceAccount.transfer(totalAmount - item.rent);
        item.occupied = true;
        item.start = _start;
        item.end = _end;
        listings[_listingId].nft.transferFrom(item.owner, address(this), listings[_listingId].tokenId);
        item.owner = payable(address(this));
        emit occupied(_listingId, address(item.nft), item.tokenId, item.rent, address(item.owner), address(msg.sender), true, _start, _end);
    }

    function getTotalPrice(uint _listingId) public view returns(uint){
        return ((listings[_listingId].rent * (100 + feePercentage)) / 100);
    }
    
}
