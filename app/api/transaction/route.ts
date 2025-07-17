import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({
            error: "unauthorized"
        }, { status: 401 })
    }

    const body = await req.json()
    const { type, amount, description, categoryId, date } = body

    try {
        const transaction = await prisma.transaction.create({
            data: {
                type,
                amount: parseFloat(amount),
                description,
                // category:{connect: {id: categoryId}},
                // user:{connect:{email: session.user.id!}},
                categoryId,
                userId: session.user.id,
                date: new Date(date)
            }
        })

        // console.log({
        //     categoryId: String(categoryId),
        //     userId: String(session.user.id),
        //     date: new Date(date)
        // })

        return NextResponse.json({ data: transaction })
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong", details: error }, { status: 500 })
    }
}

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                user: { id: session.user.id }
            },
            include: { category: true },
            orderBy: { date: "desc" }
        })
        return NextResponse.json({ transactions })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
    }
}