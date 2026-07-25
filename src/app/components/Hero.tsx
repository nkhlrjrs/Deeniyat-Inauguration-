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
const SECTION_2_EYEBROW = 'Building a Better Digital Foundation for Deeniyath';
const SECTION_2_TITLE = 'Why Deeniyath Digital Platform?';
const SECTION_2_BODY = 'As Deeniyath grows, the way we manage institutions, academics, learning, communication and organizational activities must grow with it.';
const SECTION_2_BODY_2 = 'The Deeniyath Digital Platform is being developed to simplify everyday processes, improve coordination across organizational levels, and provide timely access to information for everyone involved in the educational ecosystem.';

// Section 3 (Ecosystem) content — third scroll step
const ECO_HEADLINE = 'One Connected Deeniyath Ecosystem';
const ECO_SUB = 'One platform connecting every level of the Deeniyath educational network.';
const ECO_NODES = [
  { title: 'Central Board', body: 'Governance, standards, oversight and centralized administration.' },
  { title: 'Zones', body: 'Coordination, monitoring, institutional support and field activities.' },
  { title: 'Institutions', body: 'Academic and administrative operations at the madrasa level.' },
];
const ECO_LEAVES = ['Muallims', 'Students', 'Parents'];
const ECO_TOTAL_STEPS = 9;

