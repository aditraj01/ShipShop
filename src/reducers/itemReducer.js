import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import  axios  from 'axios';

//Initail State
const initialState = {
    items: [],
    price: 300,
    isInCart: false,
    search: "",
    total: 0,
    isLoading: false
};

//Fetching the items 
export const setItemsAsync = createAsyncThunk("items/fetch",async (args, ThunkAPI) => {
    if(args === "All"){
        return (await axios.get('https://fakestoreapi.com/products')).data;
        }else{
        return (await axios.get(`https://fakestoreapi.com/products/category/${args}`)).data
    }
})
//Item Slice 
const itemSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
        setTotal: (state, action) => {
            state.total = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setIsInCart: (state, action) => {
            state.isInCart = action.payload;
        },
        changePrice: (state, action) => {
            state.price = action.payload
        },
        setItems: (state, action) => {
            state.items = [...action.payload]
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setItemsAsync.fulfilled, (state, action) => {
            state.isLoading = false;
            state.items = [...action.payload];
        }).addCase(setItemsAsync.pending, (state, action) => {
            state.isLoading = true;
        })
    }
});

//Exporting the values
export const itemReducer = itemSlice.reducer;
export const itemaction = itemSlice.actions;
export const itemSelector = (state) => state.itemReducer;
