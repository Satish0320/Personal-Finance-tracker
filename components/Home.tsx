"use client"

import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import axios from "axios"
import TransactionForm from "@/components/TransactionForm"
import TransactionList from "@/components/TransactionList"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { fetchCategories } from "@/store/categorySlice"
import CategoryList from "./CategoryList"

export default function Home() {
  const { data: session } = useSession()
  const dispatch = useDispatch<AppDispatch>()

  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [categoryName, setCategoryName] = useState("")
  const [loading, setLoading] = useState(false)
  const [catError, setCatError] = useState("")

  const [aiInput, setAiInput] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      setCatError("Category name is required")
      return
    }

    setLoading(true)
    try {
      await axios.post("/api/category", { name: categoryName })
      dispatch(fetchCategories())
      setShowCategoryModal(false)
      setCategoryName("")
    } catch (err: any) {
      setCatError(err?.response?.data?.error || "Failed to create")
    } finally {
      setLoading(false)
    }
  }

  const handleAskAI = async () => {
    if (!aiInput.trim()) return
    setAiLoading(true)
    try {
      const res = await axios.post("/api/ai", { prompt: aiInput })
      setAiResponse(res.data.response)
    } catch {
      setAiResponse("Something went wrong. Please try again.")
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-6 sm:p-10 bg-gray-100 font-[var(--font-geist-sans)]">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-semibold text-gray-800">
          Welcome, {session?.user?.name || session?.user?.email}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <button
          onClick={() => setShowTransactionForm(prev => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showTransactionForm ? "Close Form" : "➕ Add Transaction"}
        </button>

        <button
          onClick={() => setShowCategoryModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ➕ Add Category
        </button>

        <button
          onClick={() => setShowCategories(true)}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          📂 View All Categories
        </button>
      </div>

      {/* Category List Modal */}
      {showCategories && <CategoryList onClose={() => setShowCategories(false)} />}

      {/* Transaction Form */}
      {showTransactionForm && (
        <div className="mb-10">
          <TransactionForm />
        </div>
      )}

      {/* Transactions */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-black">📋 All Transactions</h2>
        <TransactionList />
      </div>

      {/* ChatGPT Section */}
      <div className="mt-10 p-6 bg-white shadow rounded-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-black">💬 Ask AI for Spending Tips</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            placeholder="E.g. How can I save more on groceries?"
            className="flex-1 p-2 border rounded text-black"
          />
          <button
            onClick={handleAskAI}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={aiLoading}
          >
            {aiLoading ? "Thinking..." : "Ask"}
          </button>
        </div>
        {aiResponse && (
          <div className="bg-gray-100 p-3 rounded text-black">
            <strong>AI Suggestion:</strong> {aiResponse}
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4 text-black">New Category</h2>
            <input
              type="text"
              value={categoryName}
              onChange={e => setCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full p-2 border rounded mb-2 text-black"
            />
            {catError && <p className="text-red-600 mb-2">{catError}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowCategoryModal(false)
                  setCategoryName("")
                  setCatError("")
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
