import { useEffect, useRef, useState } from 'react';
import { PeekMascot } from './PeekMascot';
import worthitScreen from '../../../assets/screen-worthit.png';
import worthitReviewScreen from '../../../assets/screen-worthit-review.png';
import storiesScreen from '../../../assets/screen-stories.png';
import plansScreen from '../../../assets/screen-plans.png';

// Real Peek category stickers — die-cut vinyl artwork sourced from the app itself
// (Convex `tags.imageUrl`, generated via the same fal.ai → BiRefNet → Cloudinary
// pipeline in BluejayFinance/peek-mono-4). One PNG per "worth-it" category.
const ritualSticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/23872f1941c405af3e23f80c7366f44741c2b0f7fa33aaab01ad78bd6f1b3fc5.png";
const comfortSticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/8445153c571e0634920959163c33dad93a6cab6f86cccc6ae59606e4caff52a0.png";
const selfCareSticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/ff07985daaece6b0349534d932211f0d6d25ab30dbafe045de16bcd83ba8ffa7.png";
const celebrationSticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/2837e6ec98fa64c77e2ca86b80e04d77da89f63922d9d735c96c43cf8ba482ad.png";
const convenienceSticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/47abf56081fae9401c14ff2f36744bd6c9af65aeec6e82b50e41d2afebd6cdf8.png";
const impulseBuySticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/cd08d0613db5ce9d2c73a6dd506271b5ff6e502c925b1aeb5dcc45837d99b98c.png";
const necessitySticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/0bb0c45b98dce3d2a164578001eb10978f448955bba34da0284c6d47a14f090c.png";
const aestheticSticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/34321d7f28823ade73dfcbd30a15af53c61ea0e9f7e33455559f808706e14816.png";
const selfRewardSticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/25f7fa64972e554855c41be32409245aefc0eef9f2ef6444a49d49b5bdea8eab.png";
const socialSticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/9d5c4955a8e749561c58965611772ce864a1d3602855dd4d750e04b0d96d2ec6.png";
const giftSticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/bc1548c56159df82d0fbebe3ef5c1907dbbf17aff8620862a15c2287638569e5.png";
const experienceSticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/1e1aa6c491a5230c352b6d905c3091eda527656c3e6304c96f4c32a68de25b27.png";
const hobbySticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/c7ec53c8bf6b83c3f3774da0f51f3b9e0ba8605c24bcb79c037b8b8e51b0de11.png";
const productivitySticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/f03be0d455d632434f07aa5537d1afb85c6bdc11143dc01bf657e86c4f3ffa9a.png";
const fomoSticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/fcde49210faef8c8496904f494b0cf9a8690b985a010b0cf7da376a087ff428a.png";
const entertainmentSticker = "https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412779235808260096/e37e4d7ca9afc04a66f5cdde44da83cb2f4efee92398776961aa2733ec5ea625.png";

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
//   worthit        → "what made this move?" worth-it tagging + last-30-days grid
//   worthit-review → rate spending worth it or not (Social category review)
//   stories        → spending story ("your two selves", weekday vs weekend)
//   plans          → monthly caps that keep the spending you actually value
// ---------------------------------------------------------------------------
const SCREENS = {
  worthit: worthitScreen,
  worthitReview: worthitReviewScreen,
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
  return <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" style={{
    overflow: 'visible'
  }}>
    {HERO_STICKERS.map(s => {
      const tx = s.dx * p;
      const ty = s.dy * p;
      const rotate = s.rot + s.spin * p;
      const opacity = 1 - p * 0.85;
      return <img key={s.label} src={STICKER_SRC[s.label]} alt={s.label} draggable={false} loading="eager" decoding="async" className={`select-none ${s.show}`} style={{
        position: 'absolute',
        left: s.left,
        top: s.top,
        width: 88,
        height: 'auto',
        transform: `translate(${tx}px, ${ty}px) rotate(${rotate}deg)`,
        opacity,
        filter: 'drop-shadow(0 8px 16px rgba(55,0,75,0.28))',
        transition: 'none',
        willChange: 'transform, opacity'
      }} />;
    })}
  </div>;
}

