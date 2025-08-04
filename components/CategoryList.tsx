// "use client"

// import { AppDispatch, RootState } from "@/store/store"

// import { useDispatch, useSelector } from "react-redux"
// import { useEffect, useState } from "react"
// import { fetchCategories, deleteCategories, editCategories } from "@/store/categorySlice"

// export default function CategoryList({ onClose }: { onClose: () => void }) {
//   const dispatch = useDispatch<AppDispatch>()
//   const categories = useSelector((state: RootState) => state.category.categories)
//   const [editId, setEditId] = useState<string | null>(null)
//   const [editName, setEditName] = useState("")

//   useEffect(() => {
//     dispatch(fetchCategories())
//   }, [dispatch])

//   const handleDelete = (id: string) => {
//     dispatch(deleteCategories(id))
//   }

//   const handleEdit = (id: string, name: string) => {
//     dispatch(editCategories({ id, name }))
//     setEditId(null)
//   }

//   return (
//     <div className="max-w-lg mx-auto p-4 bg-white shadow rounded space-y-4">
//       <h2 className="text-xl font-semibold mb-4">All Categories</h2>
//       <button onClick={onClose} className="text-red-600 mb-4">Close</button>
//       {categories.map(cat => (
//         <div key={cat.id} className="p-3 border rounded flex justify-between items-center">
//           {editId === cat.id ? (
//             <>
//               <input
//                 value={editName}
//                 onChange={e => setEditName(e.target.value)}
//                 className="border p-1 flex-1 mr-2 text-black"
//               />
//               <button
//                 onClick={() => handleEdit(cat.id, editName)}
//                 className="bg-blue-500 text-white px-2"
//               >
//                 Save
//               </button>
//             </>
//           ) : (
// <>
//       <div className="flex-1">
//         <p className="font-medium text-black">{cat.name}</p>
//         <p className="text-sm text-gray-500">Spent: ₹{cat.totalAmount ?? 0}</p>
//       </div>
//       <div className="flex gap-2">
//         <button
//           onClick={() => {
//             setEditId(cat.id)
//             setEditName(cat.name)
//           }}
//           className="text-blue-500"
//         >
//           Edit
//         </button>
//         <button onClick={() => handleDelete(cat.id)} className="text-red-500">
//           Delete
//         </button>
//       </div>
//     </>
//           )}
//         </div>
//       ))}
//     </div>
//   )
// }


"use client"

import { AppDispatch, RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { fetchCategories, deleteCategories, editCategories } from "@/store/categorySlice"

export default function CategoryList({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch<AppDispatch>()
  const categories = useSelector((state: RootState) => state.category.categories)
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleDelete = (id: string) => {
    dispatch(deleteCategories(id))
  }

  const handleEdit = (id: string, name: string) => {
    dispatch(editCategories({ id, name }))
    setEditId(null)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center p-4">
      <div className="bg-white max-w-xl w-full rounded-xl shadow-lg p-6 space-y-4 relative">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">All Categories</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 transition duration-150"
          >
            ✖
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between border rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition"
            >
              {editId === cat.id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md w-full mr-2 text-sm text-black"
                  />
                  <button
                    onClick={() => handleEdit(cat.id, editName)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{cat.name}</p>
                    <p className="text-sm text-gray-500">Spent: ₹{cat.totalAmount ?? 0}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditId(cat.id)
                        setEditName(cat.name)
                      }}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
