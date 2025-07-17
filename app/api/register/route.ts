import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(req:NextRequest) {
    try {
        const {name, email, password} = await req.json()

        if (!name || !email || !password) {
            return NextResponse.json({
                error:"Fields are missing"
            },{status:400})
        }

        const existingUser = await prisma.user.findUnique({
            where: {email}
        })

        if (existingUser) {
          return  NextResponse.json({error:"Email Already Exist"},{status:401})
        }

        const hashPassword = await bcrypt.hash(password,10)

        const newUser = await prisma.user.create({
            data:{
                email,
                name,
                password: hashPassword
            }
        })
        return NextResponse.json({user:newUser},{status:200})
    } catch (error) {
        NextResponse.json({error})
    }
}