'use client'

import Home from '@/components/Home'
import { useSession, signIn } from 'next-auth/react'
// import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { data: session, status } = useSession()
  // const router = useRouter()

  if (status === 'loading') return <p className="text-center">Loading...</p>

  // Not logged in? Show login/register buttons
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-6 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-black">Welcome to Finance Tracker</h1>
        <button
          onClick={() => signIn()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login with Google / Credentials
        </button>
      </div>
    )
  }

  // Logged in? Show dashboard
  return (
    <Home/>
  )
}
