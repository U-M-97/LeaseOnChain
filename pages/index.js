import Head from 'next/head'
import Listings from '../components/listings'
import { ethers } from 'ethers'
import addresses from "../contractAddresses.json"
import Asset from "../artifacts/contracts/Asset.sol/Asset.json"
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json"
import { useDispatch } from "react-redux"
import { nftState } from '../redux/contractsReducer'
import { marketplaceState } from '../redux/contractsReducer'
import {bucketName, s3} from "../utils/aws"
import { setMetadata } from '../redux/contractsReducer'
import { useRouter } from 'next/router'
import { useState, useEffect } from "react"

export async function getServerSideProps({ query }) {

  const page = query.page || 1
  const limit = page * 1
  // const start = page == 1 ? 1 : (page - 1) * 10
  const start = page

  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")
  const _marketplace = new ethers.Contract(addresses[31337].Marketplace.address, Marketplace.abi, provider)
  const _nft = new ethers.Contract(addresses[31337].NFT.address, Asset.abi, provider)
  const totalListings = await _marketplace.totalListings()
  if(totalListings.toString() != 0){
    const listings = []
    for(let i = start; i<=limit; i++){
      listings.push(await _marketplace.listings(i))
    }
    const metadata = []
    for(let i = 0; i<listings.length; i++){
      const id = await listings[i].tokenId.toString()
      const status = listings[i].occupied
      const uri = await _nft.tokenURI(id)
      const split = uri.split("/")
      const key = split[split.length - 1]
  
      const params = ({
          Bucket: bucketName,
          Key: key,
      })
      
      await s3.headObject(params).promise()
      .then((data) => {
        let object = {
          uri,
          id,
          data: data.Metadata,
          status
        }
        metadata.push(object);
      })
      .catch((err) => {
        console.log(err, err.stack);
      })
    }
  
    return {
      props: { marketplace: JSON.stringify(_marketplace), nft: JSON.stringify(_nft), metadata }
    }
  }
  else{
    return {
      props: { marketplace: JSON.stringify(_marketplace), nft: JSON.stringify(_nft) }
    }
  }
  
}

export default function Home(props) {

  const dispatch = useDispatch()
  const router = useRouter()

  const [ page, setPage ] = useState(parseInt(router.query.page) || 1)
  console.log(router.query)
  console.log(page)

  dispatch(marketplaceState(JSON.parse(props.marketplace)))
  dispatch(nftState(JSON.parse(props.nft)))
  dispatch(setMetadata(props.metadata))

  const handleNextPage = () => {
    setPage(page + 1)
  }

  const handlePrevPage = () => {
    if(page != 1){
      setPage(page - 1)
    }
   }

   useEffect(() => {
    setPage(parseInt(router.query.page))
   }, [router.query.page])

  useEffect(() => {
    router.push(`/?page=${page}`)
  }, [page])

  return (
    <div>
      <Head>
        <title>LeaseOnChain</title>
        <link rel="icon" href="/images/logo.png"/>
      </Head>
      <Listings next={handleNextPage} prev={handlePrevPage}/>
    </div>
  )
}
