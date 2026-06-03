import { useEffect, useRef, useState } from 'react';
import { PeekMascot } from './PeekMascot';

// Real Peek category stickers — die-cut vinyl artwork sourced from the app itself
// (Convex `tags.imageUrl`, generated via the same fal.ai → BiRefNet → Cloudinary
// pipeline in BluejayFinance/peek-mono-4). One PNG per "worth-it" category.
import ritualSticker from '../../../assets/stickers/ritual.png';
import comfortSticker from '../../../assets/stickers/comfort.png';
import selfCareSticker from '../../../assets/stickers/self-care.png';
import celebrationSticker from '../../../assets/stickers/celebration.png';
import convenienceSticker from '../../../assets/stickers/convenience.png';
import impulseBuySticker from '../../../assets/stickers/impulse-buy.png';
import necessitySticker from '../../../assets/stickers/necessity.png';
import aestheticSticker from '../../../assets/stickers/aesthetic.png';
import selfRewardSticker from '../../../assets/stickers/self-reward.png';
import socialSticker from '../../../assets/stickers/social.png';
import giftSticker from '../../../assets/stickers/gift.png';
import experienceSticker from '../../../assets/stickers/experience.png';
import hobbySticker from '../../../assets/stickers/hobby.png';
import productivitySticker from '../../../assets/stickers/productivity.png';
import fomoSticker from '../../../assets/stickers/fomo.png';
import entertainmentSticker from '../../../assets/stickers/entertainment.png';
import worthitScreen from '../../../assets/screen-worthit.png';
import blindboxScreen from '../../../assets/screen-blindbox.png';
import storiesScreen from '../../../assets/screen-stories.png';
import plansScreen from '../../../assets/screen-plans.png';

// Maps a category display name → its die-cut sticker artwork.
const STICKER_SRC: Record<string, string> = {
  Ritual: ritualSticker,
  Comfort: comfortSticker,
  'Self Care': selfCareSticker,
  Celebration: celebrationSticker,
  Convenience: convenienceSticker,
  'Impulse Buy': impulseBuySticker,
  Necessity: necessitySticker,
  Aesthetic: aestheticSticker,
  'Self Reward': selfRewardSticker,
  Social: socialSticker,
  Gift: giftSticker,
  Experience: experienceSticker,
  Hobby: hobbySticker,
  Productivity: productivitySticker,
  FOMO: fomoSticker,
  Entertainment: entertainmentSticker
};

// ---------------------------------------------------------------------------
// Peek — marketing / explainer landing page
// Direction: "Sticker Scrapbook" — matches the App Store feel
// Palette + fonts pulled from BluejayFinance/peek-mono-4 (frontend/mobile)
// ---------------------------------------------------------------------------

const PURPLE = '#37004B';
const CREAM = '#FFF0C5';
const GREEN = '#2EEA84';
const RED = '#FF4D6D';
// Darkened orange for white-text CTAs + accent text on cream (passes large-text AA).
const ORANGE_CTA = '#E85C00';

// ---------------------------------------------------------------------------
// Real Peek app screens (official assets from the Peek Figma "latest" set).
// Synced into /assets and rewritten to stable URLs on `code submit`.
//   worthit  → "what made this move?" worth-it tagging + last-30-days grid
//   blindbox → tap-to-collect insight reward / blind box
//   stories  → spending story ("your two selves", weekday vs weekend)
//   plans    → monthly caps that keep the spending you actually value
// ---------------------------------------------------------------------------
const SCREENS = {
  worthit: worthitScreen,
  blindbox: blindboxScreen,
  stories: storiesScreen,
  plans: plansScreen
} as const;

