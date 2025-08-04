import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Category {
    id: string
    name: string
    totalAmount: number
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

export const deleteCategories = createAsyncThunk("categories/delete", async(id: string)=>{
    const res = await axios.delete(`/api/category/${id}`)
    return res.data.message
})

export const editCategories = createAsyncThunk("categories/edit", async({id, name}: {id: string, name:string })=>{
const res = await axios.patch(`/api/category/${id}`, {name})
return res.data.category
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
        .addCase(deleteCategories.fulfilled, (state, action: PayloadAction<string>)=>{
            state.categories = state.categories.filter(cat => cat.id !== action.payload)
        })
        .addCase(editCategories.fulfilled,(state, action: PayloadAction<Category>)=>{
            const i = state.categories.findIndex(cat=> cat.id === action.payload.id)
            if(i !==-2) state.categories[i] = action.payload
        })
    }
})

export const categoryReducer = categorySlice.reducer





