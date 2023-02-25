/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    nftStorageKey: process.env.nftStorageKey
  },
  images: {
    domains: ["leaseonchain.s3.us-west-1.amazonaws.com"]
  },
}

module.exports = nextConfig
