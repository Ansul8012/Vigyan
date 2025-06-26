'use client'

import VoiceHero from './components/VoiceHero'
import { Mic } from 'lucide-react'
import { useVoiceCommand } from './hooks/useVoiceCommand'

export default function HomePage() {
  useVoiceCommand() // 👈 activates voice listening on mount

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Admin Login Button */}
      <div className="absolute top-4 right-6">
        <button className="bg-black text-gray-300 border border-gray-700 hover:bg-gray-900 px-4 py-1.5 rounded-md transition-all duration-200">
          Admin Login
        </button>
      </div>

      {/* Typewriter Text + Mic Icon */}
      <div className="text-center space-y-6 mb-12">
        <VoiceHero />
        <p className="text-lg text-gray-400">
          Speak to interact with Viggyan's AI-powered library.
        </p>
      </div>

      {/* Instruction Cards */}
      <div className="mt-12 flex flex-col sm:flex-row gap-8 items-center justify-center">
        <div className="bg-[#111] border border-gray-800 p-5 rounded-lg w-72 text-left shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 bg-blue-500 rounded-full" />
            <span className="font-semibold text-white">System Message</span>
          </div>
          <p className="text-sm text-gray-300">
            New to Viggyan? Say <b>"Register"</b> to begin voice enrollment.
          </p>
        </div>

        <div className="text-center space-y-6 mb-12">
          <div className="flex justify-center">
            <div className="rounded-full bg-gradient-to-br from-gray-700 to-gray-500 p-6 shadow-xl animate-pulse">
              <Mic className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-gray-800 p-5 rounded-lg w-72 text-left shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 bg-green-500 rounded-full" />
            <span className="font-semibold text-white">Voice Command</span>
          </div>
          <p className="text-sm text-gray-300">
            Say <span className="text-green-400 font-semibold">"Login"</span> to authenticate via face recognition.
          </p>
        </div>
      </div>
    </div>
  )
}
