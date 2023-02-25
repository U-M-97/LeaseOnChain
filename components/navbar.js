import Image from "next/image"
import Link from "next/link"
import { ethers } from 'ethers'
import Asset from "../artifacts/contracts/Asset.sol/Asset.json"
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json"
import addresses from "../contractAddresses.json"
import { useDispatch } from "react-redux"
import { signedNFTState } from "../redux/contractsReducer"
import { signedMarketplaceState } from "../redux/contractsReducer"
import { useState } from "react"
import { Button, Space, Avatar, Menu, ConfigProvider } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

const Navbar = () => {

  const dispatch = useDispatch()
  const [ connected, setConnected ] = useState(false)
  const [ address, setAddress ] = useState()

  const items = [
    {
      label: address,
      children: [
        {
          label: (
            <Link href="" className="text-lg">Profile</Link>
          ),
          icon: <UserOutlined className="scale-150 mr-2" />,
        },
        {
          label: <label className="text-lg">Logout</label>,
          icon: <LogoutOutlined className="scale-150 mr-2" />,
        }
      ]
    },
  ]

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const accountAddress = await window.ethereum.request({method: "eth_requestAccounts"})
    let slicedAddress = accountAddress[0].slice(0,5)+ '...' + accountAddress[0].slice(38,42)
    setAddress(slicedAddress)
    const marketplace = new ethers.Contract(addresses[31337].Marketplace.address, Marketplace.abi, signer)
    const nft = new ethers.Contract(addresses[31337].NFT.address, Asset.abi, signer)
    dispatch(signedNFTState(nft))
    dispatch(signedMarketplaceState(marketplace))
    if(nft && marketplace){
      setConnected(true)
    }
 }

  return (
    <nav className="bg-secondary flex font-main items-center justify-center">
      <div className="w-standard py-3 px-10 flex">
        <div className="flex-1">
          <div className="relative h-14 w-60 rounded-full">
            <Image src="/images/logo.png" objectFit="contain" layout="fill" className="rounded-full"/>
          </div>
        </div>
        <div className=" flex-1 text-xl flex items-center justify-center text-lblue">
          <Link href="/?page=1" className="mx-5 hover:text-white duration-300">Home</Link>
          <Link href="/mint"  className="mx-5 hover:text-white duration-300">Mint</Link>
        </div>
        <div className=" flex-1 flex items-center justify-end">
          {!connected && <button className="text-xl bg-lblue px-8 py-2 rounded-full hover:bg-white duration-300" onClick={connectWallet}>Connect Wallet</button>}
          {connected && 
           <ConfigProvider
           theme={{
             token: {
              // colorPrimary: '#011526',
              // colorBgBase: "#05F2DB",
              // colorText: "#011526",
              // colorTextBase: "#011526",
              // colorPrimaryHover: "#011526"
             },
            }}
          >
            <Menu className="rounded-md flex items-center justify-center mr-10 text-xl" items={items} mode="horizontal" selectable={false}/>    
          </ConfigProvider>
         }
        </div>
      </div>  
    </nav>
  )
}

export default Navbar