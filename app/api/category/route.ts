import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" }
        })
        return NextResponse.json({ categories })
    } catch (error) {
        console.error("Error fetching categories:", error)
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }
}


export async function POST(req: NextRequest){
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

      const {name} = await req.json()
      if (!name || name.trim() === "") {
        return NextResponse.json({ error: "Category name is required" }, { status: 400 })
      }

    try {
      const existingName = await prisma.category.findFirst({
        where:{name: name.trim()}
      })

      if (existingName) {
        return NextResponse.json({ error: "Category already exists" }, { status: 409 })
      }

      const category = await prisma.category.create({
        data:{
            name: name.trim(),
            userId: session.user.id
        }
      })
        return NextResponse.json({ category })

    } catch (error) {
        console.error("Error fetching categories:", error)
        return NextResponse.json({ error: 'Failed to create categories' }, { status: 500 })
    }

}