import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        await prisma.transaction.delete({
            where: {
                id: params.id,
                userId: session.user.id
            }
        })
        return NextResponse.json({ message: "Deleted successfully" })

    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
    }
}


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, amount, description, date, categoryId } = await req.json()

    try {
        const updated = await prisma.transaction.update({
            where: {
                id: params.id
            },
            data: {
                type,
                amount,
                description,
                date,
                categoryId,
                userId: session.user.id
            }
        })
        return NextResponse.json({ transaction: updated })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }
}