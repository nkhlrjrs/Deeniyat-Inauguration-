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
const SECTION_2_EYEBROW = 'Building a Better Digital Foundation for Deeniyat';
const SECTION_2_TITLE = 'Why Deeniyat Digital Platform?';
const SECTION_2_BODY = 'As Deeniyat grows, the way we manage institutions, academics, learning, communication and organizational activities must grow with it.';
const SECTION_2_BODY_2 = 'The Deeniyat Digital Platform is being developed to simplify everyday processes, improve coordination across organizational levels, and provide timely access to information for everyone involved in the educational ecosystem.';

// Section 3 (Ecosystem) content — third scroll step
const ECO_HEADLINE = 'One Connected Deeniyat Ecosystem';
const ECO_SUB = 'One platform connecting every level of the Deeniyat educational network.';
// Flowchart tree: root → { Institution ERP with LMS → (Teacher App, Parent App), Public Services }
const ECO_ROOT = {
  title: 'Central Governance Board ERP',
  sub: 'Governance • Monitoring • Administration',
};
const ECO_L1 = [
  { title: 'Institution ERP with LMS', sub: 'Academic • Administration • Learning' },
  { title: 'Public Services', sub: 'Registrations • Results' },
];
const ECO_L2 = [
  { title: 'Teacher App', sub: 'Teaching • Academics • Communication' },
  { title: 'Parent App', sub: 'Child Progress • Communication' },
];
const ECO_TOTAL_STEPS = 7;

// Section 4 (Capabilities) — horizontal filmstrip, steps 3–7
const CAP_HEADLINE = 'Bringing Deeniyat Operations Together';
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
const CAP_LAST_STEP = 7; // last capability frame step (2 = ecosystem, 3..7 = capability frames)

// Section 5 (Progress statement) — step 8, dark charcoal with animated blueprint grid
const PROGRESS_STEP = 8;
// Technology partner — step 9, left text swaps within the "Built for Deeniyat" section
const PARTNER_STEP = 9;
const PARTNER_HEAD = 'Technology Partner';
const PARTNER_BODY =
  'Developing in partnership with Techno Alliance, bringing nearly three decades of experience, a visionary legacy, and proven expertise in technology and educational solutions.';
// Section 6 (Developer / build) — step 10, dark with golden-ratio blueprint geometry
const DEV_STEP = 10;
const DEV_LABEL = 'PARTICIPATION';
const DEV_BODY =
  'The people who manage institutions and teach students every day understand the practical needs of Deeniyat best. As the platform develops, feedback from management teams, Muallims and other stakeholders will help us understand existing challenges and identify opportunities for improvement.';
const DEV_EMPHASIS = 'Your Experience Matters.';
const DEV_QUESTIONS = [
  'What takes too much time today?',
  'What processes can be made simpler?',
  'Where can technology support you better?',
  'What should we consider while building the platform?',
];
// Logarithmic (golden) spiral path, grown outward from a centre — deterministic, no randomness
function goldenSpiralPath(cx: number, cy: number, startR: number, turns: number) {
  const b = Math.log(1.6180339887) / (Math.PI / 2);
  const steps = 260;
  const maxT = turns * 2 * Math.PI;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * maxT;
    const r = startR * Math.exp(b * t);
    pts.push(`${(cx + r * Math.cos(t)).toFixed(1)},${(cy + r * Math.sin(t)).toFixed(1)}`);
  }
  return 'M' + pts.join(' L');
}
const DEV_SPIRAL = goldenSpiralPath(910, 470, 7, 2.55);
// Crosshair "+" tick positions on the blueprint (viewBox 1440×900)
const DEV_TICKS = [
  [470, 130], [910, 90], [1180, 300], [470, 450], [910, 450],
  [1250, 620], [660, 690], [910, 810],
];

// Section 7 (Scale / vision) — step 10, isometric circuit cube; seamless shift from Section 6
const NEXT_STEP = 11; // bodyIndex clamp ceiling
const S7_LABEL = 'A New Digital Journey Begins';
const S7_BODY =
  'Technology will continue to evolve. Our purpose remains the same — supporting education, institutions and the people who serve them.';
