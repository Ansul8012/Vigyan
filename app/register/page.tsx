'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Webcam from 'react-webcam'

const fields = ['first name', 'course', 'student ID', 'email ID', 'face scan'] as const

export default function VoiceRegisterPage() {
  const webcamRef = useRef<Webcam>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [status, setStatus] = useState('')
  const [spokenText, setSpokenText] = useState('')
  const [data, setData] = useState({ name: '', course: '', studentId: '', email: '' })
  const [retakeRequested, setRetakeRequested] = useState(false)
  const [showFinalCard, setShowFinalCard] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)

  const recognition = useRef<any>(null)

  const SpeechRecognition =
    typeof window !== 'undefined' &&
    ((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition)

  useEffect(() => {
    if (!SpeechRecognition) {
      setStatus('Speech recognition not supported in your browser.')
      return
    }

    recognition.current = new SpeechRecognition()
    recognition.current.continuous = false
    recognition.current.lang = 'en-US'
    recognition.current.interimResults = false

    recognition.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase()
      setSpokenText(transcript)
      console.log(`🎤 Heard: ${transcript}`)

      if (awaitingConfirmation) {
        if (transcript === 'proceed') {
          setStatus('✅ Registration confirmed!')
          setRegistrationComplete(true)
        } else if (transcript === 'retake') {
          resetAll()
        } else {
          setStatus('Please say "proceed" to register or "retake" to start over.')
          setTimeout(() => recognition.current.start(), 1500)
        }
        return
      }

      if (transcript === 'retake') {
        setStatus(`Repeating ${fields[currentStep]}...`)
        setRetakeRequested(true)
        setTimeout(() => recognition.current.start(), 1000)
        return
      }

      if (transcript.length < 2) {
        setStatus(`Didn't catch that. Please repeat your ${fields[currentStep]}...`)
        setTimeout(() => recognition.current.start(), 1200)
        return
      }

      const updated = { ...data }
      if (currentStep === 0) updated.name = transcript
      if (currentStep === 1) updated.course = transcript
      if (currentStep === 2) updated.studentId = transcript
      if (currentStep === 3) updated.email = transcript
      setData(updated)
      setRetakeRequested(false)
      setSpokenText('')

      setTimeout(() => {
        if (currentStep < 4) {
          setCurrentStep((prev) => prev + 1)
        }
      }, 2500)
    }

    recognition.current.onerror = () => {
      setStatus(`Error occurred. Please repeat your ${fields[currentStep]}...`)
      setTimeout(() => recognition.current.start(), 1000)
    }

    // 🛠️ Fixed: prevent prompting during face scan or final card
    if (
      currentStep < 4 &&
      !retakeRequested &&
      !awaitingConfirmation &&
      !showFinalCard &&
      !registrationComplete
    ) {
      setStatus(`Please say your ${fields[currentStep]}...`)
      setTimeout(() => recognition.current.start(), 800)
    }
  }, [currentStep, retakeRequested, awaitingConfirmation, showFinalCard, registrationComplete])

  // 🔹 Face Scan Effect
  useEffect(() => {
    if (currentStep === 4) {
      const timer = setTimeout(() => {
        const image = webcamRef.current?.getScreenshot()
        if (image) setCapturedImage(image)
        setShowFinalCard(true)
        setAwaitingConfirmation(true)
        setStatus(`If all details are correct, say "proceed". To start over, say "retake".`)
        setTimeout(() => recognition.current.start(), 1200)
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  const resetAll = () => {
    setData({ name: '', course: '', studentId: '', email: '' })
    setCapturedImage(null)
    setCurrentStep(0)
    setRetakeRequested(false)
    setShowFinalCard(false)
    setAwaitingConfirmation(false)
    setRegistrationComplete(false)
    setSpokenText('')
    setStatus('Restarting registration...')
    setTimeout(() => recognition.current?.start(), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-4 sm:px-6 py-10 flex flex-col items-center justify-center">
      {/* 🔹 Beautiful Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl sm:text-6xl font-extrabold text-center bg-gradient-to-r from-blue-300 via-gray-100 to-white bg-clip-text text-transparent drop-shadow"
      >
        Voice-Based Student Registration
      </motion.h1>

      <p className="text-gray-400 mt-3 mb-6 text-center text-sm sm:text-base">
        Speak clearly. Say <span className="text-blue-400 font-medium">"retake"</span> anytime to retry.
      </p>

      {/* 🔹 Robot & Status */}
      {!registrationComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-6"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
            alt="Robot"
            className="w-24 sm:w-28 animate-pulse"
          />
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-3 px-4 py-2 rounded-lg bg-[#0f0f0f] border border-blue-600 text-blue-300 text-sm shadow"
          >
            {status}
          </motion.div>
        </motion.div>
      )}

      {/* 🔹 Spoken Transcript */}
      {spokenText && currentStep < 4 && (
        <motion.div
          key={spokenText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 text-center text-lg bg-gray-800 border border-gray-600 px-6 py-3 rounded-xl shadow text-gray-200 max-w-md"
        >
          You said: <span className="text-white font-semibold">"{spokenText}"</span>
        </motion.div>
      )}

      {/* 🔹 Webcam Live */}
      <AnimatePresence mode="wait">
        {currentStep === 4 && !showFinalCard && (
          <motion.div
            key="webcam"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-72 sm:w-80 h-72 sm:h-80 rounded-xl overflow-hidden border-4 border-blue-500 shadow-lg relative"
          >
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
            />
            <div
              className="absolute top-0 left-0 w-full h-1 bg-blue-500 z-10"
              style={{ animation: 'scanline 2s linear infinite' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Final Card */}
      {showFinalCard && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-10 bg-[#111] border border-gray-700 rounded-2xl px-6 py-6 shadow-xl text-center max-w-md w-full"
        >
          <h2 className={`text-2xl font-bold mb-5 ${registrationComplete ? 'text-green-400' : 'text-yellow-400'}`}>
            {registrationComplete ? '🎉 Registration Successful!' : '🪪 Please Confirm Your Details'}
          </h2>
          {capturedImage && (
            <img
              src={capturedImage}
              alt="User Face"
              className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-blue-500 object-cover shadow"
            />
          )}
          <div className="text-left text-sm text-gray-300 space-y-2">
            <p><strong>👤 Name:</strong> {data.name}</p>
            <p><strong>📚 Course:</strong> {data.course}</p>
            <p><strong>🆔 Student ID:</strong> {data.studentId}</p>
            <p><strong>📧 Email:</strong> {data.email}</p>
          </div>
        </motion.div>
      )}

      {/* 🔹 Scanline Animation */}
      <style jsx>{`
        @keyframes scanline {
          0% {
            top: 0%;
          }
          100% {
            top: 100%;
          }
        }
      `}</style>
    </div>
  )
}
