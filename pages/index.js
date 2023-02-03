import Head from 'next/head'
import Image from 'next/image'
import { ethers } from 'ethers'
import { useEffect } from 'react'
import Asset from "../artifacts/contracts/Asset.sol/Asset.json"
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json"
import addresses from "../contractAddresses.json"
import { useDispatch } from "react-redux"
import { nftState } from '../redux/contractsReducer'
import { marketplaceState } from '../redux/contractsReducer'

export default function Home() {

  const dispatch = useDispatch()

  const blockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    console.log(provider)

    const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
    console.log(accounts)

    const marketplace = new ethers.Contract(addresses[31337].Marketplace.address, Marketplace.abi, provider)
    const nft = new ethers.Contract(addresses[31337].NFT.address, Asset.abi, provider)
    console.log(marketplace, nft)
    dispatch(nftState(nft))
    dispatch(marketplaceState(marketplace))
 }

 useEffect(() => {
  blockchainData()  
 }, [])

  return (
    <div>
      <Head>
        <title>LeaseOnChain</title>
        <link rel="icon" href="/images/logo.png"/>
      </Head>
    </div>
  )
}
