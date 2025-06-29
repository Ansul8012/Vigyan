// app/assist/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Mic, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AssistPage() {
  const [messages, setMessages] = useState<string[]>([])
  const [listening, setListening] = useState(false)
  const [userInput, setUserInput] = useState('')
  const recognitionRef = useRef<any>(null)
  const router = useRouter()

  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      ((window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition)

    if (!SpeechRecognition) return

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.lang = 'en-US'
    recognitionRef.current.interimResults = false

    recognitionRef.current.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase()
      setUserInput('')
      setMessages((prev) => [...prev, `🧑‍🎓: ${transcript}`])

      if (transcript.includes('issue a book')) {
        speak('Taking you back to home page.')
        setTimeout(() => router.push('/'), 3000)
        return
      }

      const geminiResponse = await fetch('/api/askGemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: transcript })
      }).then((res) => res.json())

      if (geminiResponse.text) {
        setMessages((prev) => [...prev, `📚: ${geminiResponse.text}`])
        speak(geminiResponse.text)
      }
    }

    recognitionRef.current.onerror = (e: any) => console.error(e)
  }, [router])

  const speak = (text: string) => {
    if (synth) {
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'en-US'
      synth.speak(utter)
    }
  }

  const handleMicClick = () => {
    if (!recognitionRef.current) return
    setListening(true)
    recognitionRef.current.start()
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">📖 AI Book Assistant</h1>

      <div className="bg-zinc-800 p-6 rounded-lg max-w-xl w-full shadow-md mb-6 overflow-y-auto h-96 space-y-3">
        {messages.map((msg, idx) => (
          <p key={idx} className="text-sm text-gray-200 whitespace-pre-wrap">{msg}</p>
        ))}
      </div>

      <button
        onClick={handleMicClick}
        className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-3 rounded-lg shadow hover:scale-105 transition-transform"
      >
        <Mic className="w-5 h-5" /> Start Speaking
      </button>

      <p className="mt-8 text-sm text-gray-400 max-w-xl text-center">
        📝 <strong>User Manual:</strong> Try asking things like:
        <br />- "I am learning DSA, which book should I issue?"
        <br />- "Suggest books on operating systems."
        <br />- "Issue a book"
      </p>
    </div>
  )
}
