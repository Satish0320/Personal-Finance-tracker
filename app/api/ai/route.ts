import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/prisma/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt || prompt.trim() === "") {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

   
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        transactions: {
          include: {
            category: true
          },
          orderBy: {
            date: 'desc'
          }
        },
        category: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    
    const totalIncome = user.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = user.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const recentTransactions = user.transactions.slice(0, 10);
    
    const expensesByCategory = user.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const categoryName = t.category.name;
        acc[categoryName] = (acc[categoryName] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const incomeByCategory = user.transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        const categoryName = t.category.name;
        acc[categoryName] = (acc[categoryName] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Create enhanced prompt with financial context
    const enhancedPrompt = `
You are a personal finance assistant for ${user.name || 'the user'}. Here is their current financial data:

FINANCIAL SUMMARY:
- Total Income: $${totalIncome.toFixed(2)}
- Total Expenses: $${totalExpenses.toFixed(2)}
- Net Balance: $${(totalIncome - totalExpenses).toFixed(2)}

EXPENSES BY CATEGORY:
${Object.entries(expensesByCategory).map(([category, amount]) => 
  `- ${category}: $${amount.toFixed(2)}`
).join('\n')}

INCOME BY CATEGORY:
${Object.entries(incomeByCategory).map(([category, amount]) => 
  `- ${category}: $${amount.toFixed(2)}`
).join('\n')}

RECENT TRANSACTIONS (Last 10):
${recentTransactions.map(t => 
  `- ${t.date.toLocaleDateString()}: ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)} (${t.category.name}) - ${t.description || 'No description'}`
).join('\n')}

AVAILABLE CATEGORIES:
${user.category.map(c => `- ${c.name}`).join('\n')}

User Question: ${prompt}

Please provide helpful financial advice, insights, or answers based on this data. Be specific and reference their actual financial situation when relevant.
`;

    const res = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: enhancedPrompt }],
          },
        ],
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Gemini error:", error);

      // Handle quota exceeded specifically
      if (error.error?.code === 429) {
        return NextResponse.json({
          error: "API quota exceeded. Please try again later or upgrade your plan."
        }, { status: 429 });
      }

      return NextResponse.json({ error: error.error?.message || "Gemini API error" }, { status: 500 });
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return NextResponse.json({ 
      response: text,
      financialSummary: {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        transactionCount: user.transactions.length
      }
    });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
