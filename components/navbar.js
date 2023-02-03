import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
  return (
    <nav className="bg-secondary flex font-main items-center justify-center">
      <div className="w-standard px-10 flex">
        <div className="flex-1">
          <div className="relative h-14 w-60 rounded-full">
            <Image src="/images/logo.png" objectFit="cover" layout="fill" className="rounded-full"/>
          </div>
        </div>
        <div className=" flex-1 text-xl flex items-center justify-center">
          <Link href="/" className="mx-5 hover:text-primary duration-300">Home</Link>
          <Link href="/"  className="mx-5 hover:text-primary duration-300">Mint</Link>
        </div>
        <div className=" flex-1 flex items-center justify-end">
          <button className="text-xl bg-primary px-8 py-2 rounded-full hover:bg-third duration-300">Connect Wallet</button>
        </div>
      </div>  
    </nav>
  )
}

export default Navbar