const S7_TITLE = 'Deeniyat Digital Platform';
// Rotating headline cycles through these phrases in a loop (same letter-scramble as Section 1)
const S7_ROTATING = [
  'Connecting institutions.',
  'Supporting education.',
  'Building for the future.',
];
// Deterministic isometric nested-cube geometry for the Section 7 hero graphic (viewBox 1440×900)
const S7_CUBE = (() => {
  const cx = 960, cy = 356, w = 205, h = 115, vh = 236;
  // top face corners: back, right, front, left
  const top: number[][] = [
    [cx, cy - h], [cx + w, cy], [cx, cy + h], [cx - w, cy],
  ];
  const corners: number[][] = [...top, ...top.map(([x, y]) => [x, y + vh])];
  const C = [cx, cy + vh / 2];
  const inner: number[][] = corners.map(([x, y]) => [
    +(C[0] + (x - C[0]) * 0.5).toFixed(1),
    +(C[1] + (y - C[1]) * 0.5).toFixed(1),
  ]);
  const edges: number[][] = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
  const faces = {
    top: [corners[0], corners[1], corners[2], corners[3]],
    left: [corners[3], corners[2], corners[6], corners[7]],
    right: [corners[1], corners[2], corners[6], corners[5]],
  };
  const nodeIdx = [1, 2, 3, 5, 6, 7]; // front-facing corners get glowing nodes
  return { corners, inner, edges, faces, nodeIdx };
})();
const polyPts = (arr: number[][]) => arr.map((p) => p.join(',')).join(' ');
// A full-circle path (two arcs) so the dot-trail can travel around it, pathLength-normalised
function circlePath(cx: number, cy: number, r: number) {
  return `M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0`;
}
// Fading trail of dots travelling along a path (leading dot brightest → faint tail)
const PG_TRACE_DOTS = [
  { delay: 0.48, size: 1.6, opacity: 0.08 },
  { delay: 0.42, size: 1.8, opacity: 0.12 },
  { delay: 0.36, size: 2.0, opacity: 0.18 },
  { delay: 0.30, size: 2.2, opacity: 0.26 },
  { delay: 0.24, size: 2.4, opacity: 0.36 },
  { delay: 0.18, size: 2.7, opacity: 0.48 },
  { delay: 0.12, size: 3.0, opacity: 0.62 },
  { delay: 0.06, size: 3.3, opacity: 0.78 },
  { delay: 0.0, size: 3.6, opacity: 0.95 },
];
function TraceDots({ d, dur, playing, dim = 1 }: { d: string; dur: number; playing: boolean; dim?: number }) {
  return (
    <>
      {PG_TRACE_DOTS.map((dot, i) => (
        <path
          key={`td-${i}`}
          d={d}
          fill="none"
          stroke={`rgba(110,231,183,${(dot.opacity * dim).toFixed(3)})`}
          strokeWidth={dot.size}
          strokeLinecap="round"
          pathLength={1}
          style={{
            strokeDasharray: '0.0001 0.9999',
            animation: `pg-trace ${dur}s linear ${(dot.delay - dur).toFixed(2)}s infinite`,
            animationPlayState: playing ? 'running' : 'paused',
          }}
        />
      ))}
    </>
  );
}
const PG_HIGHLIGHT = 'BUILT FOR DEENIYAT';
const PG_CELL = 96; // grid cell size in px
const PG_V_LINES = 10; // vertical blueprint lines (anchored to the right edge)
const PG_H_LINES = 13; // horizontal blueprint lines
// Scattered blue accent segments along the grid ({ d: orientation, c: cell from right, r: cell from top })
const PG_BLUE: { d: 'h' | 'v'; c: number; r: number }[] = [
  { d: 'v', c: 1, r: 0 }, { d: 'h', c: 4, r: 1 }, { d: 'v', c: 8, r: 1 }, { d: 'h', c: 2, r: 2 },
  { d: 'v', c: 5, r: 3 }, { d: 'h', c: 7, r: 3 }, { d: 'h', c: 3, r: 4 }, { d: 'v', c: 9, r: 4 },
  { d: 'v', c: 2, r: 5 }, { d: 'h', c: 6, r: 6 }, { d: 'v', c: 4, r: 7 }, { d: 'h', c: 8, r: 7 },
  { d: 'h', c: 1, r: 8 }, { d: 'v', c: 7, r: 8 }, { d: 'v', c: 3, r: 9 }, { d: 'h', c: 5, r: 10 },
  { d: 'v', c: 9, r: 10 }, { d: 'h', c: 2, r: 11 }, { d: 'v', c: 6, r: 11 }, { d: 'h', c: 4, r: 12 },
];

// Ecosystem ring — six labelled nodes evenly spaced around a slowly rotating circle
const PG_NODES: { label: string; icon: 'board' | 'zones' | 'institutions' | 'muallims' | 'students' | 'parents' }[] = [
  { label: 'Board', icon: 'board' },
  { label: 'Zones', icon: 'zones' },
  { label: 'Institutions', icon: 'institutions' },
  { label: 'Muallims', icon: 'muallims' },
  { label: 'Students', icon: 'students' },
  { label: 'Parents', icon: 'parents' },
];

