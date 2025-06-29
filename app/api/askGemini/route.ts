// app/api/askGemini/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const geminiApiKey = process.env.GEMINI_API_KEY
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Suggest top 3 useful academic books from a university library if a student says: "${prompt}". Reply only book names and a short reason.` }] }]
      })
    })

    const data = await res.json()

    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part: any) => part?.text)
      ?.join(' ')
      ?.trim()

    return NextResponse.json({ text: text || 'Sorry, I could not find any suggestions.' })
  } catch (err) {
    console.error('[Gemini Error]', err)
    return NextResponse.json({ text: 'There was an error fetching suggestions.' })
  }
}
