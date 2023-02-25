import ImageIcon from '@mui/icons-material/Image';
import { useEffect, useState } from "react"
import Image from 'next/image';
import { DatePicker, ConfigProvider, Alert, Spin, Space  } from 'antd';

// import { NFTStorage, File } from 'nft.storage'
import dayjs from "dayjs"
import { useSelector } from 'react-redux';
import { ethers } from 'ethers'
import axios from 'axios';

const Mint = () => {

  const [ fileContent, setFileContent ] = useState()
  const [ inputs, setInputs ] = useState({
    image: "",
    title: "",
    description: "",
    price: "",
    checkIn: "",
    checkOut: ""
  })
  const [ error, setError ] = useState(false)
  const nftStorageKey = process.env.nftStorageKey
  const nft = useSelector((state) => state.contracts.signedNFT)
  const marketplace = useSelector((state) => state.contracts.signedMarketplace)
  const [ loading, setLoading ] = useState(false)

  const handleImage = async (e) => {

    if(e.target.files.length !== 0){
      const reader = new FileReader();
      console.log(reader)
      reader.onload = function(e) {
        setFileContent(reader.result)
      };
      
      reader.readAsDataURL(e.target.files[0]);
    }

    setInputs((input) => ({
      ...input, image: e.target.files[0]
    }))
  }

  const handleInputs = (e) => {
    setInputs((input) => ({
      ...input, [e.target.name]: e.target.value
    }))
  }

  const mintNFT = async () => {
    
    if(!inputs.image || !inputs.title || !inputs.description || !inputs.price ){
      setError(true)
    }else{
      setError(false)
      // const nftStorage = await new NFTStorage({token: nftStorageKey})

      // const { ipnft } = await nftStorage.store({
      //   image: new File([ fileContent ], `${inputs.image.name}`, { type: `${inputs.image.type}` }),
      //   name: inputs.title,
      //   description: inputs.description,
      //   price: inputs.price,
      //   checkIn: inputs.checkIn,
      //   checkOut: inputs.checkOut
      // })  
      // const uri = `https://ipfs.io/ipfs/${ipnft}/metadata.json`

      setLoading(true)
      const url = await axios.get("http://localhost:3000/api/url", {params: inputs})
      const upload = await axios.put(url.data, inputs.image, {
        headers: {
          'x-amz-meta-title': inputs.title,
          'x-amz-meta-description': inputs.description,
          'x-amz-meta-price': inputs.price
        }
      })
      const uri = upload.config.url.split('?')[0]      
      const mint = await(await nft.mint(uri)).wait()
      const id = await nft.tokenIds()
      await(await nft.setApprovalForAll(marketplace.address, true)).wait()
      const rent = ethers.utils.parseEther(inputs.price.toString())
      await(await marketplace.listProperty(nft.address, id, rent))
      setLoading(false)
    }
  }
  console.log(inputs)

  return (
    <div className="font-main bg-secondary flex justify-center">
        <div className="w-standard flex items-center justify-center flex-col mt-10 text-lblue">
          <div className='w-mintContainer'>
            <h1 className="text-5xl">List Your Property</h1>
            <label for="image" className="relative mt-10 h-60 w-2/3 border-4 rounded-lg border-dashed border-lblue hover:cursor-pointer flex items-center justify-center hover:bg-transparentBlack">
              {fileContent && <Image src={fileContent} layout="fill" objectFit='cover'/>}
              {!fileContent && <ImageIcon className='scale-imageIcon'/>}
              <input type="file" id='image' className='hidden' onChange={handleImage}/>
            </label>
            <div className='flex flex-col mt-10'>
              <label className='text-2xl'>Title</label>
              <input name='title' className='w-full bg-secondary border-2 border-lblue outline-none px-3 py-3 rounded-lg mt-5 hover:border-white focus:border-white duration-300' onChange={handleInputs}/>
              <label className='text-2xl mt-5'>Description</label>
              <textarea name='description' className='w-full h-40 bg-secondary border-2 border-lblue outline-none px-3 py-3 rounded-lg mt-5 hover:border-white focus:border-white duration-300' onChange={handleInputs}/>
              <label className='text-2xl mt-5'>Price</label>
              <input name="price" placeholder='ETH' type="number" className='w-full bg-secondary border-2 border-lblue outline-none px-3 py-3 rounded-lg mt-5 hover:border-white focus:border-white duration-300' onChange={handleInputs}/>
            </div>
            { error && <Alert message="Please fill the required Fields" type="error" className=' text-secondary mt-10'/>}
            <div className='w-full flex items-center justify-center mb-10 h-20 b mt-5'>
              { loading == true ?
                <Spin tip="Minting" size="large">
                  <div className="rounded-md p-12" />
                </Spin> 
                :
                <button className='bg-lblue text-secondary w-2/4 py-2 rounded-lg' onClick={mintNFT}>Mint</button>
              }
            </div>
          </div>
        </div>
    </div>
  )
}

export default Mint