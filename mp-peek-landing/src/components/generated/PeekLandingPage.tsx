import { useEffect, useRef, useState } from 'react';
import { PeekMascot } from './PeekMascot';

// ---------------------------------------------------------------------------
// Peek — marketing / explainer landing page
// Direction: "Sticker Scrapbook" — matches the App Store feel
// Palette + fonts pulled from BluejayFinance/peek-mono-4 (frontend/mobile)
// ---------------------------------------------------------------------------

const PURPLE = '#37004B';
const CREAM = '#FFF0C5';
const GREEN = '#2EEA84';
const RED = '#FF4D6D';

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
function Sticker({
  children,
  rotate = 0,
  className = '',
  style
}: {
  children: React.ReactNode;
  rotate?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold sticker ${className}`} style={{
    transform: `rotate(${rotate}deg)`,
    ...style
  }}>
      
      {children}
    </div>;
}
function SectionLabel({
  children,
  color = PURPLE
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return <span className="ff-display inline-block rounded-full px-4 py-1 text-xs font-extrabold uppercase tracking-[0.18em]" style={{
    background: '#fff',
    color,
    boxShadow: '0 6px 16px -8px rgba(55,0,75,0.4)'
  }}>
      
      {children}
    </span>;
}

// ---------------------------------------------------------------------------
// Interactive: rate a transaction "worth it / not worth it"
// ---------------------------------------------------------------------------
interface Txn {
  emoji: string;
  merchant: string;
  category: string;
  amount: string;
  tag: string;
}
const SAMPLE_TXNS: Txn[] = [{
  emoji: '☕️',
  merchant: 'Blue Bottle Coffee',
  category: 'Coffee, Boba & Small Treats',
  amount: '$6.50',
  tag: 'Ritual'
}, {
  emoji: '🛒',
  merchant: 'Amazon',
  category: 'Shopping',
  amount: '$84.20',
  tag: 'Impulse Buy'
}, {
  emoji: '🍜',
  merchant: 'Late-night delivery',
  category: 'Food Delivery',
  amount: '$28.90',
  tag: 'Comfort'
}, {
  emoji: '🚗',
  merchant: 'Uber',
  category: 'Rideshare',
  amount: '$19.40',
  tag: 'Convenience'
}, {
  emoji: '🎟️',
  merchant: 'Concert tickets',
  category: 'Experience',
  amount: '$120.00',
  tag: 'Celebration'
}];
function WorthItDemo() {
  const [index, setIndex] = useState(0);
  const [worthIt, setWorthIt] = useState(0);
  const [notWorthIt, setNotWorthIt] = useState(0);
  const [verdict, setVerdict] = useState<'worth' | 'not' | null>(null);
  const txn = SAMPLE_TXNS[index];
  function rate(v: 'worth' | 'not') {
    setVerdict(v);
    if (v === 'worth') setWorthIt(n => n + 1);else setNotWorthIt(n => n + 1);
    window.setTimeout(() => {
      setVerdict(null);
      setIndex(i => (i + 1) % SAMPLE_TXNS.length);
    }, 650);
  }
  return <div className="relative w-full max-w-sm rounded-[28px] p-5 sticker" style={{
    background: '#fff',
    border: `2px solid ${PURPLE}14`
  }}>
      
      <div className="mb-3 flex items-center justify-between">
        <span className="ff-display text-xs font-extrabold uppercase tracking-widest" style={{
        color: `${PURPLE}99`
      }}>
          Last 30 days
        </span>
        <span className="ff-hand text-xl" style={{
        color: RED
      }}>
          tap one →
        </span>
      </div>

      <div className="flex items-center gap-3 rounded-2xl p-3 transition-all duration-300" style={{
      background: verdict === 'worth' ? `${GREEN}1f` : verdict === 'not' ? `${RED}1f` : CREAM,
      transform: verdict ? 'scale(0.98)' : 'scale(1)'
    }}>
        
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl" style={{
        background: '#fff'
      }}>
          
          {txn.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="ff-display truncate text-base font-bold" style={{
          color: PURPLE
        }}>
            {txn.merchant}
          </p>
          <p className="truncate text-xs" style={{
          color: `${PURPLE}99`
        }}>
            {txn.category}
          </p>
        </div>
        <span className="ff-display text-base font-extrabold" style={{
        color: PURPLE
      }}>
          {txn.amount}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{
        background: `${PURPLE}0d`,
        color: PURPLE
      }}>
          
          #{txn.tag}
        </span>
        <span className="ff-hand text-base" style={{
        color: `${PURPLE}80`
      }}>
          was it worth it?
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button onClick={() => rate('worth')} className="ff-display rounded-2xl py-3 text-base font-extrabold transition-transform active:scale-95" style={{
        background: GREEN,
        color: '#06351E',
        boxShadow: `0 8px 0 -2px ${GREEN}66`
      }}>
          
          worth it
        </button>
        <button onClick={() => rate('not')} className="ff-display rounded-2xl py-3 text-base font-extrabold transition-transform active:scale-95" style={{
        background: RED,
        color: '#4a0014',
        boxShadow: `0 8px 0 -2px ${RED}66`
      }}>
          
          not worth it
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs" style={{
      color: `${PURPLE}99`
    }}>
        <span className="font-semibold" style={{
        color: '#1d7a4a'
      }}>
          ● {worthIt} worth it
        </span>
        <span className="font-semibold" style={{
        color: '#b3173f'
      }}>
          {notWorthIt} not worth it ●
        </span>
      </div>
    </div>;
}

// ---------------------------------------------------------------------------
// Interactive: tap-to-reveal spending personality (Wrapped style)
// ---------------------------------------------------------------------------
function StoryCard() {
  const [revealed, setRevealed] = useState(false);
  return <button onClick={() => setRevealed(r => !r)} className="group relative w-full max-w-sm overflow-hidden rounded-[28px] p-6 text-left transition-transform duration-300 hover:-translate-y-1" style={{
    background: `linear-gradient(160deg, ${PURPLE} 0%, #5A0A6E 60%, ${RED} 130%)`,
    boxShadow: '0 26px 50px -20px rgba(55,0,75,0.6)',
    minHeight: 380
  }}>
      
      <div className="flex items-center justify-between">
        <span className="ff-display text-xs font-extrabold uppercase tracking-[0.2em]" style={{
        color: '#ffffffcc'
      }}>
          Your 2026 so far
        </span>
        <span className="text-lg">✨</span>
      </div>

      <p className="ff-hand mt-6 text-2xl" style={{
      color: CREAM
    }}>
        your spending personality is…
      </p>

      <div className="relative mt-2 h-[110px]">
        <h3 className={`ff-display absolute text-[42px] font-extrabold leading-none transition-all duration-500 ${revealed ? 'opacity-0 -translate-y-3' : 'opacity-100'}`} style={{
        color: '#fff'
      }}>
          
          tap to <br /> reveal 👀
        </h3>
        <h3 className={`ff-display absolute text-[40px] font-extrabold leading-[0.95] transition-all duration-500 ${revealed ? 'opacity-100' : 'opacity-0 translate-y-3'}`} style={{
        color: CREAM
      }}>
          
          The Comfort <br /> Seeker
        </h3>
      </div>

      <div className={`mt-4 space-y-2 transition-all duration-500 ${revealed ? 'opacity-100' : 'opacity-0'}`}>
        
        <Row label="Comfort buys" value="$312" pct={68} />
        <Row label="Ritual coffee" value="$96" pct={40} />
        <Row label="Late-night delivery" value="$140" pct={55} />
      </div>

      <p className={`ff-hand mt-4 text-xl transition-opacity duration-500 ${revealed ? 'opacity-100' : 'opacity-0'}`} style={{
      color: '#fff'
    }}>
        
        you spend most when you're winding down 🌙
      </p>
    </button>;
}
function Row({
  label,
  value,
  pct
}: {
  label: string;
  value: string;
  pct: number;
}) {
  return <div>
      <div className="flex items-center justify-between text-sm font-semibold" style={{
      color: '#fff'
    }}>
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full" style={{
      background: '#ffffff2e'
    }}>
        <div className="h-full rounded-full" style={{
        width: `${pct}%`,
        background: CREAM
      }} />
      </div>
    </div>;
}

