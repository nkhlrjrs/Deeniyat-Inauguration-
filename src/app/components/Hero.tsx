'use client';

import { useState, useEffect, useRef } from 'react';

const ROTATING_WORDS = ['Governance', 'Education', 'Administration', 'Communication', 'Collaboration'];

const TEXT_LINE_1 = 'A Unified Digital Platform';
const TEXT_LINE_2_PART_1 = 'Deeniyat Designed To Empower';

// Find the longest word for fixed width
const LONGEST_WORD = ROTATING_WORDS.reduce((a, b) => (a.length > b.length ? a : b));

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [visibleLetters, setVisibleLetters] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState<'in' | 'display' | 'out'>('in');
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const targetWord = ROTATING_WORDS[currentWordIndex];
    setCurrentWord(targetWord);

    // Animation sequence
    const runAnimation = async () => {
      // Phase 1: Animate IN
      setPhase('in');
      setVisibleLetters(new Set());

      // Create random order of indices
      const indices = Array.from({ length: targetWord.length }, (_, i) => i);
      const shuffled = shuffleArray([...indices]);

      // Animate letters in randomly
      for (let i = 0; i < shuffled.length; i++) {
        await delay(80 + Math.random() * 40);
        setVisibleLetters(prev => new Set([...prev, shuffled[i]]));
      }

      // Phase 2: Display word
      setPhase('display');
      await delay(2500);

      // Phase 3: Animate OUT
      setPhase('out');

      // Animate letters out in reverse random order
      for (let i = shuffled.length - 1; i >= 0; i--) {
        await delay(60 + Math.random() * 30);
        setVisibleLetters(prev => {
          const newSet = new Set(prev);
          newSet.delete(shuffled[i]);
          return newSet;
        });
      }

      // Move to next word
      setCurrentWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    };

    runAnimation();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentWordIndex]);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-end justify-center pb-32">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/Hero/deeniyat Intro video (1).mov" type="video/mp4" />
      </video>

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* White Gradient Overlay - bottom to top */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-12 leading-tight">
          <div className="whitespace-nowrap">{TEXT_LINE_1}</div>
          <div className="whitespace-nowrap flex items-center justify-center gap-2">
            <span>{TEXT_LINE_2_PART_1}</span>
            <span className="inline-block w-[270px] md:w-[320px] text-left">
              {currentWord.split('').map((letter, index) => (
                <AnimatedLetter
                  key={`${currentWordIndex}-${index}`}
                  letter={letter}
                  isVisible={visibleLetters.has(index)}
                  delay={0}
                />
              ))}
            </span>
          </div>
        </h1>

        {/* CTA Button */}
        <button className="group relative px-8 py-4 bg-white text-black font-semibold text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20">
          <span className="relative z-10">Begin the Experience</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-white/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
        </button>
      </div>
    </section>
  );
}

// Animated Letter Component
function AnimatedLetter({ letter, isVisible, delay }: { letter: string; isVisible: boolean; delay: number }) {
  return (
    <span
      className={`inline-block transition-all duration-500 ease-out ${
        isVisible
          ? 'opacity-100 blur-0 scale-100'
          : 'opacity-0 blur-[8px] scale-95'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {letter === ' ' ? ' ' : letter}
    </span>
  );
}

// Helper function to shuffle array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function for delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
