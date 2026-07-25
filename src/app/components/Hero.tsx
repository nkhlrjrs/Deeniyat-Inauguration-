'use client';

import { useState, useEffect, useRef } from 'react';
import ShinyText from './ShinyText';
import GridPathAnimator from './GridPathAnimator';

const ROTATING_WORDS = ['Governance', 'Education', 'Administration', 'Communication', 'Collaboration'];

const TEXT_LINE_1 = 'A Unified Digital Platform';
const TEXT_LINE_2_PART_1 = 'Deeniyat Designed To Empower';

// Find the longest word for fixed width
const LONGEST_WORD = ROTATING_WORDS.reduce((a, b) => (a.length > b.length ? a : b));

// Section 2 content
const SECTION_2_TITLE = 'Why Deeniyath Digital Platform?';
const SECTION_2_BODY = 'The Deeniyat Digital Platform brings every operational, academic, and administrative responsibility together into one centralized ecosystem—creating a seamless flow of information, collaboration, and decision-making across the organization.';

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [visibleLetters, setVisibleLetters] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState<'in' | 'display' | 'out'>('in');
  const animationRef = useRef<number | null>(null);

  // Initial load animation states
  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [line1Visible, setLine1Visible] = useState<Set<number>>(new Set());
  const [line2Visible, setLine2Visible] = useState<Set<number>>(new Set());
  const [buttonVisible, setButtonVisible] = useState(false);

  // Section 2 states
  const [showSection2, setShowSection2] = useState(false);
  const [section2TitleVisible, setSection2TitleVisible] = useState<Set<number>>(new Set());
  const [section2BodyVisible, setSection2BodyVisible] = useState<Set<number>>(new Set());
  const [bgTransition, setBgTransition] = useState(false);

  useEffect(() => {
    // Initial page load animation
    const runInitialAnimation = async () => {
      // Animate LINE 1
      const line1Indices = Array.from({ length: TEXT_LINE_1.length }, (_, i) => i);
      const line1Shuffled = shuffleArray([...line1Indices]);
      for (let i = 0; i < line1Shuffled.length; i++) {
        await delay(50 + Math.random() * 30);
        setLine1Visible(prev => new Set([...prev, line1Shuffled[i]]));
      }

      // Small pause before line 2
      await delay(300);

      // Animate LINE 2
      const line2Indices = Array.from({ length: TEXT_LINE_2_PART_1.length }, (_, i) => i);
      const line2Shuffled = shuffleArray([...line2Indices]);
      for (let i = 0; i < line2Shuffled.length; i++) {
        await delay(50 + Math.random() * 30);
        setLine2Visible(prev => new Set([...prev, line2Shuffled[i]]));
      }

      // Show button after text
      await delay(200);
      setButtonVisible(true);
      setInitialAnimDone(true);
    };

    runInitialAnimation();
  }, []);

  useEffect(() => {
    // Only start rotating word animation after initial animation is done AND not showing section 2
    if (!initialAnimDone || showSection2) return;

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
  }, [currentWordIndex, initialAnimDone, showSection2]);

  // Handle transition to Section 2
  const handleBeginExperience = async () => {
    // Fade out section 1 elements
    setLine1Visible(new Set());
    setLine2Visible(new Set());
    setVisibleLetters(new Set());
    setButtonVisible(false);

    // Start background transition
    setBgTransition(true);

    // Wait for fade out
    await delay(600);

    // Show section 2
    setShowSection2(true);

    // Animate Section 2 title and body simultaneously - no delays
    const titleIndices = Array.from({ length: SECTION_2_TITLE.length }, (_, i) => i);
    const titleShuffled = shuffleArray([...titleIndices]);

    const bodyWords = SECTION_2_BODY.split(' ');
    const wordIndices = Array.from({ length: bodyWords.length }, (_, i) => i);
    const wordShuffled = shuffleArray([...wordIndices]);

    // Animate title and body in parallel with minimal delay
    for (let i = 0; i < Math.max(titleShuffled.length, wordShuffled.length); i++) {
      await delay(30);
      if (i < titleShuffled.length) {
        setSection2TitleVisible(prev => new Set([...prev, titleShuffled[i]]));
      }
      if (i < wordShuffled.length) {
        setSection2BodyVisible(prev => new Set([...prev, wordShuffled[i]]));
      }
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-end justify-center pb-32">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          bgTransition ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <source src="/Hero/deeniyat Intro video (1).mov" type="video/mp4" />
      </video>

      {/* Solid Background for Section 2 */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          bgTransition ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundColor: '#0A1811' }}
      />

      {/* Dark Overlay for better text readability */}
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-700 ${
        bgTransition ? 'opacity-0' : 'opacity-100'
      }`} />

      {/* Black Gradient Overlay - bottom to top */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-700 ${
        bgTransition ? 'opacity-0' : 'opacity-100'
      }`} />

      {/* Grid Lines Overlay */}
      <div className="grid-lines" />

      {/* Random Grid Path Animation */}
      <GridPathAnimator />

      {/* Content - Section 1 */}
      {!showSection2 && (
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-12 leading-tight">
            {/* Line 1 with animation */}
            <div className="whitespace-nowrap">
              {TEXT_LINE_1.split('').map((letter, index) => (
                <AnimatedLetter
                  key={`line1-${index}`}
                  letter={letter}
                  isVisible={line1Visible.has(index)}
                  delay={0}
                />
              ))}
            </div>
            {/* Line 2 with animation */}
            <div className="whitespace-nowrap flex items-center justify-center gap-2">
              <span>
                {TEXT_LINE_2_PART_1.split('').map((letter, index) => (
                  <AnimatedLetter
                    key={`line2-${index}`}
                    letter={letter}
                    isVisible={line2Visible.has(index)}
                    delay={0}
                  />
                ))}
              </span>
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
          <button
            onClick={handleBeginExperience}
            className={`group relative px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 font-light text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 ${buttonVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} gradient-border-button`}
          >
            {/* Gradient Border */}
            <div className="gradient-border" />
            {/* Starfield Effect - Sparkling dots inside button */}
            <span className="starfield absolute inset-0 pointer-events-none z-0">
              <span className="star" style={{ '--x': '10%', '--y': '15%', '--delay': '0s' } as React.CSSProperties} />
              <span className="star" style={{ '--x': '85%', '--y': '20%', '--delay': '0.5s' } as React.CSSProperties} />
              <span className="star" style={{ '--x': '25%', '--y': '70%', '--delay': '1s' } as React.CSSProperties} />
              <span className="star" style={{ '--x': '75%', '--y': '75%', '--delay': '1.5s' } as React.CSSProperties} />
              <span className="star" style={{ '--x': '45%', '--y': '30%', '--delay': '2s' } as React.CSSProperties} />
              <span className="star" style={{ '--x': '60%', '--y': '60%', '--delay': '0.3s' } as React.CSSProperties} />
              <span className="star" style={{ '--x': '15%', '--y': '45%', '--delay': '0.8s' } as React.CSSProperties} />
              <span className="star" style={{ '--x': '90%', '--y': '50%', '--delay': '1.3s' } as React.CSSProperties} />
            </span>

            <span className="relative z-10 flex items-center gap-3 text-white uppercase">
              <ShinyText
                text="Begin the Experience"
                speed={2.5}
                color="#e0e0e0"
                shineColor="#ffffff"
                spread={150}
                direction="right"
              />
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
          </button>
        </div>
      )}

      {/* Content - Section 2 */}
      {showSection2 && (
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
          <div className="text-center max-w-[1600px] mx-auto">
            {/* Title with gradient text */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                {SECTION_2_TITLE.split('').map((letter, index) => (
                  <AnimatedLetter
                    key={`s2-title-${index}`}
                    letter={letter}
                    isVisible={section2TitleVisible.has(index)}
                    delay={0}
                  />
                ))}
              </span>
            </h2>

            {/* Body text */}
            <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-white/90 max-w-[1600px] mx-auto">
              {SECTION_2_BODY.split(' ').map((word, wordIndex) => (
                <AnimatedWord
                  key={`s2-word-${wordIndex}`}
                  word={word}
                  isVisible={section2BodyVisible.has(wordIndex)}
                />
              ))}
            </p>
          </div>
        </div>
      )}
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

// Animated Word Component
function AnimatedWord({ word, isVisible }: { word: string; isVisible: boolean }) {
  return (
    <span
      className={`inline-block transition-all duration-500 ease-out mr-[0.25em] ${
        isVisible
          ? 'opacity-100 blur-0 translate-y-0'
          : 'opacity-0 blur-[4px] translate-y-2'
      }`}
    >
      {word}
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