// ---------------------------------------------------------------------------
// Smart plan card with mid-month check-in
// ---------------------------------------------------------------------------
function PlanCard() {
  const caps = [{
    label: 'Self Reward',
    spent: 86,
    cap: 150,
    color: '#FE875C'
  }, {
    label: 'Eating Out',
    spent: 132,
    cap: 200,
    color: GREEN
  }, {
    label: 'Subscriptions',
    spent: 64,
    cap: 60,
    color: RED
  }];
  return <div className="w-full max-w-sm rounded-[28px] p-6 sticker" style={{
    background: '#fff',
    border: `2px solid ${PURPLE}14`
  }}>
      
      <div className="flex items-center justify-between">
        <span className="ff-display text-sm font-extrabold uppercase tracking-widest" style={{
        color: PURPLE
      }}>
          Monthly caps
        </span>
        <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{
        background: CREAM,
        color: PURPLE
      }}>
          Apr 8 – Apr 30
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {caps.map(c => {
        const over = c.spent > c.cap;
        const pct = Math.min(100, Math.round(c.spent / c.cap * 100));
        return <div key={c.label}>
              <div className="flex items-center justify-between text-sm font-semibold" style={{
            color: PURPLE
          }}>
                <span>{c.label}</span>
                <span style={{
              color: over ? RED : `${PURPLE}cc`
            }}>
                  ${c.spent} <span style={{
                color: `${PURPLE}66`
              }}>/ ${c.cap}</span>
                </span>
              </div>
              <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full" style={{
            background: `${PURPLE}12`
          }}>
                <div className="h-full rounded-full transition-all duration-700" style={{
              width: `${pct}%`,
              background: over ? RED : c.color
            }} />
                
              </div>
            </div>;
      })}
      </div>

      <div className="mt-5 rounded-2xl p-3" style={{
      background: CREAM
    }}>
        <p className="ff-hand text-lg" style={{
        color: PURPLE
      }}>
          mid-month check-in 👋
        </p>
        <p className="text-sm" style={{
        color: `${PURPLE}cc`
      }}>
          You're a little over on subscriptions — want to pause one before the cycle ends?
        </p>
      </div>
    </div>;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export const PeekLandingPage = () => {
  const personalities = ['The Comfort Seeker', 'The Jetsetter', 'The Convenience Vendor', 'The Ritualist', 'The Treat-Yourself-er', 'The Late-Night Browser'];
  return <div className="ff-body min-h-screen w-full" style={{
    background: '#FFF7E4',
    color: PURPLE
  }}>
      {/* NAV */}
      <header className="sticky top-0 z-50 w-full" style={{
      backdropFilter: 'blur(8px)',
      background: '#FFF7E4cc'
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
      <section className="relative overflow-hidden">
        <div className="dotgrid pointer-events-none absolute inset-0 opacity-60" />
        {/* floating stickers */}
        <Sticker rotate={-8} className="absolute left-[6%] top-[18%] hidden lg:flex" style={{
        background: GREEN,
        color: '#06351E'
      }}>
          ✓ worth it
        </Sticker>
        <Sticker rotate={7} className="absolute right-[7%] top-[26%] hidden lg:flex" style={{
        background: RED,
        color: '#4a0014'
      }}>
          ✕ not worth it
        </Sticker>
        <Sticker rotate={-5} className="absolute bottom-[12%] left-[10%] hidden xl:flex" style={{
        background: '#fff',
        color: PURPLE
      }}>
          ☕️ #ritual
        </Sticker>

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-14 md:pt-20 lg:grid-cols-2">
          <div>
            <SectionLabel color={RED}>see yourself clearly</SectionLabel>
            <h1 className="ff-display mt-5 text-[44px] font-extrabold leading-[0.98] sm:text-6xl" style={{
            color: PURPLE
          }}>
              Your bank sees <br />
              transactions. <br />
              <span style={{
              color: '#FF6900'
            }}>Peek sees you.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg" style={{
            color: `${PURPLE}cc`
          }}>
              Discover the reasons behind your spending — not just where the money went, but whether
              it was worth it.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="#download" className="ff-display rounded-full px-7 py-3.5 text-lg font-extrabold transition-transform hover:scale-105" style={{
              background: '#FF6900',
              color: '#fff',
              boxShadow: '0 12px 0 -3px #FF690055'
            }}>
                
                Get Peek — it's free
              </a>
              <span className="ff-hand text-xl" style={{
              color: `${PURPLE}99`
            }}>
                on iPhone · 4.4 ★
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full blur-3xl" style={{
            background: `${GREEN}33`
          }} />
            
            <div className="relative flex flex-col items-center gap-5">
              <PeekMascot size={150} className="anim-bob" expression="happy" />
              <WorthItDemo />
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section id="problem" className="relative mx-auto max-w-5xl px-5 py-20">
        <Reveal>
          <div className="text-center">
            <SectionLabel>the problem</SectionLabel>
            <h2 className="ff-display mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl" style={{
            color: PURPLE
          }}>
              Budgeting apps think the problem is math.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[{
          icon: '🧮',
          text: 'Every money app does the same thing: it sorts your transactions into categories, shows you a dashboard, and tells you to spend less on food.',
          rot: -1.5
        }, {
          icon: '🍕',
          text: "But maybe food is the thing you value most. Maybe the real waste is somewhere you haven't looked — those small, forgettable purchases that don't match who you actually are.",
          rot: 1.5
        }, {
          icon: '🕳️',
          text: 'The problem was never information. The real gap is between what you intend to do and what you actually do — and no spreadsheet has ever closed that gap.',
          rot: -1
        }].map((c, i) => <Reveal key={i} delay={i * 90}>
              <div className="h-full rounded-[26px] bg-white p-6 sticker transition-transform hover:-translate-y-1" style={{
            transform: `rotate(${c.rot}deg)`
          }}>
              
                <div className="mb-3 text-3xl">{c.icon}</div>
                <p className="text-[15px] leading-relaxed" style={{
              color: `${PURPLE}d9`
            }}>
                  {c.text}
                </p>
              </div>
            </Reveal>)}
        </div>

        <Reveal delay={120}>
          <p className="ff-hand mx-auto mt-10 max-w-2xl text-center text-2xl" style={{
          color: RED
        }}>
            You already know you shouldn't blow $400 on random Amazon orders.
          </p>
        </Reveal>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative" style={{
      background: PURPLE
    }}>
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <div className="text-center">
              <SectionLabel color={PURPLE}>how it works</SectionLabel>
              <h2 className="ff-display mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl" style={{
              color: CREAM
            }}>
                Peek learns who you are before it says a word.
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[{
            n: '1',
            title: 'Rate your spending — worth it or not.',
            body: "Every transaction gets one simple question. No judgment, no categories designed for accountants. Just: was this worth it to you? Over time, this builds a picture of what you actually care about.",
            accent: GREEN
          }, {
            n: '2',
            title: 'See your story, not a spreadsheet.',
            body: "Your spending shows up as personal recaps — think Spotify Wrapped for your money. You'll see patterns you'd never catch in a bank statement.",
            accent: '#FE875C'
          }, {
            n: '3',
            title: 'Plan for who you actually are.',
            body: 'Peek suggests realistic numbers based on your actual spending and your own evaluation of it. The path forward is obvious — without anyone lecturing you.',
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
              <SectionLabel color={GREEN}>worth it</SectionLabel>
              <h2 className="ff-display mt-5 text-4xl font-extrabold leading-tight sm:text-5xl" style={{
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
                each transaction that teaches Peek who you are — what you value, what you regret,
                what you'd do again.
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
              <WorthItDemo />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURE — STORIES */}
      <section id="stories" className="relative" style={{
      background: CREAM
    }}>
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="order-2 flex justify-center lg:order-1">
                <StoryCard />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="order-1 lg:order-2">
                <SectionLabel color="#FF6900">stories</SectionLabel>
                <h2 className="ff-display mt-5 text-4xl font-extrabold leading-tight sm:text-5xl" style={{
                color: PURPLE
              }}>
                  Your spending, told back to you.
                </h2>
                <p className="mt-4 max-w-md text-lg" style={{
                color: `${PURPLE}cc`
              }}>
                  Dashboards are cold. Numbers without context create anxiety. So Peek replaces them
                  with personal spending stories — visual, narrative, easy to read.
                </p>
                <p className="mt-4 max-w-md text-lg" style={{
                color: `${PURPLE}cc`
              }}>
                  Find out if you're a comfort seeker, a jetsetter, or a convenience vendor. A reality
                  check that feels less like a lecture and more like a friend holding up a mirror.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {personalities.map((p, i) => <span key={p} className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold sticker" style={{
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
              <SectionLabel color="#FE875C">smart plans</SectionLabel>
              <h2 className="ff-display mt-5 text-4xl font-extrabold leading-tight sm:text-5xl" style={{
              color: PURPLE
            }}>
                A budget that knows you'll be human.
              </h2>
              <p className="mt-4 max-w-md text-lg" style={{
              color: `${PURPLE}cc`
            }}>
                Traditional budgeting asks you to predict the future from scratch. Most people have
                no idea — so they guess high, feel guilty, or just skip the whole thing.
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
              <PlanCard />
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
            <PeekMascot size={84} className="anim-bob mx-auto" expression="wink" />
            <h2 className="ff-display mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl" style={{
            color: CREAM
          }}>
              We never tell you who you are without your permission.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg" style={{
            color: '#ffffffcc'
          }}>
              Peek doesn't assume. It asks. We give you a structured surface to think on — your
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
      <section id="download" className="relative mx-auto max-w-5xl px-5 py-24 text-center">
        <Reveal>
          <h2 className="ff-display mx-auto max-w-2xl text-5xl font-extrabold leading-[1.02] sm:text-6xl" style={{
          color: PURPLE
        }}>
            See what your spending says about you.
          </h2>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a href="#" className="ff-display rounded-full px-9 py-4 text-xl font-extrabold transition-transform hover:scale-105" style={{
            background: '#FF6900',
            color: '#fff',
            boxShadow: '0 14px 0 -3px #FF690055'
          }}>
              
              Download Peek
            </a>
            <span className="ff-hand text-2xl" style={{
            color: `${PURPLE}99`
          }}>
              free · iPhone · no spreadsheets, promise
            </span>
          </div>
        </Reveal>
      </section>

      {/* worth-it marquee */}
      <div className="overflow-hidden border-t py-5" style={{
      background: PURPLE,
      borderColor: '#ffffff1a'
    }}>
        <div className="marquee-track flex w-max gap-4 whitespace-nowrap">
          {[...Array(2)].map((_, dup) => <div key={dup} className="flex gap-4">
              {['☕️ ritual', '🛒 impulse', '🍜 comfort', '🚗 convenience', '🎟️ celebration', '🌙 late-night', '✨ aesthetic'].map((t, i) => <span key={`${dup}-${i}`} className="ff-display rounded-full px-4 py-1.5 text-sm font-bold" style={{
            background: i % 2 ? GREEN : '#FE875C',
            color: PURPLE
          }}>
                
                    {t}
                  </span>)}
            </div>)}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <PeekMascot size={30} />
            <span className="ff-display text-xl font-extrabold lowercase" style={{
            color: PURPLE
          }}>
              peek
            </span>
          </div>
          <p className="text-sm" style={{
          color: `${PURPLE}99`
        }}>
            Your money. Your patterns. Your call. · © 2026 Peek
          </p>
        </div>
      </footer>
    </div>;
};