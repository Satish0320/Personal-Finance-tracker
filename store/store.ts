import { configureStore } from "@reduxjs/toolkit";
import { transactionReducer } from "./transactionSlice";
import { categoryReducer } from "./categorySlice";


export const store = configureStore({
    reducer:{
        transaction: transactionReducer,
        category: categoryReducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
