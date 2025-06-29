// hooks/useVoiceCommand.ts
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useVoiceCommand() {
  const router = useRouter()

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      ((window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition)

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = 'en-US'
    recognition.interimResults = false

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase()

      console.log('🎤 You said:', transcript)

      if (transcript.includes('register')) {
        router.push('/register')
      } else if (transcript.includes('login')) {
        router.push('/login')
      } else if (transcript.includes('assist')) {
        router.push('/assist')
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error)
    }

    recognition.start()

    return () => recognition.stop()
  }, [router])
}
