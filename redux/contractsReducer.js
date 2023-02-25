import { createSlice } from "@reduxjs/toolkit"

const contractsSlice = createSlice({
    name: "contracts",
    initialState: {
        nft: null,
        marketplace: null,
        signedNFT: null,
        signedMarketplace: null,
        selectedProperty: null,
        metadata: null
    },
    reducers: {
        nftState: (state, action) => {
            state.nft = action.payload
        },
        marketplaceState: (state, action) => {
            state.marketplace = action.payload
        },
        signedNFTState: (state, action) => {
            state.signedNFT = action.payload
        },
        signedMarketplaceState: (state, action) => {
            state.signedMarketplace = action.payload
        },
        selectedPropertyState: (state, action) => {
            state.selectedProperty = action.payload
        },
        setMetadata: (state, action) => {
            state.metadata = action.payload
        }
    }
})

export const { nftState, marketplaceState, signedNFTState, signedMarketplaceState, selectedPropertyState, setMetadata } = contractsSlice.actions
export default contractsSlice.reducer