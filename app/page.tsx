'use client'

import VoiceHero from './components/VoiceHero'
import { Mic, UserPlus2, Key, HelpCircle } from 'lucide-react'
import { useVoiceCommand } from './hooks/useVoiceCommand'
import { motion } from 'framer-motion'

export default function HomePage() {
  useVoiceCommand()

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-12">
      {/* Admin Login Button */}
      <div className="absolute top-4 right-6">
        <button className="bg-black text-gray-300 border border-gray-700 hover:bg-gray-900 px-4 py-1.5 rounded-md transition-all duration-200">
          Admin Login
        </button>
      </div>

      {/* Hero Title + Subtitle */}
      <div className="text-center mt-6 mb-16">
        <VoiceHero />
        <p className="text-gray-400 text-lg mt-4">
          Speak your command to interact with the system.
        </p>
      </div>

      {/* Cards + Mic Row */}
      <div className="flex flex-col sm:flex-row gap-10 justify-center items-center mb-16">
        {/* Register Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#111] border border-gray-800 p-6 rounded-xl w-72 shadow-md text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <UserPlus2 className="text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Register</h3>
          </div>
          <p className="text-gray-300 text-sm">
            New to Viggyan? Say <span className="text-blue-400 font-semibold">"Register"</span> to get started.
          </p>
        </motion.div>

        {/* Glowing Mic */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Purple glow background */}
          <motion.div
            animate={{ boxShadow: '0 0 40px 10px rgba(168, 85, 247, 0.3)' }} // purplish glow
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 rounded-full bg-purple-700 blur-2xl opacity-30"
          />
          <div className="relative rounded-full bg-gradient-to-br from-gray-700 to-gray-600 p-6 shadow-xl">
            <Mic className="h-10 w-10 text-white" />
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#111] border border-gray-800 p-6 rounded-xl w-72 shadow-md text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Key className="text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Login</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Say <span className="text-blue-400 font-semibold">"Login"</span> to authenticate with face recognition.
          </p>
        </motion.div>
      </div>

      {/* Assist Info Card at Bottom */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="w-full max-w-2xl bg-[#111] border border-gray-800 rounded-2xl p-6 text-center shadow-md"
      >
        <div className="flex justify-center items-center gap-2 mb-3">
          <HelpCircle className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Need Help Choosing a Book?</h2>
        </div>
        <p className="text-gray-300 text-sm">
          Say <span className="text-blue-400 font-semibold">"Assist"</span> and our AI librarian will suggest the best books for your subject.
        </p>
      </motion.div>
    </div>
  )
}
