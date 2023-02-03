const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners()

    const NFT = await ethers.getContractFactory("Asset")
    const nft = await NFT.deploy()
    
    const Marketplace = await ethers.getContractFactory("Marketplace")
    const marketplace = await Marketplace.deploy(1)

    console.log(marketplace.address, nft.address)
}

main().then(() => process.exit(0)).catch((err) => {
    console.log(err)
    process.exit(1)
})