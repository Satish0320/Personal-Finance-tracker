// "use client"

// import { Category, fetchCategories } from "@/store/categorySlice"
// import { AppDispatch, RootState } from "@/store/store"
// import { addtransaction } from "@/store/transactionSlice"
// import { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"


// export default function TransactionForm() {
//     const dispatch = useDispatch<AppDispatch>()
//     const categories = useSelector((state: RootState): Category[] => state.category.categories)

//     const [type, setType] = useState<"income" | "expense">("expense")
//     const [amount, setAmount] = useState("")
//     const [description, setDescription] = useState("")
//     const [categoryId, setCategoryId] = useState("")
//     const [date, setDate] = useState("")

//     useEffect(() => {
//         dispatch(fetchCategories())
//     }, [dispatch])

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault()
//         dispatch(addtransaction({ type, amount: +amount, description, categoryId, date }))
//     }

//     return (
//         <div>
//             <form onSubmit={handleSubmit} className="space-y-4 max-w-md text-black mx-auto p-4">
//                 <select value={type} onChange={(e) => setType(e.target.value as "income" | "expense")} className="w-full p-2 border">
//                     <option value="income">Income</option>
//                     <option value="expense">Expense</option>
//                 </select>

//                 <input type="number" value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                     placeholder="Amount"
//                     className="w-full p-2 border text-black"
//                     required
//                 />

//                 <input type="text" value={description}
//                     onChange={e => setDescription(e.target.value)}
//                     placeholder="Description"
//                     className="w-full p-2 border text-black"
//                 />

//                 <input type="date" value={date}
//                     onChange={e => setDate(e.target.value)}
//                     className="w-full p-2 border text-black"
//                     required
//                 />

//                 <select value={categoryId}
//                     onChange={(e) => setCategoryId(e.target.value)}
//                     className="w-full p-2 border text-black"
//                     required
//                 >
//                     <option value="">Select Categories</option>
//                     {categories.map((cat) => (
//                         <option key={cat.id} value={cat.id}> {cat.name} </option>
//                     ))}
//                 </select>

//                 <button type="submit"
//                     className="bg-blue-500 text-white px-4 py-2">
//                     Add Transaction
//                 </button>
//             </form>
//         </div>
//     )
// }


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
    // Clear form
    setAmount("")
    setDescription("")
    setCategoryId("")
    setDate("")
    setType("expense")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white max-w-xl mx-auto rounded-xl shadow-md p-6 space-y-5"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Add Transaction</h2>

      <div className="space-y-1">
        <label className="block text-sm text-gray-700 font-medium">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          className="w-full p-2 border rounded-md text-black bg-white"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-sm text-gray-700 font-medium">Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full p-2 border rounded-md text-black"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm text-gray-700 font-medium">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Grocery, Salary..."
          className="w-full p-2 border rounded-md text-black"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm text-gray-700 font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded-md text-black"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm text-gray-700 font-medium">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-2 border rounded-md text-black bg-white"
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200"
      >
        Add Transaction
      </button>
    </form>
  )
}
