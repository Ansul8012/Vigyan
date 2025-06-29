// pages/api/gemini-clean.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI("AIzaSyChpC0ZD8qtXyFE8g2QJKiF11qw0g2VojQ")

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { prompt } = req.body

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt format.' })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Extract cleaned value
    const match = text.match(/:\s*(.+)$/)
    const cleanedValue = match ? match[1].trim() : ''

    if (!cleanedValue) {
      return res.status(200).json({ cleanedValue: '' })
    }

    res.status(200).json({ cleanedValue })
  } catch (error: any) {
    console.error('Gemini error:', error.message)
    res.status(500).json({ error: 'Failed to fetch from Gemini.' })
  }
}
