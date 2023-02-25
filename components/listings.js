import { useDispatch } from "react-redux"
import { useState } from 'react'
import Image from 'next/image'
import { selectedPropertyState } from '../redux/contractsReducer'
import { useRouter } from 'next/router'
import { useSelector } from "react-redux"

const Listings = ({next, prev}) => {

  const metadata = useSelector((state) => state.contracts.metadata)
  const dispatch = useDispatch()
  const router = useRouter()

  const handleSelectedProperty = (item) => {
    dispatch(selectedPropertyState(item))
    router.push("/lease")
  }

  return (
    <div className='font-main'>
      <div className='bg-secondary flex items-center justify-center'>
        <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-x-8 gap-y-12 p-10 mt-10 '>
          {metadata && metadata.map((item) => {
            return(
            <div className='w-80 rounded-lg cursor-pointer text-white' onClick={() => {handleSelectedProperty(item)}}>
              <div className='relative h-80 w-full'>
                <Image className='rounded-lg' src={item.uri} layout='fill' objectFit='cover'/>
              </div>
              <h1 className='text-3xl mt-2'>{item.data.title}</h1>
              <p className='text-xl mt-2'>${item.data.price}</p>
              <p className='text-xl mt-2'>{item.status == false ? "Occupied" : "Available" }</p>
            </div>
            )
          })}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button className="px-5 bg-lblue py-2 mr-5" onClick={prev}>Prev</button>
        <label className="px-5 border-2 border-lblue py-2 mr-5">1</label>
        <button className="px-5 bg-lblue py-2" onClick={next}>Next</button>
      </div>  
    </div>
  )
}

export default Listings