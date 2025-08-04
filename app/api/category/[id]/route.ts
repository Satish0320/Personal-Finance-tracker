import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, {params} : {params: {id: string}}){
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

      const category = await prisma.category.update({
        where:{
            id: params.id
        },
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

export async function DELETE(req: NextRequest, {params} : {params: {id: string}}){
  const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      await prisma.category.delete({
        where:{
          id: params.id,
          userId: session.user.id
        }
      })
      return NextResponse.json({ message: "Deleted successfully" })

    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
      
    }
}