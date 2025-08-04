import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt || prompt.trim() === "") {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
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

    return NextResponse.json({ response: text });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