// reveal-on-scroll hook
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.16
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
function Reveal({
  children,
  className = '',
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  return <div ref={ref} className={`reveal ${className}`} style={{
    transitionDelay: `${delay}ms`
  }}>
      {children}
    </div>;
}
// ---------------------------------------------------------------------------
// Real Peek category stickers — pulled from the app's tag taxonomy
// (BluejayFinance/peek-mono-4 → convex/core/tags/labels.ts). These are the
// same "worth-it" buckets the app sorts your spending into.
// ---------------------------------------------------------------------------
interface CategorySticker {
  label: string;
  emoji: string;
  bg: string;
  fg: string;
}
const STICKER_THEMES = {
  green: {
    bg: GREEN,
    fg: '#06351E'
  },
  orange: {
    bg: '#FE875C',
    fg: '#4A1500'
  },
  yellow: {
    bg: '#FFE92B',
    fg: PURPLE
  },
  white: {
    bg: '#FFFFFF',
    fg: PURPLE
  },
  red: {
    bg: RED,
    fg: '#4A0014'
  },
  purple: {
    bg: PURPLE,
    fg: CREAM
  }
} as const;
type ThemeName = keyof typeof STICKER_THEMES;
function cat(label: string, emoji: string, theme: ThemeName): CategorySticker {
  return {
    label,
    emoji,
    ...STICKER_THEMES[theme]
  };
}
// Master list (display names match the app's TAG_VALUE_DISPLAY_NAMES exactly)
const CATEGORY_STICKERS: CategorySticker[] = [cat('Ritual', '☕️', 'white'), cat('Comfort', '🛋️', 'orange'), cat('Self Care', '🧖', 'green'), cat('Celebration', '🎉', 'yellow'), cat('Convenience', '⏱️', 'purple'), cat('Impulse Buy', '⚡', 'red'), cat('Necessity', '📋', 'white'), cat('Aesthetic', '🎨', 'green'), cat('Self Reward', '⭐', 'orange'), cat('Social', '🧋', 'yellow'), cat('Gift', '🎁', 'red'), cat('Experience', '🎟️', 'purple'), cat('Hobby', '🧶', 'green'), cat('Productivity', '💻', 'white'), cat('FOMO', '😼', 'orange'), cat('Entertainment', '🎬', 'yellow')];

// ---------------------------------------------------------------------------
// Hero stickers — real categories that "burst" outward on scroll.
// Scroll progress drives an outward translate + spin + fade for each sticker.
// ---------------------------------------------------------------------------
interface HeroStickerCfg extends CategorySticker {
  left: string;
  top: string;
  rot: number;
  dx: number;
  dy: number;
  spin: number;
  delay: number;
  show: string;
}
function hero(name: string, left: string, top: string, rot: number, dx: number, dy: number, spin: number, delay: number, show = ''): HeroStickerCfg {
  const base = CATEGORY_STICKERS.find(c => c.label === name)!;
  return {
    ...base,
    left,
    top,
    rot,
    dx,
    dy,
    spin,
    delay,
    show
  };
}
const HERO_STICKERS: HeroStickerCfg[] = [hero('Ritual', '4%', '15%', -8, -170, -70, -22, 0, 'hidden sm:block'), hero('Self Reward', '1%', '47%', 6, -195, 5, 18, 0.6), hero('Necessity', '5%', '82%', -6, -155, 140, -16, 0.3), hero('Self Care', '23%', '5%', 5, -55, -185, 20, 0.9, 'hidden sm:block'), hero('Gift', '49%', '3%', -4, 0, -195, -18, 1.1, 'hidden md:block'), hero('Impulse Buy', '85%', '9%', 7, 185, -85, 24, 0.2), hero('Convenience', '92%', '39%', -6, 205, 0, -20, 0.7, 'hidden sm:block'), hero('Celebration', '89%', '64%', 4, 190, 95, 16, 0.45), hero('Comfort', '73%', '91%', -5, 110, 165, -22, 0.5, 'hidden sm:block'), hero('Aesthetic', '43%', '93%', 3, 0, 185, 14, 0.15), hero('Social', '21%', '89%', -3, -95, 160, -18, 0.8, 'hidden md:block'), hero('Hobby', '63%', '87%', 6, 75, 160, 20, 1, 'hidden lg:block')];
function useHeroScroll(ref: React.RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const h = rect.height || 1;
      // 0 while hero fills the viewport → 1 once scrolled ~3/4 of a hero up
      const p = Math.min(1, Math.max(0, -rect.top / (h * 0.7)));
      setProgress(p);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
  return progress;
}
function HeroStickers() {
  const ref = useRef<HTMLDivElement | null>(null);
  const p = useHeroScroll(ref);
  return <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {HERO_STICKERS.map((s, i) => <div key={s.label + i} className={`absolute anim-float ${s.show}`} style={{
      left: s.left,
      top: s.top,
      animationDelay: `${s.delay}s`,
      '--r': `${s.rot}deg`
    } as React.CSSProperties}>
          <div style={{
        transform: `translate(${s.dx * p}px, ${s.dy * p}px) rotate(${s.spin * p}deg) scale(${1 + 0.18 * p})`,
        opacity: 1 - p * 0.92,
        willChange: 'transform, opacity'
      }}>
            <img src={STICKER_SRC[s.label]} alt="" draggable={false} loading="lazy" decoding="async" className="h-auto w-20 select-none sm:w-24 lg:w-28" style={{
          filter: 'drop-shadow(0 12px 18px rgba(55,0,75,0.28))'
        }} />
          </div>
        </div>)}
    </div>;
}

// ---------------------------------------------------------------------------
// App Store download badge (real CTA, Apple-style)
// ---------------------------------------------------------------------------
const APP_STORE_URL = 'https://apps.apple.com/app/peek';
function AppleGlyph({
  size = 22,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 384 512" fill={color} aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM262.1 104.5c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>;
}
function AppStoreButton({
  size = 'lg',
  variant = 'orange',
  label
}: {
  size?: 'lg' | 'md';
  variant?: 'orange' | 'light';
  label?: string;
}) {
  const isLg = size === 'lg';
  const palette = variant === 'orange' ? {
    background: ORANGE_CTA,
    color: '#fff',
    boxShadow: `0 10px 0 -3px ${ORANGE_CTA}55`
  } : {
    background: '#fff',
    color: PURPLE,
    boxShadow: '0 10px 0 -3px rgba(0,0,0,0.18)'
  };
  return <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Download Peek on the App Store" className={`ff-display inline-flex items-center gap-3 rounded-full font-extrabold transition-transform hover:scale-105 ${isLg ? 'px-7 py-3.5' : 'px-6 py-3'}`} style={palette}>
      <AppleGlyph size={isLg ? 26 : 22} />
      {label ? <span className={isLg ? 'text-lg' : 'text-base'}>{label}</span> : <span className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-semibold tracking-wide opacity-80">Download on the</span>
          <span className={isLg ? 'text-lg' : 'text-base'}>App Store</span>
        </span>}
    </a>;
}

// ---------------------------------------------------------------------------
// AppScreen — a real Peek app screenshot (transparent phone mockup), shown as
// a softly-shadowed, lightly-tilted "sticker" so it sits in the scrapbook look.
// ---------------------------------------------------------------------------
function AppScreen({
  src,
  alt,
  rotate = 0,
  className = ''
}: {
  src: string;
  alt: string;
  rotate?: number;
  className?: string;
}) {
  return <img src={src} alt={alt} loading="lazy" decoding="async" width={685} height={1400} draggable={false} className={`h-auto w-full select-none ${className}`} style={{
    transform: `rotate(${rotate}deg)`,
    filter: 'drop-shadow(0 28px 44px rgba(55,0,75,0.30))'
  }} />;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export const PeekLandingPage = () => {
  const personalities = ['The Comfort Seeker', 'The Jetsetter', 'The Convenience Regular', 'The Ritualist', 'The Treat-Yourself-er', 'The Late-Night Browser'];
  return <div className="ff-body min-h-screen w-full" style={{
    background: CREAM,
    color: PURPLE
  }}>
      {/* NAV */}
      <header className="sticky top-0 z-50 w-full" style={{
      backdropFilter: 'blur(8px)',
      background: 'rgba(255,240,197,0.85)',
      borderBottom: '1px solid rgba(55,0,75,0.06)'
    }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <PeekMascot size={36} className="anim-wiggle" />
            <span className="ff-display text-2xl font-extrabold lowercase" style={{
            color: PURPLE
          }}>
              peek
            </span>
          </div>
          <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" style={{
          color: `${PURPLE}cc`
        }}>
            <a href="#problem" className="transition-opacity hover:opacity-60">Why budgets miss</a>
            <a href="#how" className="transition-opacity hover:opacity-60">How it works</a>
            <a href="#worthit" className="transition-opacity hover:opacity-60">Worth it?</a>
            <a href="#stories" className="transition-opacity hover:opacity-60">Spending stories</a>
          </nav>
          <a href="#download" className="ff-display rounded-full px-5 py-2 text-sm font-extrabold transition-transform hover:scale-105" style={{
          background: PURPLE,
          color: CREAM
        }}>
            
            Get the app
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="dotgrid pointer-events-none absolute inset-0 opacity-60" />
        {/* real category stickers — burst outward on scroll */}
        <HeroStickers />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-14 md:pt-20 lg:grid-cols-2">
          <div>
            <span className="ff-hand inline-block text-2xl" style={{
            color: RED,
            transform: 'rotate(-3deg)'
          }}>
              less guilt →
            </span>
            <h1 className="ff-display mt-3 text-[clamp(2.6rem,7vw,3.75rem)] font-extrabold leading-[0.98] text-balance" style={{
            color: PURPLE
          }}>
              Your bank sees charges.{' '}
              <span style={{
              color: ORANGE_CTA
            }}>Peek shows the why.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg" style={{
            color: `${PURPLE}cc`
          }}>
              Rate each purchase worth it or not. Peek turns those tiny answers into spending
              stories and gentler plans.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <AppStoreButton size="lg" label="Get Peek free" />
              <span className="ff-hand text-xl" style={{
              color: `${PURPLE}cc`
            }}>
                free on iPhone · 4.4 ★
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full blur-3xl" style={{
            background: `${GREEN}33`
          }} />
            <PeekMascot size={92} className="anim-bob absolute -top-4 right-4 z-20 sm:right-0" expression="happy" />
            <AppScreen src={SCREENS.worthit} alt="The Peek app: tag each purchase by what drove it, like routine, convenience, or a treat, and watch your worth-it patterns appear" rotate={-2.5} className="relative z-10 mx-auto max-w-[280px] sm:max-w-[300px]" />
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section id="problem" className="relative mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="space-y-5">
            {[{
            icon: '🧮',
            text: 'Most money apps sort transactions, show charts, and tell you to cut food.',
            rot: -1.4
          }, {
            icon: '🍕',
            text: 'But food might be worth it. The waste is often smaller: forgettable purchases you would not choose twice.',
            rot: 1.2
          }, {
            icon: '🕳️',
            text: 'More data does not fix the gap between your plan and your week. Peek starts with the question budgets skip.',
            rot: -0.8
          }].map((c, i) => <Reveal key={i} delay={i * 90}>
                <div className="flex max-w-[520px] gap-4 rounded-[26px] bg-white p-6 sticker transition-transform hover:-translate-y-1" style={{
              transform: `rotate(${c.rot}deg)`,
              marginLeft: i % 2 === 0 ? 'auto' : 0
            }}>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl" style={{
                background: CREAM
              }}>
                    {c.icon}
                  </div>
                  <p className="self-center text-[15px] leading-relaxed" style={{
                color: `${PURPLE}d9`
              }}>
                    {c.text}
                  </p>
                </div>
              </Reveal>)}
          </div>

          <Reveal>
            <div className="lg:sticky lg:top-24 lg:text-right">
              <h2 className="ff-display ml-auto max-w-md text-4xl font-extrabold leading-tight text-balance sm:text-5xl" style={{
              color: PURPLE
            }}>
                Budgets make it about math.
              </h2>
              <p className="ff-hand ml-auto mt-6 max-w-sm text-2xl text-pretty" style={{
              color: RED
            }}>
                The harder part is knowing what you still feel good about.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative" style={{
      background: PURPLE
    }}>
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <div className="text-center">
              <h2 className="ff-display mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-balance sm:text-5xl" style={{
              color: CREAM
            }}>
                Peek asks first, then helps.
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[{
            n: '1',
            title: 'Tap worth it or not.',
            body: 'One question per transaction. No accountant categories. Your answers show what you value, regret, and repeat.',
            accent: GREEN
          }, {
            n: '2',
            title: 'Get stories you can read.',
            body: 'Peek turns patterns into recaps: the comforts, rituals, impulse buys, and days your spending changed.',
            accent: '#FE875C'
          }, {
            n: '3',
            title: 'Set plans that fit real life.',
            body: 'Caps come from what you spent and how you felt about it, with mid-month nudges before things drift.',
            accent: '#FFE92B'
          }].map((s, i) => <Reveal key={i} delay={i * 90}>
                <div className="h-full rounded-[26px] p-6" style={{
              background: '#3D004E',
              border: '1px solid #ffffff14'
            }}>
                
                  <div className="ff-display mb-4 flex h-11 w-11 items-center justify-center rounded-full text-xl font-extrabold" style={{
                background: s.accent,
                color: PURPLE
              }}>
                  
                    {s.n}
                  </div>
                  <h3 className="ff-display text-xl font-bold" style={{
                color: CREAM
              }}>
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed" style={{
                color: '#ffffffcc'
              }}>
                    {s.body}
                  </p>
                </div>
              </Reveal>)}
          </div>
        </div>
      </section>

      {/* FEATURE — WORTH IT */}
      <section id="worthit" className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="ff-display text-4xl font-extrabold leading-tight text-balance sm:text-5xl" style={{
              color: PURPLE
            }}>
                A tiny question, asked often.
              </h2>
              <p className="ff-hand mt-4 text-2xl" style={{
              color: RED
            }}>
                worth it, or not. that's it.
              </p>
              <p className="mt-4 max-w-md text-lg" style={{
              color: `${PURPLE}cc`
            }}>
                Forget five-star ratings and budget categories. One honest tap shows which purchases
                feel good later, which fade fast, and what you would do again.
              </p>
              <p className="mt-4 max-w-md text-lg font-semibold" style={{
              color: PURPLE
            }}>
                The result: guidance grounded in your own taste, not a generic budget rule.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex justify-center">
              <AppScreen src={SCREENS.blindbox} alt="Peek turns your worth-it answers into a collectible insight, a blind box that unlocks at the end of each cycle" rotate={2.5} className="max-w-[280px] sm:max-w-[300px]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURE — STORIES */}
      <section id="stories" className="relative" style={{
      background: '#fff'
    }}>
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="order-2 flex justify-center lg:order-1">
                <AppScreen src={SCREENS.stories} alt="Peek's spending story: weekday you vs weekend you, told back to you instead of buried in a dashboard" rotate={-2.5} className="max-w-[280px] sm:max-w-[300px]" />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="order-1 lg:order-2">
                <h2 className="ff-display text-4xl font-extrabold leading-tight text-balance sm:text-5xl" style={{
                color: PURPLE
              }}>
                  Your spending, told back plainly.
                </h2>
                <p className="mt-4 max-w-md text-lg" style={{
                color: `${PURPLE}cc`
              }}>
                  Dashboards can make money feel colder than it is. Peek turns transactions into
                  short visual recaps you can skim without spiraling.
                </p>
                <p className="mt-4 max-w-md text-lg" style={{
                color: `${PURPLE}cc`
              }}>
                  You might be a Comfort Seeker, a Ritualist, or a Late-Night Browser. The point is
                  not the label. It is a clearer read on when and why you spend.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {personalities.map((p, i) => <span key={p} className="rounded-full px-3 py-1.5 text-sm font-semibold sticker" style={{
                  background: CREAM,
                  color: PURPLE,
                  transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)`
                }}>
                    
                      {p}
                    </span>)}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FEATURE — SMART PLANS */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="ff-display text-4xl font-extrabold leading-tight text-balance sm:text-5xl" style={{
              color: PURPLE
            }}>
                A budget that leaves room for you.
              </h2>
              <p className="mt-4 max-w-md text-lg" style={{
              color: `${PURPLE}cc`
            }}>
                Traditional budgets ask you to guess a perfect month. Then real life shows up, and
                the plan gets ignored.
              </p>
              <p className="mt-4 max-w-md text-lg" style={{
              color: `${PURPLE}cc`
            }}>
                Peek starts from your recent spending and your worth-it ratings. It suggests caps,
                then checks in before the month gets away from you.
              </p>
              <p className="ff-hand mt-4 text-2xl" style={{
              color: RED
            }}>
                gentle nudge. no guilt spiral.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex justify-center">
              <AppScreen src={SCREENS.plans} alt="Peek's monthly caps: built around what you already value, so the spending that feels good stays guilt-free" rotate={2.5} className="max-w-[280px] sm:max-w-[300px]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="relative overflow-hidden" style={{
      background: PURPLE
    }}>
        <div className="mx-auto max-w-4xl px-5 py-24 text-center">
          <Reveal>
            <h2 className="ff-display mx-auto max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl" style={{
            color: CREAM
          }}>
              Peek asks before it explains.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg" style={{
            color: '#ffffffcc'
          }}>
              Your ratings are the source of truth. Peek uses them to group transactions, name
              patterns, and show what changed. You decide what was worth it.
            </p>
            <p className="ff-hand mx-auto mt-5 text-2xl" style={{
            color: GREEN
          }}>
              numbers you can look at without bracing.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section id="download" className="relative overflow-hidden" style={{
      background: '#2A0138'
    }}>
        <div className="dotgrid pointer-events-none absolute inset-0 opacity-[0.18]" />
        <div className="relative mx-auto max-w-5xl px-5 py-24 text-center">
          <Reveal>
            <PeekMascot size={72} className="anim-bob mx-auto mb-6" expression="happy" />
            <h2 className="ff-display mx-auto max-w-2xl text-5xl font-extrabold leading-[1.02] text-balance sm:text-6xl" style={{
            color: CREAM
          }}>
              Find the spending you still feel good about.
            </h2>
            <div className="mt-9 flex flex-col items-center gap-3">
              <AppStoreButton size="lg" variant="orange" label="Download Peek" />
              <span className="ff-hand text-2xl" style={{
              color: '#ffffffcc'
            }}>
                free · iPhone · no spreadsheets
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* worth-it sticker marquee — real die-cut category stickers */}
      <div className="overflow-hidden border-t py-7" style={{
      background: PURPLE,
      borderColor: '#ffffff1a'
    }}>
        <div className="marquee-track flex w-max items-center gap-7 whitespace-nowrap">
          {[...Array(2)].map((_, dup) => <div key={dup} className="flex items-center gap-7">
              {CATEGORY_STICKERS.map((c, i) => <img key={`${dup}-${i}`} src={STICKER_SRC[c.label]} alt={c.label} draggable={false} loading="lazy" decoding="async" className="h-16 w-auto select-none sm:h-20" style={{
            filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.3))'
          }} />)}
            </div>)}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="flex items-center gap-2">
            <PeekMascot size={30} />
            <span className="ff-display text-xl font-extrabold lowercase" style={{
            color: PURPLE
          }}>
              peek
            </span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold" style={{
          color: `${PURPLE}cc`
        }}>
            <a href="/privacy" className="transition-opacity hover:opacity-60">Privacy</a>
            <a href="/terms" className="transition-opacity hover:opacity-60">Terms</a>
            <a href="mailto:hello@peek.money" className="transition-opacity hover:opacity-60">Support</a>
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-60">Get the app</a>
          </nav>
        </div>
        <p className="mt-6 text-center text-sm sm:text-left" style={{
        color: `${PURPLE}99`
      }}>
          Your spending. Your story. Your call. · © 2026 Peek
        </p>
      </footer>
    </div>;
};