// Section 4 (Capabilities) — horizontal filmstrip, steps 3–7
const CAP_HEADLINE = 'Bringing Deeniyath Operations Together';
const CAP_CARDS = [
  { title: 'Administration & Governance', sub: 'Institution, zone, student, teacher and organizational management through a structured central platform.', img: '/capablities/Administration & Governance.png' },
  { title: 'Academics & Learning', sub: 'Academic structures, learning materials, assignments, assessments, examinations and student progress.', img: '/capablities/Academics & Learning.png' },
  { title: 'Attendance & Assessments', sub: 'Simplified attendance marking, assessment management, evaluation and academic performance tracking.', img: '/capablities/Attendance & Assessments.png' },
  { title: 'Amal Chart & Activities', sub: 'Planning, recording and monitoring organizational activities across institutions and zones.', img: '/capablities/Amal Chart & Activities.png' },
  { title: 'Institution Visits & Inspections', sub: 'Structured field visits for Zone Administrators and Muavins, including observations, inspection records and follow-up.', img: '/capablities/Institution Visits & Inspections.png' },
  { title: 'Fees & Institutional Operations', sub: 'Fee management and essential institutional operations, including store and inventory management.', img: '/capablities/Fees & Institutional Operations.png' },
  { title: 'Communication & Parent Engagement', sub: 'Circulars, notifications, academic updates and better communication between institutions and families.', img: '/capablities/Communication & Parent Engagement.png' },
  { title: 'Reports & Insights', sub: 'Relevant information and consolidated reporting to support monitoring and informed decision-making.', img: '/capablities/Reports & Insights.png' },
];
// Tasteful abstract gradient placeholders (one per card), cohesive with the deep-green brand
const CAP_GRADIENTS = [
  'radial-gradient(120% 90% at 15% 12%, rgba(255,255,255,0.30), transparent 55%), linear-gradient(135deg, #0F5A45 0%, #0A2E24 100%)',
  'radial-gradient(120% 90% at 18% 10%, rgba(255,255,255,0.28), transparent 55%), linear-gradient(135deg, #1E3A5F 0%, #0E1B33 100%)',
  'radial-gradient(120% 90% at 15% 12%, rgba(255,255,255,0.30), transparent 55%), linear-gradient(135deg, #B4632A 0%, #5A2E14 100%)',
  'radial-gradient(120% 90% at 18% 10%, rgba(255,255,255,0.28), transparent 55%), linear-gradient(135deg, #0E7C7B 0%, #08302F 100%)',
  'radial-gradient(120% 90% at 15% 12%, rgba(255,255,255,0.30), transparent 55%), linear-gradient(135deg, #3E5C1E 0%, #1B2A0E 100%)',
  'radial-gradient(120% 90% at 18% 10%, rgba(255,255,255,0.26), transparent 55%), linear-gradient(135deg, #4A3A7A 0%, #211A3A 100%)',
  'radial-gradient(120% 90% at 15% 12%, rgba(255,255,255,0.30), transparent 55%), linear-gradient(135deg, #2A6FB0 0%, #123152 100%)',
  'radial-gradient(120% 90% at 18% 10%, rgba(255,255,255,0.28), transparent 55%), linear-gradient(135deg, #A03A55 0%, #4A1A28 100%)',
];
// Each frame shows a left + right column; a column is either the text block or a card index
const CAP_FRAMES: { left: { kind: 'text' } | { kind: 'card'; i: number }; right: { kind: 'text' } | { kind: 'card'; i: number } }[] = [
  { left: { kind: 'text' }, right: { kind: 'card', i: 0 } },
  { left: { kind: 'card', i: 1 }, right: { kind: 'card', i: 2 } },
  { left: { kind: 'card', i: 3 }, right: { kind: 'card', i: 4 } },
  { left: { kind: 'card', i: 5 }, right: { kind: 'card', i: 6 } },
  { left: { kind: 'card', i: 7 }, right: { kind: 'text' } },
];
const CAP_LAST_STEP = 7; // bodyIndex clamp ceiling (2 = ecosystem, 3..7 = capability frames)

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
  const [section2EyebrowVisible, setSection2EyebrowVisible] = useState<Set<number>>(new Set());
  const [section2TitleVisible, setSection2TitleVisible] = useState<Set<number>>(new Set());
  const [section2BodyVisible, setSection2BodyVisible] = useState<Set<number>>(new Set());
  const [bgTransition, setBgTransition] = useState(false);
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(false);

  // Section 2 scroll-driven step (0 = body 1, 1 = body 2, 2 = ecosystem)
  const [bodyIndex, setBodyIndex] = useState(0);
  const bodyScrollLock = useRef(false);

  // Staged reveal for the ecosystem flowchart (step 2)
  const [ecoStep, setEcoStep] = useState(0);

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

  // Scroll / swipe drives the body swap once Section 2 is visible
  useEffect(() => {
    if (!showSection2) return;

    const step = (dir: number) => {
      if (bodyScrollLock.current) return;
      setBodyIndex(prev => {
        const next = Math.min(CAP_LAST_STEP, Math.max(0, prev + dir));
        if (next !== prev) {
          bodyScrollLock.current = true;
          setTimeout(() => { bodyScrollLock.current = false; }, 850);
        }
        return next;
      });
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      step(e.deltaY > 0 ? 1 : -1);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      const dy = touchStartY - e.touches[0].clientY;
      if (Math.abs(dy) > 40) {
        step(dy > 0 ? 1 : -1);
        touchStartY = e.touches[0].clientY;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [showSection2]);

  // Drive the flowchart reveal once step 2 is active; reset when leaving so it replays
  useEffect(() => {
    if (bodyIndex !== 2) {
      setEcoStep(0);
      return;
    }
    let cancelled = false;
    let s = 0;
    const tick = () => {
      if (cancelled) return;
      s += 1;
      setEcoStep(s);
      if (s < ECO_TOTAL_STEPS) setTimeout(tick, 380);
    };
    const start = setTimeout(tick, 200);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, [bodyIndex]);

  // Position / opacity for each stacked body paragraph based on the active index
  const bodyStyle = (i: number): React.CSSProperties => {
    const rel = i - bodyIndex;
    return {
      transform: `translateY(${rel * 40}px)`,
      opacity: rel === 0 ? 1 : 0,
      filter: rel === 0 ? 'blur(0px)' : 'blur(4px)',
      pointerEvents: rel === 0 ? 'auto' : 'none',
    };
  };

  // Capabilities filmstrip (steps 3–7)
  const inCaps = bodyIndex >= 3;
  const capFrame = Math.max(0, bodyIndex - 3);

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

    // Animate Section 2 eyebrow, title and body simultaneously - no delays
    const eyebrowIndices = Array.from({ length: SECTION_2_EYEBROW.length }, (_, i) => i);
    const eyebrowShuffled = shuffleArray([...eyebrowIndices]);

    const titleIndices = Array.from({ length: SECTION_2_TITLE.length }, (_, i) => i);
    const titleShuffled = shuffleArray([...titleIndices]);

    const bodyWords = SECTION_2_BODY.split(' ');
    const wordIndices = Array.from({ length: bodyWords.length }, (_, i) => i);
    const wordShuffled = shuffleArray([...wordIndices]);

    // Animate eyebrow, title and body in parallel with minimal delay
    for (let i = 0; i < Math.max(eyebrowShuffled.length, titleShuffled.length, wordShuffled.length); i++) {
      await delay(30);
      if (i < eyebrowShuffled.length) {
        setSection2EyebrowVisible(prev => new Set([...prev, eyebrowShuffled[i]]));
      }
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
        <div className="absolute inset-0 z-10 px-4">
          {/* Layer 1: intro text (steps 0–1) */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
              bodyIndex >= 2 ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
            }`}
          >
            <div className="text-center max-w-[1600px] mx-auto">
            {/* Title with gradient text */}
            <h2 className="text-base md:text-lg lg:text-xl font-light uppercase mb-0 leading-tight">
              {SECTION_2_TITLE.split('').map((letter, index) => (
                <AnimatedLetter
                  key={`s2-title-${index}`}
                  letter={letter}
                  isVisible={section2TitleVisible.has(index)}
                  delay={0}
                  className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent"
                />
              ))}
            </h2>

            {/* Eyebrow text below the title */}
            <p className="text-xl md:text-2xl lg:text-3xl font-light tracking-wide text-white/60 mb-8">
              {SECTION_2_EYEBROW.split('').map((letter, index) => (
                <AnimatedLetter
                  key={`s2-eyebrow-${index}`}
                  letter={letter}
                  isVisible={section2EyebrowVisible.has(index)}
                  delay={0}
                />
              ))}
            </p>

            {/* Body text — two paragraphs stacked, swapped on scroll */}
            <div className="relative mx-auto w-full max-w-[1800px]" style={{ minHeight: 'clamp(180px, 24vh, 300px)' }}>
              {/* Body 1 */}
              <p
                className="absolute inset-x-0 top-0 text-2xl md:text-3xl lg:text-4xl font-light leading-snug text-white/90 transition-all duration-700 ease-out"
                style={bodyStyle(0)}
              >
                {SECTION_2_BODY.split(' ').map((word, wordIndex) => (
                  <AnimatedWord
                    key={`s2-word-${wordIndex}`}
                    word={word}
                    isVisible={section2BodyVisible.has(wordIndex)}
                  />
                ))}
              </p>
              {/* Body 2 */}
              <p
                className="absolute inset-x-0 top-0 text-2xl md:text-3xl lg:text-4xl font-light leading-snug text-white/90 transition-all duration-700 ease-out"
                style={bodyStyle(1)}
              >
                {SECTION_2_BODY_2}
              </p>
            </div>
            </div>
          </div>

          {/* Layer 2: ecosystem flowchart (step 2) */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
              bodyIndex === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
            }`}
          >
            <div className="w-full max-w-[1100px] mx-auto flex flex-col items-center text-center px-2">
              {/* Headline */}
              <h2
                className={`text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-2 transition-all duration-700 ease-out ${
                  ecoStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {ECO_HEADLINE}
              </h2>
              {/* Subheadline */}
              <p
                className={`text-sm md:text-base text-white/60 mb-6 md:mb-8 transition-all duration-700 ease-out ${
                  ecoStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {ECO_SUB}
              </p>

              {/* Flowchart */}
              <div className="flex flex-col items-center w-full">
                <EcoBox title={ECO_NODES[0].title} body={ECO_NODES[0].body} show={ecoStep >= 3} />
                <VLine show={ecoStep >= 4} />
                <EcoBox title={ECO_NODES[1].title} body={ECO_NODES[1].body} show={ecoStep >= 5} />
                <VLine show={ecoStep >= 6} />
                <EcoBox title={ECO_NODES[2].title} body={ECO_NODES[2].body} show={ecoStep >= 7} />

                {/* Branch splitting into three */}
                <div className="w-full max-w-[720px]">
                  <div className="relative h-8 md:h-10 w-full">
                    {/* stem */}
                    <div
                      className="absolute left-1/2 top-0 h-4 w-px bg-gradient-to-b from-white/40 to-white/20 origin-top transition-transform duration-300 ease-out"
                      style={{ transform: `translateX(-50%) scaleY(${ecoStep >= 8 ? 1 : 0})` }}
                    />
                    {/* horizontal bus */}
                    <div
                      className="absolute top-4 left-[16.666%] right-[16.666%] h-px bg-white/30 origin-center transition-transform duration-300 ease-out"
                      style={{ transform: `scaleX(${ecoStep >= 8 ? 1 : 0})`, transitionDelay: ecoStep >= 8 ? '150ms' : '0ms' }}
                    />
                    {/* three drops down to the leaf boxes */}
                    {['16.666%', '50%', '83.333%'].map((leftPos, i) => (
                      <div
                        key={`eco-drop-${i}`}
                        className="absolute top-4 h-4 w-px bg-gradient-to-b from-white/30 to-white/20 origin-top transition-transform duration-300 ease-out"
                        style={{ left: leftPos, transform: `translateX(-50%) scaleY(${ecoStep >= 8 ? 1 : 0})`, transitionDelay: ecoStep >= 8 ? '300ms' : '0ms' }}
                      />
                    ))}
                  </div>

                  {/* Leaf boxes */}
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    {ECO_LEAVES.map((leaf, i) => (
                      <EcoLeaf key={leaf} label={leaf} show={ecoStep >= 9} delay={i * 100} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content - Section 4: Capabilities horizontal filmstrip (steps 3–7) */}
      {showSection2 && (
        <>
          {/* White background that "splits in" as vertical panels */}
          <div className="absolute inset-0 z-[12] pointer-events-none overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`cap-panel-${i}`}
                className="absolute top-0 h-full bg-white"
                style={{
                  left: `${(i * 100) / 6}%`,
                  width: `${100 / 6 + 0.2}%`,
                  transform: inCaps ? 'translateY(0)' : `translateY(${i % 2 === 0 ? '-' : ''}102%)`,
                  opacity: inCaps ? 1 : 0,
                  transition: `transform 800ms cubic-bezier(0.22,1,0.36,1) ${i * 70}ms, opacity 500ms ease ${i * 70}ms`,
                }}
              />
            ))}
          </div>

          {/* Grid lines recolored dark for the white section */}
          <div
            className="grid-lines grid-lines--dark z-[13]"
            style={{ opacity: inCaps ? 1 : 0, transition: 'opacity 700ms ease 350ms' }}
          />

          {/* Central divider line */}
          <div
            className="absolute top-0 bottom-0 left-1/2 w-px z-[14] pointer-events-none"
            style={{
              background: 'rgba(10,24,17,0.14)',
              opacity: inCaps ? 1 : 0,
              transition: 'opacity 600ms ease 400ms',
            }}
          />

          {/* Horizontal carousel */}
          <div
            className="absolute inset-0 z-20 overflow-hidden"
            style={{
              opacity: inCaps ? 1 : 0,
              pointerEvents: inCaps ? 'auto' : 'none',
              transition: 'opacity 500ms ease 300ms',
            }}
          >
            <div
              className="flex h-full"
              style={{
                transform: `translateX(calc(-${capFrame} * 100vw))`,
                transition: 'transform 850ms cubic-bezier(0.7,0,0.2,1)',
              }}
            >
              {CAP_FRAMES.map((frame, fi) => {
                const active = inCaps && capFrame === fi;
                return (
                  <div key={`cap-frame-${fi}`} className="flex h-full w-screen shrink-0">
                    <div className="flex h-full w-1/2 items-center justify-center px-6 md:px-10">
                      <CapReveal show={active} delay={0}>
                        {frame.left.kind === 'text' ? (
                          <CapText />
                        ) : (
                          <CapCard card={CAP_CARDS[frame.left.i]} gradient={CAP_GRADIENTS[frame.left.i]} />
                        )}
                      </CapReveal>
                    </div>
                    <div className="flex h-full w-1/2 items-center justify-center px-6 md:px-10">
                      <CapReveal show={active} delay={150}>
                        {frame.right.kind === 'text' ? (
                          <CapText />
                        ) : (
                          <CapCard card={CAP_CARDS[frame.right.i]} gradient={CAP_GRADIENTS[frame.right.i]} />
                        )}
                      </CapReveal>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

// Capabilities entrance wrapper — blur → focus, fade in, rise up from below
function CapReveal({ show, delay = 0, children }: { show: boolean; delay?: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        filter: show ? 'blur(0px)' : 'blur(12px)',
        transform: show ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 650ms ease ${delay}ms, filter 650ms ease ${delay}ms, transform 750ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Capabilities text block (CAPABILITIES eyebrow + headline)
function CapText() {
  return (
    <div className="max-w-[560px] text-left">
      <span className="block text-xs md:text-sm font-semibold uppercase tracking-[0.28em] text-[#0A1811]/45 mb-4 md:mb-6">
        Capabilities
      </span>
      <h3
        className="font-medium tracking-tight text-[#0A1811]"
        style={{ fontSize: 'clamp(2.25rem, 4.6vw, 4.75rem)', lineHeight: 1.05 }}
      >
        {CAP_HEADLINE}
      </h3>
    </div>
  );
}

// Capabilities card — background image with overlaid headline + subheadline
function CapCard({ card, gradient }: { card: { title: string; sub: string; img: string }; gradient: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-[0_30px_60px_-25px_rgba(10,24,17,0.55)]"
      style={{ width: 'min(40vw, 640px, 94vh)', aspectRatio: '3 / 2', background: gradient }}
    >
      {/* background image (gradient above shows while it loads) */}
      <img
        src={encodeURI(card.img)}
        alt=""
        aria-hidden
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* black overlay: 100% at bottom → 0% at top */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)' }}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <h4
          className="font-semibold leading-tight text-white"
          style={{ fontSize: 'clamp(1.25rem, 2vw, 2.1rem)' }}
        >
          {card.title}
        </h4>
        <p
          className="mt-2 text-white/80 max-w-[92%]"
          style={{ fontSize: 'clamp(0.8rem, 1vw, 1.05rem)', lineHeight: 1.4 }}
        >
          {card.sub}
        </p>
      </div>
    </div>
  );
}

// Animated Letter Component
function AnimatedLetter({ letter, isVisible, delay, className = '' }: { letter: string; isVisible: boolean; delay: number; className?: string }) {
  return (
    <span
      className={`inline-block transition-all duration-500 ease-out ${className} ${
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

// Ecosystem flowchart node box
function EcoBox({ title, body, show }: { title: string; body: string; show: boolean }) {
  return (
    <div
      className={`group relative w-full max-w-[560px] overflow-hidden rounded-2xl px-7 py-5 text-center transition-all duration-500 ease-out ${
        show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
      }`}
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.035) 100%)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow:
          '0 10px 30px -12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* soft top glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 -top-16 h-40 w-40 -translate-x-1/2 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.30) 0%, transparent 70%)' }}
      />
      <h4 className="relative text-2xl md:text-3xl font-semibold tracking-tight text-white">{title}</h4>
      <p className="relative mt-1.5 text-base md:text-lg leading-snug text-white/60">{body}</p>
    </div>
  );
}

// Vertical connector that draws downward
function VLine({ show }: { show: boolean }) {
  return (
    <div
      className="h-5 md:h-6 w-px bg-gradient-to-b from-white/40 to-white/15 origin-top transition-transform duration-500 ease-out"
      style={{ transform: `scaleY(${show ? 1 : 0})` }}
    />
  );
}

// Ecosystem leaf box (Muallims / Students / Parents)
function EcoLeaf({ label, show, delay }: { label: string; show: boolean; delay: number }) {
  return (
    <div
      className={`group relative flex items-center justify-center overflow-hidden rounded-xl px-4 py-4 transition-all duration-500 ease-out ${
        show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
      }`}
      style={{
        transitionDelay: show ? `${delay}ms` : '0ms',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow:
          '0 8px 24px -14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.16)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* top accent line */}
      <span
        aria-hidden
        className="absolute left-1/2 top-0 h-0.5 w-10 -translate-x-1/2 rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent, #34D399, transparent)' }}
      />
      <span className="relative text-xl md:text-2xl font-medium tracking-tight text-white">{label}</span>
    </div>
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
