import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"


export interface Category {
    id: string
    name: string
}

export type CreateTransactionInput = {
  type: "income" | "expense"
  amount: number
  description?: string
  date: string
  categoryId: string
}

export interface Transaction {
    id: string,
    type: "income" | "expense",
    amount: number,
    description?:string,
    date: string,
    categoryId: string,
    category: Category
}

interface State {
    transactions: Transaction[]
    loading: boolean,
    error: string | null
}

const initialState: State = {
    transactions: [],
    loading: false,
    error: null
}

// fetch all transactions
export const fetchTransactions = createAsyncThunk("transactions/fetch", async()=> {
    const res = await axios.get("/api/transaction")
    return res.data.transactions as Transaction[]
})

//add transaction
export const addtransaction = createAsyncThunk("transactions/add", async(data: CreateTransactionInput )=>{
    const res = await axios.post("/api/transaction", data)
    return res.data.data as Transaction
})

//delete Transaction
export const deleteTransaction = createAsyncThunk("transaction/delete",async (id:string)=>{
    const res = await axios.delete(`/api/transaction/${id}`)
    return res.data.message
})

//edit transaction
export const editTransaction = createAsyncThunk("transaction/edit",async ({id, data}: {id:string; data: Partial<CreateTransactionInput>})=>{
    const res = await axios.patch(`/api/transaction/${id}`,{...data})
    return res.data.transaction
})



const transactionSlice = createSlice({
    name:"transaction",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchTransactions.pending, state=>{
            state.loading = true
        })
        .addCase(fetchTransactions.fulfilled,(state, action:PayloadAction<Transaction[]>)=>{
            state.loading = false
            state.transactions = action.payload
        }) 
        .addCase(fetchTransactions.rejected,(state, action)=>{
            state.loading = false
            state.error = action.error.message ?? "Failed to load"
        })
        .addCase(addtransaction.fulfilled,(state, action: PayloadAction<Transaction>)=>{
            state.transactions.unshift(action.payload)
        })
        .addCase(deleteTransaction.fulfilled,(state, action:PayloadAction<string> )=>{
            state.transactions = state.transactions.filter(txn => txn.id !== action.payload)
        })
        .addCase(editTransaction.fulfilled, (state, action:PayloadAction<Transaction>)=>{
            const index = state.transactions.findIndex(txn => txn.id === action.payload.id)
            if (index !== -1) {
                state.transactions[index] = action.payload
            }
        })
    },
})

export const transactionReducer = transactionSlice.reducer