"use client"

import { Category, fetchCategories } from "@/store/categorySlice"
import { AppDispatch, RootState } from "@/store/store"
import { addtransaction } from "@/store/transactionSlice"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"


export default function TransactionForm() {
    const dispatch = useDispatch<AppDispatch>()
    const categories = useSelector((state: RootState): Category[] => state.category.categories)

    const [type, setType] = useState<"income" | "expense">("expense")
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [date, setDate] = useState("")

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(addtransaction({ type, amount: +amount, description, categoryId, date }))
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md text-black mx-auto p-4">
                <select value={type} onChange={(e) => setType(e.target.value as "income" | "expense")} className="w-full p-2 border">
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <input type="number" value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full p-2 border text-black"
                    required
                />

                <input type="text" value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full p-2 border text-black"
                />

                <input type="date" value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full p-2 border text-black"
                    required
                />

                <select value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2 border text-black"
                    required
                >
                    <option value="">Select Categories</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}> {cat.name} </option>
                    ))}
                </select>

                <button type="submit"
                    className="bg-blue-500 text-white px-4 py-2">
                    Add Transaction
                </button>
            </form>
        </div>
    )
}