function RingIcon({ name }: { name: PG_NodeIcon }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'board':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M7 20h10M7 9h4M7 13h7" />
        </svg>
      );
    case 'zones':
      return (
        <svg {...common}>
          <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" />
          <path d="M9 4v14M15 6v14" />
        </svg>
      );
    case 'institutions':
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21V9l7-4 7 4v12" />
          <path d="M9 21v-6h6v6M9 11h.01M15 11h.01" />
        </svg>
      );
    case 'muallims':
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="3" />
          <path d="M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
          <path d="M12 10v3" />
        </svg>
      );
    case 'students':
      return (
        <svg {...common}>
          <path d="M12 4 2 9l10 5 10-5-10-5Z" />
          <path d="M6 11v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4M22 9v5" />
        </svg>
      );
    case 'parents':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="2.6" />
          <circle cx="16" cy="8" r="2.6" />
          <path d="M3 20v-1a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1M13 20v-1a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1" />
        </svg>
      );
  }
}
type PG_NodeIcon = (typeof PG_NODES)[number]['icon'];

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
        const next = Math.min(NEXT_STEP, Math.max(0, prev + dir));
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
  const capFrame = Math.min(CAP_FRAMES.length - 1, Math.max(0, bodyIndex - 3));
  // Progress statement (step 8) — charcoal overlay sits above the white capabilities layer
  const inProgress = bodyIndex >= PROGRESS_STEP;
  // Technology partner (step 9) — left text swaps within the progress layer
  const inPartner = bodyIndex >= PARTNER_STEP;
  // Developer/build section (step 10) — dark golden-ratio overlay above the progress layer
  const inDev = bodyIndex >= DEV_STEP;
  // Scale/vision section (step 11) — isometric cube overlay above the developer layer
  const inNext = bodyIndex >= NEXT_STEP;

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

              {/* Flowchart — root splits into two, then the left child splits into two */}
              <div className="flex w-full flex-col items-center">
                {/* Root */}
                <div className="w-full max-w-[460px]">
                  <EcoBox title={ECO_ROOT.title} sub={ECO_ROOT.sub} show={ecoStep >= 3} />
                </div>

                <div className="w-full max-w-[880px]">
                  {/* First split — from root centre to the two column centres (25% / 75%) */}
                  <FlowSplit show={ecoStep >= 4} />

                  {/* Row 1: Institution ERP with LMS | Public Services */}
                  <div className="grid grid-cols-2 items-start gap-4 md:gap-8">
                    <EcoBox title={ECO_L1[0].title} sub={ECO_L1[0].sub} show={ecoStep >= 5} />
                    <EcoBox title={ECO_L1[1].title} sub={ECO_L1[1].sub} show={ecoStep >= 5} />
                  </div>

                  {/* Second split — branches from the left box (25%) to Teacher App + Parent App */}
                  <FlowSplit show={ecoStep >= 6} stem="25%" />

                  {/* Row 2: Teacher App | Parent App — same widths as the row above */}
                  <div className="grid grid-cols-2 items-start gap-4 md:gap-8">
                    <EcoBox title={ECO_L2[0].title} sub={ECO_L2[0].sub} show={ecoStep >= 7} delay={0} />
                    <EcoBox title={ECO_L2[1].title} sub={ECO_L2[1].sub} show={ecoStep >= 7} delay={100} />
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

      {/* Content - Section 5: Progress statement (step 8) — charcoal + animated blueprint grid */}
      {showSection2 && (
        <div
          className="absolute inset-0 z-30"
          style={{
            opacity: inProgress ? 1 : 0,
            pointerEvents: 'none',
            transition: 'opacity 700ms ease',
          }}
        >
          {/* Charcoal base */}
          <div className="absolute inset-0" style={{ backgroundColor: '#0A1811' }} />

          {/* Full-width dot grid (aligned to the right edge so it meets the line grid) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.14) 1.2px, transparent 1.4px)',
              backgroundSize: `${PG_CELL}px ${PG_CELL}px`,
              backgroundPosition: 'right top',
              maskImage: 'radial-gradient(ellipse at center, transparent 30%, black 78%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 30%, black 78%)',
            }}
          />

          {/* Right-side animated blueprint line grid */}
          <div
            className="absolute right-0 top-0 h-full overflow-hidden"
            style={{
              width: `${(PG_V_LINES - 1) * PG_CELL + 2}px`,
              maskImage:
                'radial-gradient(ellipse at center, transparent 25%, black 78%), linear-gradient(to right, transparent 0%, black 35%)',
              WebkitMaskImage:
                'radial-gradient(ellipse at center, transparent 25%, black 78%), linear-gradient(to right, transparent 0%, black 35%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in',
            }}
          >
            {/* Vertical lines — draw down, sweeping right → left */}
            {Array.from({ length: PG_V_LINES }).map((_, c) => (
              <div
                key={`pgv-${c}`}
                className="absolute top-0 bottom-0"
                style={{
                  right: `${c * PG_CELL}px`,
                  borderLeft: '1px dashed rgba(255,255,255,0.10)',
                  transformOrigin: 'top',
                  transform: inProgress ? 'scaleY(1)' : 'scaleY(0)',
                  opacity: inProgress ? 1 : 0,
                  transition: `transform 750ms cubic-bezier(0.22,1,0.36,1) ${c * 45}ms, opacity 500ms ease ${c * 45}ms`,
                }}
              />
            ))}
            {/* Horizontal lines — draw across, sweeping top → bottom */}
            {Array.from({ length: PG_H_LINES }).map((_, r) => (
              <div
                key={`pgh-${r}`}
                className="absolute left-0 right-0"
                style={{
                  top: `${r * PG_CELL}px`,
                  borderTop: '1px dashed rgba(255,255,255,0.10)',
                  transformOrigin: 'right',
                  transform: inProgress ? 'scaleX(1)' : 'scaleX(0)',
                  opacity: inProgress ? 1 : 0,
                  transition: `transform 750ms cubic-bezier(0.22,1,0.36,1) ${r * 45}ms, opacity 500ms ease ${r * 45}ms`,
                }}
              />
            ))}
            {/* Green accent comets — travel along a grid line, fade out, loop (staggered) */}
            {PG_BLUE.map((b, i) => {
              const dist = 2.5 * PG_CELL; // travel ~2.5 cells along the line
              const dur = 2400 + ((i * 313) % 2000); // 2.4s–4.4s
              const delay = (i * 517) % 4200; // 0–4.2s staggered start
              return (
                <div
                  key={`pgb-${i}`}
                  className="absolute"
                  style={{
                    right: `${b.c * PG_CELL}px`,
                    top: `${b.r * PG_CELL}px`,
                    width: b.d === 'h' ? `${PG_CELL}px` : '1.5px',
                    height: b.d === 'h' ? '1.5px' : `${PG_CELL}px`,
                    background:
                      b.d === 'h'
                        ? 'linear-gradient(90deg, rgba(110,231,183,0.3), rgba(16,185,129,0.3) 45%, rgba(16,185,129,0))'
                        : 'linear-gradient(180deg, rgba(110,231,183,0.3), rgba(16,185,129,0.3) 45%, rgba(16,185,129,0))',
                    boxShadow: '0 0 8px rgba(16,185,129,0.18)',
                    opacity: 0,
                    '--pg-dx': b.d === 'h' ? `-${dist}px` : '0px',
                    '--pg-dy': b.d === 'v' ? `-${dist}px` : '0px',
                    animation: `pg-comet ${dur}ms linear ${delay}ms infinite`,
                    animationPlayState: inProgress ? 'running' : 'paused',
                  } as React.CSSProperties}
                />
              );
            })}
          </div>

          {/* Right-side ecosystem ring — slow rotation, upright labelled nodes, fixed centre text */}
          <div
            className="absolute right-[16%] top-[78%] -translate-y-1/2"
            style={{
              width: 'min(46vh, 40vw)',
              height: 'min(46vh, 40vw)',
              opacity: inProgress ? 1 : 0,
              transform: inProgress
                ? 'translateY(-50%) scale(1)'
                : 'translateY(-50%) scale(0.9)',
              transition:
                'opacity 800ms ease 500ms, transform 900ms cubic-bezier(0.22,1,0.36,1) 500ms',
            }}
          >
            {/* Rotating layer (ring + orbiting nodes) */}
            <div
              className="absolute inset-0"
              style={{
                animation: 'pg-spin 48s linear infinite',
                animationPlayState: inProgress ? 'running' : 'paused',
              }}
            >
              {/* Orbit circles */}
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: '1px dashed rgba(255,255,255,0.14)' }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  inset: '14%',
                  border: '1px solid rgba(16,185,129,0.12)',
                }}
              />

              {/* Nodes evenly spaced around the ring */}
              {PG_NODES.map((n, i) => {
                const ang = ((-90 + i * (360 / PG_NODES.length)) * Math.PI) / 180;
                const x = 50 + 50 * Math.cos(ang);
                const y = 50 + 50 * Math.sin(ang);
                return (
                  <div
                    key={n.label}
                    className="absolute"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    {/* Counter-rotation keeps the icon + label upright */}
                    <div
                      className="flex flex-col items-center gap-2"
                      style={{
                        animation: 'pg-spin-rev 48s linear infinite',
                        animationPlayState: inProgress ? 'running' : 'paused',
                      }}
                    >
                      <div
                        className="flex items-center justify-center rounded-full backdrop-blur-sm"
                        style={{
                          width: 'clamp(44px, 4vw, 60px)',
                          height: 'clamp(44px, 4vw, 60px)',
                          background: 'rgba(16,185,129,0.08)',
                          border: '1px solid rgba(16,185,129,0.4)',
                          color: '#6ee7b7',
                          boxShadow: '0 0 20px rgba(16,185,129,0.12)',
                        }}
                      >
                        <RingIcon name={n.icon} />
                      </div>
                      <span
                        className="whitespace-nowrap font-light"
                        style={{
                          fontSize: 'clamp(0.7rem, 0.9vw, 0.9rem)',
                          color: 'rgba(255,255,255,0.72)',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {n.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fixed centre text */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ maxWidth: '54%' }}
            >
              <p
                className="whitespace-nowrap font-light"
                style={{
                  fontSize: 'clamp(0.8rem, 1vw, 1rem)',
                  lineHeight: 1.4,
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                Connected through
              </p>
              <p
                className="whitespace-nowrap font-normal"
                style={{
                  fontSize: 'clamp(1.05rem, 1.6vw, 1.6rem)',
                  lineHeight: 1.3,
                  color: '#ffffff',
                }}
              >
                one digital ecosystem.
              </p>
            </div>
          </div>

          {/* Top tagline — blur → focus, fade, rise */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-center px-6 pt-16 md:pt-24">
            <p
              className="text-center font-light tracking-tight"
              style={{
                fontSize: 'clamp(1.35rem, 2.5vw, 2.15rem)',
                opacity: inProgress ? 1 : 0,
                filter: inProgress ? 'blur(0px)' : 'blur(10px)',
                transform: inProgress ? 'translateY(0)' : 'translateY(24px)',
                transition:
                  'opacity 700ms ease 250ms, filter 700ms ease 250ms, transform 800ms cubic-bezier(0.22,1,0.36,1) 250ms',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>{PG_HIGHLIGHT}</span>
            </p>
          </div>

          {/* Center-left headline + body, left-aligned — blur → focus, fade, rise. Fades out on the partner step. */}
          <div
            className="absolute left-0 top-[68%] -translate-y-1/2 max-w-[38rem] pl-12 md:pl-20"
            style={{
              opacity: inProgress && !inPartner ? 1 : 0,
              filter: inProgress && !inPartner ? 'blur(0px)' : 'blur(10px)',
              transform:
                inProgress && !inPartner
                  ? 'translateY(-50%) translateX(0)'
                  : 'translateY(-50%) translateX(-24px)',
              transition:
                'opacity 700ms ease 400ms, filter 700ms ease 400ms, transform 800ms cubic-bezier(0.22,1,0.36,1) 400ms',
            }}
          >
            <h3
              className="text-left font-light tracking-tight text-white"
              style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.6rem)', lineHeight: 1.15 }}
            >
              Designed Around the Way Deeniyat Works
            </h3>
            <p
              className="mt-5 text-left font-light"
              style={{
                fontSize: 'clamp(0.9rem, 1.1vw, 1.1rem)',
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              This is not intended to be a generic education software adapted to
              Deeniyat. The platform is being designed around Deeniyat's
              organizational structure, academic practices and the practical
              workflows of institutions and Muallims.
            </p>
          </div>

          {/* Technology Partner (step 9) — crossfades in over the "Designed…" block */}
          <div
            className="absolute left-0 top-[66%] -translate-y-1/2 max-w-[40rem] pl-12 md:pl-20"
            style={{
              opacity: inPartner ? 1 : 0,
              filter: inPartner ? 'blur(0px)' : 'blur(10px)',
              transform: inPartner
                ? 'translateY(-50%) translateX(0)'
                : 'translateY(-50%) translateX(-24px)',
              transition:
                'opacity 700ms ease 250ms, filter 700ms ease 250ms, transform 800ms cubic-bezier(0.22,1,0.36,1) 250ms',
              pointerEvents: inPartner ? 'auto' : 'none',
            }}
          >
            <h3
              className="text-left font-light tracking-tight text-white"
              style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.6rem)', lineHeight: 1.15 }}
            >
              {PARTNER_HEAD}
            </h3>
            <p
              className="mt-5 text-left font-light"
              style={{
                fontSize: 'clamp(0.9rem, 1.1vw, 1.1rem)',
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              {PARTNER_BODY}
            </p>
            <img
              src="/techno%20alliance%20logo.png"
              alt="Techno Alliance"
              className="mt-8 w-auto"
              style={{ height: 'clamp(2.75rem, 4.5vw, 4rem)' }}
            />
          </div>
        </div>
      )}

      {/* Content - Section 6: Developer / build (step 9) — dark golden-ratio blueprint */}
      {showSection2 && (
        <div
          className="absolute inset-0 z-40"
          style={{
            // Stay opaque during the shift so Section 5 never bleeds through; Section 7 crossfades on top
            opacity: inDev ? 1 : 0,
            pointerEvents: inDev && !inNext ? 'auto' : 'none',
            transform: inNext ? 'scale(1.05) translateY(-30px)' : 'scale(1) translateY(0)',
            transition:
              'opacity 700ms ease, transform 900ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Base */}
          <div className="absolute inset-0" style={{ backgroundColor: '#0A1811' }} />
          {/* Soft centre glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 62% 50%, rgba(16,185,129,0.10), transparent 70%)',
            }}
          />

          {/* Blueprint geometry — golden spiral, concentric circles, crosshairs */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            style={{
              opacity: inDev ? 1 : 0,
              transform: inDev ? 'scale(1)' : 'scale(1.06)',
              transformOrigin: '62% 50%',
              transition:
                'opacity 1000ms ease 150ms, transform 1200ms cubic-bezier(0.22,1,0.36,1) 150ms',
            }}
          >
            <g fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1">
              <circle cx="910" cy="470" r="400" />
              <circle cx="910" cy="470" r="250" />
              <circle cx="910" cy="470" r="150" />
              <line x1="470" y1="0" x2="470" y2="900" />
              <line x1="0" y1="450" x2="1440" y2="450" stroke="rgba(255,255,255,0.05)" />
            </g>
            <path d={DEV_SPIRAL} fill="none" stroke="rgba(110,231,183,0.16)" strokeWidth="1.2" />
            {/* Dots tracing the concentric circles and divider lines */}
            <TraceDots d={circlePath(910, 470, 400)} dur={16} playing={inDev} dim={0.4} />
            <TraceDots d={circlePath(910, 470, 250)} dur={12} playing={inDev} dim={0.4} />
            <TraceDots d={circlePath(910, 470, 150)} dur={9} playing={inDev} dim={0.4} />
            <TraceDots d="M470,0 L470,900" dur={10} playing={inDev} dim={0.4} />
            <TraceDots d="M0,450 L1440,450" dur={14} playing={inDev} dim={0.4} />
            {/* Tiny dots tracing along the spiral — leading dot brightest, fading trail */}
            <TraceDots d={DEV_SPIRAL} dur={11} playing={inDev} />
            {/* Bottom-left quarter arc */}
            <circle cx="120" cy="860" r="150" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            {/* Crosshair ticks */}
            <g stroke="rgba(255,255,255,0.22)" strokeWidth="1">
              {DEV_TICKS.map(([x, y], i) => (
                <g key={`dt-${i}`}>
                  <line x1={x - 6} y1={y} x2={x + 6} y2={y} />
                  <line x1={x} y1={y - 6} x2={x} y2={y + 6} />
                </g>
              ))}
            </g>
          </svg>

          {/* Left darker panel (very subtle) */}
          <div
            className="absolute left-0 top-0 h-full"
            style={{
              width: '32%',
              background: 'linear-gradient(to right, rgba(0,0,0,0.35), transparent)',
            }}
          />

          {/* Centre content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            {/* Label */}
            <span
              className="font-medium uppercase"
              style={{
                fontSize: 'clamp(0.65rem, 0.75vw, 0.8rem)',
                letterSpacing: '0.28em',
                color: 'rgba(255,255,255,0.45)',
                opacity: inDev ? 1 : 0,
                transform: inDev ? 'translateY(0)' : 'translateY(16px)',
                transition:
                  'opacity 600ms ease 350ms, transform 700ms cubic-bezier(0.22,1,0.36,1) 350ms',
              }}
            >
              {DEV_LABEL}
            </span>

            {/* Body */}
            <p
              className="mt-6 font-light tracking-tight"
              style={{
                maxWidth: '52rem',
                fontSize: 'clamp(1.15rem, 2.2vw, 2rem)',
                lineHeight: 1.35,
                color: 'rgba(255,255,255,0.82)',
                opacity: inDev ? 1 : 0,
                filter: inDev ? 'blur(0px)' : 'blur(12px)',
                transform: inDev ? 'translateY(0)' : 'translateY(26px)',
                transition:
                  'opacity 800ms ease 450ms, filter 800ms ease 450ms, transform 900ms cubic-bezier(0.22,1,0.36,1) 450ms',
              }}
            >
              {DEV_BODY}
            </p>

            {/* Emphasis line */}
            <p
              className="mt-24 font-medium text-white"
              style={{
                fontSize: 'clamp(1rem, 1.7vw, 1.45rem)',
                opacity: inDev ? 1 : 0,
                transform: inDev ? 'translateY(0)' : 'translateY(18px)',
                transition:
                  'opacity 700ms ease 600ms, transform 800ms cubic-bezier(0.22,1,0.36,1) 600ms',
              }}
            >
              {DEV_EMPHASIS}
            </p>

            {/* Auto-scrolling question pills */}
            <div
              className="relative mt-6 w-full overflow-hidden"
              style={{
                maxWidth: '92vw',
                maskImage:
                  'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                opacity: inDev ? 1 : 0,
                transition: 'opacity 700ms ease 800ms',
              }}
            >
              <div
                className="flex w-max"
                style={{
                  animation: 'pg-marquee 26s linear infinite',
                  animationPlayState: inDev ? 'running' : 'paused',
                }}
              >
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={copy === 1}>
                    {DEV_QUESTIONS.map((q) => (
                      <span
                        key={q}
                        className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full font-medium text-white"
                        style={{
                          padding: '0.85rem 1.6rem',
                          fontSize: 'clamp(0.85rem, 1vw, 1rem)',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.18)',
                          backdropFilter: 'blur(6px)',
                        }}
                      >
                        {q}
                      </span>
                    ))}
                    {/* Loop-boundary diamond — marks the end of the set before it repeats */}
                    <span
                      className="shrink-0"
                      style={{
                        width: '7px',
                        height: '7px',
                        background: '#ffffff',
                        transform: 'rotate(45deg)',
                        boxShadow: '0 0 8px rgba(255,255,255,0.5)',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Section 7 (step 10) — Scale/vision, isometric circuit cube; rises in as Section 6 lifts away ===== */}
      {showSection2 && (
        <div
          className="absolute inset-0 z-50"
          style={{
            opacity: inNext ? 1 : 0,
            pointerEvents: inNext ? 'auto' : 'none',
            transition: 'opacity 800ms ease',
          }}
        >
          {/* Green base */}
          <div className="absolute inset-0" style={{ backgroundColor: '#0A1811' }} />

          {/* Animated blueprint grid — same as the "Built for Deeniyat" section */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.14) 1.2px, transparent 1.4px)',
              backgroundSize: `${PG_CELL}px ${PG_CELL}px`,
              backgroundPosition: 'right top',
              maskImage: 'radial-gradient(ellipse at center, transparent 30%, black 78%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 30%, black 78%)',
            }}
          />
          <div
            className="absolute right-0 top-0 h-full overflow-hidden"
            style={{
              width: `${(PG_V_LINES - 1) * PG_CELL + 2}px`,
              maskImage:
                'radial-gradient(ellipse at center, transparent 25%, black 78%), linear-gradient(to right, transparent 0%, black 35%)',
              WebkitMaskImage:
                'radial-gradient(ellipse at center, transparent 25%, black 78%), linear-gradient(to right, transparent 0%, black 35%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in',
            }}
          >
            {Array.from({ length: PG_V_LINES }).map((_, c) => (
              <div
                key={`s7v-${c}`}
                className="absolute top-0 bottom-0"
                style={{
                  right: `${c * PG_CELL}px`,
                  borderLeft: '1px dashed rgba(255,255,255,0.10)',
                  transformOrigin: 'top',
                  transform: inNext ? 'scaleY(1)' : 'scaleY(0)',
                  opacity: inNext ? 1 : 0,
                  transition: `transform 750ms cubic-bezier(0.22,1,0.36,1) ${c * 45}ms, opacity 500ms ease ${c * 45}ms`,
                }}
              />
            ))}
            {Array.from({ length: PG_H_LINES }).map((_, r) => (
              <div
                key={`s7h-${r}`}
                className="absolute left-0 right-0"
                style={{
                  top: `${r * PG_CELL}px`,
                  borderTop: '1px dashed rgba(255,255,255,0.10)',
                  transformOrigin: 'right',
                  transform: inNext ? 'scaleX(1)' : 'scaleX(0)',
                  opacity: inNext ? 1 : 0,
                  transition: `transform 750ms cubic-bezier(0.22,1,0.36,1) ${r * 45}ms, opacity 500ms ease ${r * 45}ms`,
                }}
              />
            ))}
            {PG_BLUE.map((b, i) => {
              const dist = 2.5 * PG_CELL;
              const dur = 2400 + ((i * 313) % 2000);
              const delay = (i * 517) % 4200;
              return (
                <div
                  key={`s7b-${i}`}
                  className="absolute"
                  style={{
                    right: `${b.c * PG_CELL}px`,
                    top: `${b.r * PG_CELL}px`,
                    width: b.d === 'h' ? `${PG_CELL}px` : '1.5px',
                    height: b.d === 'h' ? '1.5px' : `${PG_CELL}px`,
                    background:
                      b.d === 'h'
                        ? 'linear-gradient(90deg, rgba(110,231,183,0.3), rgba(16,185,129,0.3) 45%, rgba(16,185,129,0))'
                        : 'linear-gradient(180deg, rgba(110,231,183,0.3), rgba(16,185,129,0.3) 45%, rgba(16,185,129,0))',
                    boxShadow: '0 0 8px rgba(16,185,129,0.18)',
                    opacity: 0,
                    '--pg-dx': b.d === 'h' ? `-${dist}px` : '0px',
                    '--pg-dy': b.d === 'v' ? `-${dist}px` : '0px',
                    animation: `pg-comet ${dur}ms linear ${delay}ms infinite`,
                    animationPlayState: inNext ? 'running' : 'paused',
                  } as React.CSSProperties}
                />
              );
            })}
          </div>

          {/* Bottom-left mirrored blueprint grid — same draw-in animation */}
          <div
            className="absolute left-0 bottom-0 h-full overflow-hidden"
            style={{
              width: `${(PG_V_LINES - 1) * PG_CELL + 2}px`,
              maskImage:
                'radial-gradient(ellipse at center, transparent 25%, black 78%), linear-gradient(to left, transparent 0%, black 35%)',
              WebkitMaskImage:
                'radial-gradient(ellipse at center, transparent 25%, black 78%), linear-gradient(to left, transparent 0%, black 35%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in',
            }}
          >
            {Array.from({ length: PG_V_LINES }).map((_, c) => (
              <div
                key={`s7lv-${c}`}
                className="absolute top-0 bottom-0"
                style={{
                  left: `${c * PG_CELL}px`,
                  borderLeft: '1px dashed rgba(255,255,255,0.10)',
                  transformOrigin: 'bottom',
                  transform: inNext ? 'scaleY(1)' : 'scaleY(0)',
                  opacity: inNext ? 1 : 0,
                  transition: `transform 750ms cubic-bezier(0.22,1,0.36,1) ${c * 45}ms, opacity 500ms ease ${c * 45}ms`,
                }}
              />
            ))}
            {Array.from({ length: PG_H_LINES }).map((_, r) => (
              <div
                key={`s7lh-${r}`}
                className="absolute left-0 right-0"
                style={{
                  bottom: `${r * PG_CELL}px`,
                  borderTop: '1px dashed rgba(255,255,255,0.10)',
                  transformOrigin: 'left',
                  transform: inNext ? 'scaleX(1)' : 'scaleX(0)',
                  opacity: inNext ? 1 : 0,
                  transition: `transform 750ms cubic-bezier(0.22,1,0.36,1) ${r * 45}ms, opacity 500ms ease ${r * 45}ms`,
                }}
              />
            ))}
            {PG_BLUE.map((b, i) => {
              const dist = 2.5 * PG_CELL;
              const dur = 2400 + ((i * 313) % 2000);
              const delay = (i * 517) % 4200;
              return (
                <div
                  key={`s7lb-${i}`}
                  className="absolute"
                  style={{
                    left: `${b.c * PG_CELL}px`,
                    bottom: `${b.r * PG_CELL}px`,
                    width: b.d === 'h' ? `${PG_CELL}px` : '1.5px',
                    height: b.d === 'h' ? '1.5px' : `${PG_CELL}px`,
                    background:
                      b.d === 'h'
                        ? 'linear-gradient(90deg, rgba(16,185,129,0), rgba(16,185,129,0.3) 55%, rgba(110,231,183,0.3))'
                        : 'linear-gradient(180deg, rgba(16,185,129,0), rgba(16,185,129,0.3) 55%, rgba(110,231,183,0.3))',
                    boxShadow: '0 0 8px rgba(16,185,129,0.18)',
                    opacity: 0,
                    '--pg-dx': b.d === 'h' ? `${dist}px` : '0px',
                    '--pg-dy': b.d === 'v' ? `${dist}px` : '0px',
                    animation: `pg-comet ${dur}ms linear ${delay}ms infinite`,
                    animationPlayState: inNext ? 'running' : 'paused',
                  } as React.CSSProperties}
                />
              );
            })}
          </div>

          {/* Isometric nested circuit cube */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            style={{
              opacity: inNext ? 1 : 0,
              transform: inNext ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(14px)',
              transformOrigin: '66% 44%',
              filter: inNext ? 'blur(0px)' : 'blur(6px)',
              transition:
                'opacity 900ms ease 150ms, transform 1100ms cubic-bezier(0.22,1,0.36,1) 150ms, filter 900ms ease 150ms',
            }}
          >
            <defs>
              <filter id="s7glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3.2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer cube faces */}
            <polygon
              points={polyPts(S7_CUBE.faces.top)}
              fill="rgba(16,185,129,0.05)"
              stroke="rgba(110,231,183,0.30)"
              strokeWidth="1.4"
            />
            <polygon
              points={polyPts(S7_CUBE.faces.left)}
              fill="rgba(16,185,129,0.07)"
              stroke="rgba(110,231,183,0.20)"
              strokeWidth="1.4"
            />
            <polygon
              points={polyPts(S7_CUBE.faces.right)}
              fill="rgba(16,185,129,0.11)"
              stroke="rgba(110,231,183,0.20)"
              strokeWidth="1.4"
            />

            {/* Inner cube edges */}
            <g stroke="rgba(110,231,183,0.38)" strokeWidth="1" fill="none">
              {S7_CUBE.edges.map(([a, b], i) => (
                <line
                  key={`ie-${i}`}
                  x1={S7_CUBE.inner[a][0]}
                  y1={S7_CUBE.inner[a][1]}
                  x2={S7_CUBE.inner[b][0]}
                  y2={S7_CUBE.inner[b][1]}
                />
              ))}
            </g>

            {/* Connectors outer → inner (circuit "energy" lines) */}
            <g stroke="rgba(110,231,183,0.18)" strokeWidth="1" fill="none">
              {S7_CUBE.nodeIdx.map((idx, i) => (
                <line
                  key={`cn-${i}`}
                  x1={S7_CUBE.corners[idx][0]}
                  y1={S7_CUBE.corners[idx][1]}
                  x2={S7_CUBE.inner[idx][0]}
                  y2={S7_CUBE.inner[idx][1]}
                />
              ))}
            </g>

            {/* Dots tracing the inner cube edges */}
            {S7_CUBE.edges.slice(0, 8).map(([a, b], i) => (
              <TraceDots
                key={`ct-${i}`}
                d={`M${S7_CUBE.inner[a].join(',')} L${S7_CUBE.inner[b].join(',')}`}
                dur={7 + i}
                playing={inNext}
                dim={0.5}
              />
            ))}

            {/* Glowing nodes — inner (bright) + outer corners, alternating amber / cyan */}
            <g filter="url(#s7glow)">
              {S7_CUBE.nodeIdx.map((idx, i) => (
                <circle
                  key={`ni-${i}`}
                  cx={S7_CUBE.inner[idx][0]}
                  cy={S7_CUBE.inner[idx][1]}
                  r="2.8"
                  fill={i % 2 === 0 ? '#f59e0b' : '#34d399'}
                />
              ))}
              {S7_CUBE.nodeIdx.map((idx, i) => (
                <circle
                  key={`no-${i}`}
                  cx={S7_CUBE.corners[idx][0]}
                  cy={S7_CUBE.corners[idx][1]}
                  r="2.2"
                  fill={i % 2 === 0 ? '#34d399' : '#f59e0b'}
                />
              ))}
            </g>

          </svg>

          {/* Top-left text block (label → body → title → subtext) */}
          <div className="absolute inset-0 flex items-start">
            <div className="px-10 pt-[12vh] md:px-20">
              <span
                className="block font-medium"
                style={{
                  fontSize: 'clamp(0.8rem, 1vw, 1rem)',
                  color: 'rgba(255,255,255,0.6)',
                  opacity: inNext ? 1 : 0,
                  transform: inNext ? 'translateY(0)' : 'translateY(20px)',
                  transition:
                    'opacity 700ms ease 320ms, transform 800ms cubic-bezier(0.22,1,0.36,1) 320ms',
                }}
              >
                {S7_LABEL}
              </span>
              <p
                className="mt-5 font-light"
                style={{
                  maxWidth: '38rem',
                  fontSize: 'clamp(1rem, 1.5vw, 1.4rem)',
                  lineHeight: 1.45,
                  color: 'rgba(255,255,255,0.7)',
                  opacity: inNext ? 1 : 0,
                  filter: inNext ? 'blur(0px)' : 'blur(10px)',
                  transform: inNext ? 'translateY(0)' : 'translateY(22px)',
                  transition:
                    'opacity 800ms ease 440ms, filter 800ms ease 440ms, transform 900ms cubic-bezier(0.22,1,0.36,1) 440ms',
                }}
              >
                {S7_BODY}
              </p>
              <RotatingPhrase
                phrases={S7_ROTATING}
                active={inNext}
                className="mt-7 font-semibold tracking-tight text-white"
                style={{ fontSize: 'clamp(2.8rem, 5.6vw, 5.25rem)', lineHeight: 1.05, whiteSpace: 'nowrap' }}
              />
            </div>
          </div>

          {/* Platform name pinned to bottom-centre — small, uppercase */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center px-6 pb-[6vh]">
            <p
              className="text-center font-medium uppercase"
              style={{
                fontSize: 'clamp(0.8rem, 1vw, 1rem)',
                letterSpacing: '0.28em',
                color: 'rgba(255,255,255,0.5)',
                opacity: inNext ? 1 : 0,
                transform: inNext ? 'translateY(0)' : 'translateY(18px)',
                transition:
                  'opacity 800ms ease 900ms, transform 900ms cubic-bezier(0.22,1,0.36,1) 900ms',
              }}
            >
              {S7_TITLE}
            </p>
          </div>
        </div>
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

// Rotating phrase — cycles through phrases in a loop, scrambling letters in/out (like Section 1)
function RotatingPhrase({
  phrases,
  active,
  className = '',
  style,
}: {
  phrases: string[];
  active: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const [hold, setHold] = useState(false); // true once fully visible → gentle zoom-in
  const runToken = useRef(0);

  useEffect(() => {
    if (!active) {
      setVisible(new Set());
      return;
    }
    const token = ++runToken.current;
    const word = phrases[index];
    const stale = () => runToken.current !== token;

    const run = async () => {
      // Phase 1 — scramble letters IN (gentle zoom starts as the first letters appear)
      setHold(false); // reset scale instantly (no transition while hidden)
      setVisible(new Set());
      const shuffled = shuffleArray(Array.from({ length: word.length }, (_, i) => i));
      await delay(60); // let the scale(1)/transition:none frame flush first
      if (stale()) return;
      setHold(true); // begin the slow zoom-in now, while letters are still revealing
      for (let i = 0; i < shuffled.length; i++) {
        await delay(40 + Math.random() * 30);
        if (stale()) return;
        setVisible((prev) => new Set([...prev, shuffled[i]]));
      }
      // Phase 2 — hold
      await delay(2200);
      if (stale()) return;
      // Phase 3 — scramble letters OUT
      for (let i = shuffled.length - 1; i >= 0; i--) {
        await delay(30 + Math.random() * 20);
        if (stale()) return;
        setVisible((prev) => {
          const next = new Set(prev);
          next.delete(shuffled[i]);
          return next;
        });
      }
      if (stale()) return;
      setIndex((prev) => (prev + 1) % phrases.length);
    };

    run();
    return () => {
      runToken.current++;
    };
  }, [index, active, phrases]);

  const word = phrases[index];
  // Group letters into per-word inline-block spans so wrapping only happens between
  // words (never mid-word), while each letter still scrambles individually.
  const segments: React.ReactNode[] = [];
  let letters: React.ReactNode[] = [];
  let wordKey = 0;
  const flush = () => {
    segments.push(
      <span key={`w-${wordKey++}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
        {letters}
      </span>,
    );
    letters = [];
  };
  for (let i = 0; i < word.length; i++) {
    if (word[i] === ' ') {
      flush();
      segments.push(' ');
    } else {
      letters.push(
        <AnimatedLetter key={`${index}-${i}`} letter={word[i]} isVisible={visible.has(i)} delay={0} />,
      );
    }
  }
  flush();
  return (
    <p
      className={className}
      style={{
        ...style,
        transformOrigin: 'left center',
        transform: hold ? 'scale(1.07)' : 'scale(1)',
        // slow ease across the whole reveal + hold; instant reset otherwise
        transition: hold ? 'transform 3600ms ease-out' : 'none',
      }}
    >
      {segments}
    </p>
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

// Ecosystem flowchart node box (title + subtext)
function EcoBox({ title, sub, show, delay = 0 }: { title: string; sub: string; show: boolean; delay?: number }) {
  return (
    <div
      className={`group relative w-full overflow-hidden rounded-xl px-4 py-3.5 text-center transition-all duration-500 ease-out md:px-5 md:py-4 ${
        show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
      }`}
      style={{
        transitionDelay: show ? `${delay}ms` : '0ms',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.035) 100%)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow:
          '0 10px 30px -12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* top accent line */}
      <span
        aria-hidden
        className="absolute left-1/2 top-0 h-0.5 w-10 -translate-x-1/2 rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent, #34D399, transparent)' }}
      />
      <h4
        className="relative font-semibold tracking-tight text-white"
        style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.4rem)', lineHeight: 1.15 }}
      >
        {title}
      </h4>
      <p
        className="relative mt-1 leading-snug text-white/55"
        style={{ fontSize: 'clamp(0.7rem, 0.9vw, 0.92rem)' }}
      >
        {sub}
      </p>
    </div>
  );
}

// Flowchart split connector — stem down (from `stem`), horizontal bus, two drops to child column centres (25% / 75%)
function FlowSplit({ show, stem = '50%' }: { show: boolean; stem?: string }) {
  return (
    <div className="relative h-8 w-full md:h-10">
      {/* stem — drops from the parent box centre */}
      <div
        className="absolute top-0 h-4 w-px origin-top bg-gradient-to-b from-white/40 to-white/20 transition-transform duration-300 ease-out"
        style={{ left: stem, transform: `translateX(-50%) scaleY(${show ? 1 : 0})` }}
      />
      {/* horizontal bus spanning the two column centres */}
      <div
        className="absolute left-1/4 right-1/4 top-4 h-px origin-center bg-white/30 transition-transform duration-300 ease-out"
        style={{ transform: `scaleX(${show ? 1 : 0})`, transitionDelay: show ? '150ms' : '0ms' }}
      />
      {/* drops into each child column centre */}
      {['25%', '75%'].map((leftPos, i) => (
        <div
          key={`split-drop-${i}`}
          className="absolute top-4 h-4 w-px origin-top bg-gradient-to-b from-white/30 to-white/20 transition-transform duration-300 ease-out"
          style={{ left: leftPos, transform: `translateX(-50%) scaleY(${show ? 1 : 0})`, transitionDelay: show ? '300ms' : '0ms' }}
        />
      ))}
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
