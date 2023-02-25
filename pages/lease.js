import { useSelector } from "react-redux"
const { RangePicker } = DatePicker;
import { DatePicker, ConfigProvider  } from 'antd';
import { useState, useEffect } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { ethers } from 'ethers'

const Lease = () => {

    const listing = useSelector((state) => state.contracts.selectedProperty)
    const signedMarketplace = useSelector((state) => state.contracts.signedMarketplace)
    const [ range, setRange ] = useState()
    const [ inputs, setInputs ] = useState({
        checkIn: "",
        checkOut: ""
    })

    const handleDates = () => {
        setInputs((input) => ({
          ...input, checkIn: dayjs(range[0]).startOf("day").unix(), checkOut: dayjs(range[1]).startOf("day").unix()
        }))
    }
    
    useEffect(() => {
    range && handleDates()
    }, [range])

    const handleReserve = async () => {
        if(inputs.checkIn !== "" && inputs.checkOut !== ""){
            const totalAmount = await signedMarketplace.getTotalPrice(listing.id)
            const escrow = await signedMarketplace.escrow(listing.id, inputs.checkIn, inputs.checkOut, {value: totalAmount})
            console.log(escrow)
        }
    }

    const nft = useSelector((state) => state.contracts.signedNFT)
    const checkOwner = async () => {
        if(nft != null){
            console.log(nft) 
            const owner = await nft.ownerOf(2)
            console.log(owner)
        }
    }

    useEffect(() => {
        checkOwner()
    }, [nft])

    return (
        <div className="flex items-center justify-center font-main">
            <div className="w-standard ">
            { listing &&      
                <div className="flex p-20 justify-center">
                    <div className="flex-1">
                        <Image src={listing.uri} height="500" width="500"/>
                    </div>
                    <div className="flex-1 text-secondary">
                        <h1 className="text-4xl font-bold">{listing.data.title}</h1>
                        <h1 className="text-4xl font-bold mt-5">${listing.data.price}</h1>
                        <p className="mt-5 text-2xl">{listing.data.description}</p>
                        <p className="mt-5 text-2xl">{listing.data.description}</p>
                        <h1 className='text-2xl mt-10'>Check In/Check Out</h1>
                        <ConfigProvider 
                        theme={{
                        token: {
                            lineWidthBold: "5px",
                            // colorPrimaryHover: "white",
                        }
                        }}
                        >
                        <RangePicker className='mt-5 w-full p-4 border-2' placeholder={["Check In","Check Out"]} onChange={setRange}/>
                        </ConfigProvider>
                        <div className="flex items-center justify-center mt-10">
                            <button className="bg-lblue px-20 py-2 text-xl font-bold rounded-lg" onClick={handleReserve}>Reserve</button>
                        </div>
                    </div>
                </div>
            }
            </div>
        </div>
    )
}

export default Lease