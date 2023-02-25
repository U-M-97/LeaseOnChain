const { expect } = require("chai")
const { ethers } = require("hardhat")

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("Marketplace", function() {

    let NFT
    let nft
    let deployer
    let address1
    let address2
    let Marketplace
    let marketplace
    let feePercentage = 1

    beforeEach(async function(){
        
        [deployer, address1, address2] = await ethers.getSigners()

        NFT = await ethers.getContractFactory("Asset");
        nft = await NFT.deploy()

        Marketplace = await ethers.getContractFactory("Marketplace")
        marketplace = await Marketplace.deploy(feePercentage)
    })

    describe("Deployment", function () {
        it("Check deployment", async function(){

            expect(await nft.symbol()).to.equal("AST")
            expect(await nft.name()).to.equal("Asset")

            expect(await marketplace.marketplaceAccount()).to.equal(deployer.address)
            expect(await marketplace.feePercentage()).to.equal(feePercentage)
        })
    })

    describe("Minting", function (){
        it("Check Minting", async function () {
            const minter1 = await nft.connect(address1)
            await minter1.mint("Usama")
            await minter1.mint("Komal")
            await minter1.mint("Meerub")
    
            const minter2 = await nft.connect(address2)
            await minter2.mint("Usama")
            await minter2.mint("Aymen")
            await minter2.mint("Freya")
    
            const balance = await nft.balanceOf(deployer.address)
            const tokenURI = await nft.tokenURI(1)
            expect(await nft.balanceOf(address1.address)).to.equal(3)
            const total = await nft.totalSupply()
            const ids = await nft.tokenIds()
        })
    })

    describe("Listings", function(){
        
        beforeEach(async function () {
            await nft.connect(address1).mint("Usama")
            await nft.connect(address1).setApprovalForAll(marketplace.address, true)
        })

        it("check listings", async function(){
            
            await expect(marketplace.connect(address1).listProperty(nft.address, 1, toWei(0.5))).to.emit(marketplace, "listed").withArgs(1, nft.address, 1, toWei(0.5), address1.address)

            expect(await nft.ownerOf(1)).to.equal(address1.address)
            expect(await marketplace.totalListings()).to.equal(1)

            const listing = await marketplace.listings(1)
            expect(listing.listingId).to.equal(1)
            expect(listing.nft).to.equal(nft.address)
            expect(listing.tokenId).to.equal(1)
            expect(listing.rent).to.equal(toWei(0.5))
            expect(listing.occupied).to.equal(false)
        })

        it("fail if price is 0", async function() {
            await expect(marketplace.connect(address1).listProperty(nft.address, 1, 0)).to.revertedWith("Price must be greater than 0")
        })


    })

    describe("Renting", function(){

        let price = 2
        let fee = (feePercentage/100)*price

        beforeEach(async function(){
            await nft.connect(address1).mint("Usama")
            await nft.connect(address1).setApprovalForAll(marketplace.address, true)
            await marketplace.connect(address1).listProperty(nft.address, 1, toWei(price))
        })

        it("updates agreement", async function () {
            const initialMarketplaceBalance = await deployer.getBalance()
            const initialOwnerBalance = await address1.getBalance()
            totalPrice = await marketplace.getTotalPrice(1)

            await expect(marketplace.connect(address2).escrow(1, 1675110832, 1675439187, {value: totalPrice})).to.emit(marketplace, "occupied").withArgs(1, nft.address, 1, toWei(price), marketplace.address, address2.address, true, 1675110832, 1675439187)

            const finalMarketplaceBalance = await deployer.getBalance()
            const finalOwnerBalance = await address1.getBalance()

            expect((await marketplace.listings(1)).owner).to.equal(marketplace.address)
            expect((await marketplace.listings(1)).occupied).to.equal(true)
            expect(+fromWei(finalMarketplaceBalance)).to.equal(+fee + +fromWei(initialMarketplaceBalance))
            expect(+fromWei(finalOwnerBalance)).to.equal(+price + +fromWei(initialOwnerBalance))
            expect(await nft.ownerOf(1)).to.equal(marketplace.address)
        })
    })

})