// ---------------------------------------------------------------------------
// App Store download badge (real CTA, Apple-style)
// ---------------------------------------------------------------------------
const APP_STORE_URL =
  'https://apps.apple.com/us/app/peek-ai-personal-finance-app/id6742875016';
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
  return <img src={src} alt={alt} loading="lazy" decoding="async" width={685} height={1400} draggable={false} className={`block h-auto w-full select-none ${className}`} style={{
    transform: `rotate(${rotate}deg)`,
    filter: 'drop-shadow(0 28px 44px rgba(55,0,75,0.30))'
  }} />;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export const PeekLandingPage = () => {
  const personalities = ['The Comfort Seeker', 'The Jetsetter', 'The Convenience Vendor', 'The Ritualist', 'The Treat-Yourself-er', 'The Late-Night Browser'];
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
            <a href="#problem" className="transition-opacity hover:opacity-60">The problem</a>
            <a href="#how" className="transition-opacity hover:opacity-60">How it works</a>
            <a href="#worthit" className="transition-opacity hover:opacity-60">Worth it</a>
            <a href="#stories" className="transition-opacity hover:opacity-60">Stories</a>
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
      <section id="hero" className="relative" style={{
      overflow: 'visible'
    }}>
        <div className="dotgrid pointer-events-none absolute inset-0 opacity-60" />
        {/* real category stickers — burst outward on scroll */}
        <HeroStickers />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-14 md:pt-20 lg:grid-cols-2">
          <div>
            <span className="ff-hand inline-block text-2xl" style={{
            color: RED,
            transform: 'rotate(-3deg)'
          }}>
              see yourself clearly →
            </span>
            <h1 className="ff-display mt-3 text-[clamp(2.6rem,7vw,3.75rem)] font-extrabold leading-[0.98] text-balance" style={{
            color: PURPLE
          }}>
              Your bank sees transactions.{' '}
              <span style={{
              color: ORANGE_CTA
            }}>Peek sees you.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg" style={{
            color: `${PURPLE}cc`
          }}>
              Discover the reasons behind your spending: not just where the money went, but whether
              it was worth it.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <AppStoreButton size="lg" label="Get Peek, it's free" />
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
            text: 'Every money app does the same thing: it sorts your transactions into categories, shows you a dashboard, and tells you to spend less on food.',
            rot: -1.4
          }, {
            icon: '🍕',
            text: "But maybe food is the thing you value most. The real waste is usually somewhere you haven't looked: small, forgettable purchases that don't match who you actually are.",
            rot: 1.2
          }, {
            icon: '🕳️',
            text: 'The problem was never information. The real gap is between what you intend to do and what you actually do, and no spreadsheet has ever closed it.',
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
                Budgeting apps think the problem is math.
              </h2>
              <p className="ff-hand ml-auto mt-6 max-w-sm text-2xl text-pretty" style={{
              color: RED
            }}>
                You already know you shouldn't blow $400 on random Amazon orders.
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
                Peek learns who you are before it says a word.
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[{
            n: '1',
            title: 'Rate your spending: worth it or not.',
            body: 'Every transaction gets one simple question. No judgment, no categories designed for accountants. Just: was this worth it to you? Over time, this builds a picture of what you actually care about.',
            accent: GREEN
          }, {
            n: '2',
            title: 'See your story, not a spreadsheet.',
            body: "Your spending shows up as personal recaps, like Spotify Wrapped for your money. You'll see patterns you'd never catch in a bank statement.",
            accent: '#FE875C'
          }, {
            n: '3',
            title: 'Plan for who you actually are.',
            body: 'Peek suggests realistic numbers based on your actual spending and your own evaluation of it. The path forward is obvious, without anyone lecturing you.',
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
                One question that changes everything.
              </h2>
              <p className="ff-hand mt-4 text-2xl" style={{
              color: RED
            }}>
                worth it, or not. that's it.
              </p>
              <p className="mt-4 max-w-md text-lg" style={{
              color: `${PURPLE}cc`
            }}>
                No five-star ratings. No complicated categories. Just a simple, honest check-in with
                each transaction that teaches Peek who you are: what you value, what you regret, what
                you'd do again.
              </p>
              <p className="mt-4 max-w-md text-lg font-semibold" style={{
              color: PURPLE
            }}>
                The result: an app that actually understands you before it tries to help.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex justify-center">
              <AppScreen src={SCREENS.worthitReview} alt="Peek's worth-it review: mark each purchase guilt-free or not worth it, and turn your ratings into a clearer spending plan" rotate={2.5} className="max-w-[280px] sm:max-w-[300px]" />
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
                  Your spending, told back to you.
                </h2>
                <p className="mt-4 max-w-md text-lg" style={{
                color: `${PURPLE}cc`
              }}>
                  Dashboards are cold. Numbers without context create anxiety. So Peek replaces them
                  with personal spending stories: visual, narrative, easy to read.
                </p>
                <p className="mt-4 max-w-md text-lg" style={{
                color: `${PURPLE}cc`
              }}>
                  Find out if you're a comfort seeker, a jetsetter, or a convenience vendor. A reality
                  check that feels less like a lecture and more like a friend holding up a mirror.
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
                A budget that knows you'll be human.
              </h2>
              <p className="mt-4 max-w-md text-lg" style={{
              color: `${PURPLE}cc`
            }}>
                Traditional budgeting asks you to predict the future from scratch. Most people have no
                idea, so they guess high, feel guilty, or just skip the whole thing.
              </p>
              <p className="mt-4 max-w-md text-lg" style={{
              color: `${PURPLE}cc`
            }}>
                Peek builds plans from what's real: your actual spending, combined with your own sense
                of what was and wasn't worth it. Then it checks in mid-month.
              </p>
              <p className="ff-hand mt-4 text-2xl" style={{
              color: RED
            }}>
                no set-it-and-forget-it. no shame spiral.
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
              We never tell you who you are without your permission.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg" style={{
            color: '#ffffffcc'
          }}>
              Peek doesn't assume. It asks. We give you a structured surface to think on: your
              transactions, your patterns, your annotations. You decide what's worth it. You build
              the story.
            </p>
            <p className="ff-hand mx-auto mt-5 text-2xl" style={{
            color: GREEN
          }}>
              we just make sure you can look at your numbers without flinching.
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
              See what your spending says about you.
            </h2>
            <div className="mt-9 flex flex-col items-center gap-3">
              <AppStoreButton size="lg" variant="orange" label="Download Peek" />
              <span className="ff-hand text-2xl" style={{
              color: '#ffffffcc'
            }}>
                free · iPhone · no spreadsheets, promise
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
          Your money. Your patterns. Your call. · © 2026 Peek
        </p>
      </footer>
    </div>;
};