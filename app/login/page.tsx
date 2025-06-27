'use client'

import { useState, useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import { Loader2, UserCheck } from 'lucide-react'

export default function FaceLoginPage() {
  const [status, setStatus] = useState<'scanning' | 'recognized' | 'failed'>('scanning')
  const webcamRef = useRef<Webcam>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate face recognition result
      setStatus('recognized') // or 'failed'
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10">
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-center bg-gradient-to-r from-gray-300 via-white to-gray-400 bg-clip-text text-transparent">
        Face Recognition Login
      </h1>
      <p className="text-gray-400 mb-10 text-center text-lg">
        Please align your face in the box to continue
      </p>

      {/* Webcam + Scanner Box */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-xl overflow-hidden border-4 border-blue-600 shadow-xl">
        {/* Webcam Feed */}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover"
          videoConstraints={{
            width: 640,
            height: 640,
            facingMode: 'user',
          }}
        />

        {/* Blue scanning line animation */}
        <div
          className="absolute top-0 left-0 w-full h-1 bg-blue-500 z-20"
          style={{
            animation: 'scanline 2s linear infinite',
          }}
        />

        {/* Glassy scan frame */}
        <div className="absolute inset-0 border-4 border-blue-500 rounded-xl z-10 pointer-events-none" />
      </div>

      {/* Status Message */}
      <div className="mt-8 text-center">
        <span
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            status === 'scanning'
              ? 'bg-blue-900 text-blue-300'
              : status === 'recognized'
              ? 'bg-green-900 text-green-300'
              : 'bg-red-900 text-red-300'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-current animate-ping" />
          {status === 'scanning' && 'Scanning your face...'}
          {status === 'recognized' && 'Face recognized. Logging in...'}
          {status === 'failed' && 'Face not recognized. Try again.'}
        </span>
      </div>

      {/* Inline keyframes for scanning animation */}
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
