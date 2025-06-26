'use client';

import { useEffect, useState } from 'react';

const phrases = ['Viggyan', 'AI-Powered Library', 'Voice Input System'];

export default function VoiceHero() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (charIdx < phrases[index].length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + phrases[index][charIdx]);
        setCharIdx(charIdx + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setText('');
        setCharIdx(0);
        setIndex((prev) => (prev + 1) % phrases.length);
      }, 1500);
      return () => clearTimeout(pause);
    }
  }, [charIdx, index]);

  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-100 to-white bg-clip-text text-transparent tracking-wide">
      {text}
      <span className="text-white animate-pulse">|</span>
    </h1>
  );
}
