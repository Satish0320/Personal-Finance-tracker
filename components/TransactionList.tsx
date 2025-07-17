"use client"

import { AppDispatch, RootState } from "@/store/store"
import {
  fetchTransactions,
  deleteTransaction,
  editTransaction,
  Transaction,
} from "@/store/transactionSlice"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function TransactionList() {
  const dispatch = useDispatch<AppDispatch>()
  const { transactions, loading } = useSelector((state: RootState) => state.transaction)

  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    type: "expense",
    amount: "",
    description: "",
    date: "",
    categoryId: "",
  })

  // Fetch transactions on load
  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])

  const handleDelete = (id: string) => {
    dispatch(deleteTransaction(id))
  }

  const handleEdit = (txn: Transaction) => {
    setEditId(txn.id)
    setEditForm({
      type: txn.type,
      amount: txn.amount.toString(),
      description: txn.description || "",
      date: txn.date.slice(0, 10),
      categoryId: txn.categoryId,
    })
  }

  const handleUpdate = () => {
    dispatch(
      editTransaction({
        id: editId!,
        data: {
          ...editForm,
          amount: parseFloat(editForm.amount),
          date: new Date(editForm.date).toISOString(),
        },
      })
    )
    setEditId(null)
  }

  if (loading) return <p>Loading...</p>
  if (!transactions.length) return <p>No transactions yet.</p>

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-4">
      {transactions.map(txn => (
        <div key={txn.id} className="p-4 border rounded shadow">
          {editId === txn.id ? (
            <>
              <input
                value={editForm.amount}
                onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                type="number"
                className="w-full mb-2 p-2 border text-black"
              />
              <input
                value={editForm.description}
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full mb-2 p-2 border text-black"
              />
              <input
                type="date"
                value={editForm.date}
                onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                className="w-full mb-2 p-2 border text-black"
              />
              <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-1 mr-2">
                Save
              </button>
              <button onClick={() => setEditId(null)} className="text-gray-500">
                Cancel
              </button>
            </>
          ) : (
            <>
              <p className="font-semibold text-lg text-black">
                {txn.type.toUpperCase()} - ₹{txn.amount}
              </p>
              <p className="text-black">{txn.description}</p>
              <p className="text-black">{new Date(txn.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 ">Category: {txn.category?.name ?? "N/A"}</p>
              <div className="flex gap-4 mt-2">
                <button onClick={() => handleEdit(txn)} className="text-blue-600">
                  Edit
                </button>
                <button onClick={() => handleDelete(txn.id)} className="text-red-600">
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
