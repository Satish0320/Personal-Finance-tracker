"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function LoginPage(){
    const[form, setForm] = useState({email:"", password:""})
    const[error, setError] = useState("")
    const router = useRouter()

    const handleLogin = async(e:React.FormEvent) => {
        e.preventDefault()
        setError("")
        
        const res = await signIn("credentials",{
            redirect:false,
            email: form.email,
            password: form.password,
            callbackurl:"/"
        })
        console.log("signIn response", res);
        if (res?.ok) {
            router.push("/dashboard")
        }else{
            setError("Invalid Email and Password")
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
        <form onSubmit={handleLogin}>
        <input type="text" 
        placeholder="abc@gmail.com"
        value={form.email}
        onChange={(e)=>setForm({...form, email:e.target.value})}
        className="w-full p-2 border rounded"
        required
        />
        <input type="password" 
        placeholder="password"
        value={form.password}
        onChange={(e)=>setForm({...form, password:e.target.value})}
        className="w-full p-2 border rounded"
        required
        />
        {error && <p className="text-red-600"> {error} </p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" >Login</button>
        </form>
        <button className="w-full bg-blue-300 text-white p-2 rounded m-2"
        onClick={()=>{signIn("google",{callbackUrl: `${window.location.origin}/dashboard`})}}
        >Google</button>
        </div>
    )
}