import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Category {
    id: string
    name: string
}

interface State {
    categories: Category[]
    loading: boolean
    error: string | null
}

const initialState: State = {
    categories:[],
    loading: false,
    error: null
}

export const fetchCategories = createAsyncThunk("categories/fetch", async()=>{
    const res = await axios.get("/api/category")
    return res.data.categories as Category[]
})


const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers:{},
    extraReducers: builder => {
        builder
        .addCase(fetchCategories.pending, state =>{
            state.loading = true
        })
        .addCase(fetchCategories.fulfilled,(state, action: PayloadAction<Category[]>)=>{
            state.loading = false
            state.categories = action.payload
        })
        .addCase(fetchCategories.rejected, (state, action)=>{
            state.loading = false
            state.error = action.error.message ?? "Failed to load"
        })
    }
})

export const categoryReducer = categorySlice.reducer