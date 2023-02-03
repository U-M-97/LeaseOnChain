import { createSlice } from "@reduxjs/toolkit"

const contractsSlice = createSlice({
    name: "contracts",
    initialState: {
        nft: null,
        marketplace: null
    },
    reducers: {
        nftState: (state, action) => {
            state.nft = action.payload
        },
        marketplaceState: (state, action) => {
            state.marketplace = action.payload
        }
    }
})

export const { nftState, marketplaceState } = contractsSlice.actions
export default contractsSlice.reducer