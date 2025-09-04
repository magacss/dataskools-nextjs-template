"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation";


/*****************
 * Dataskools – Education Landing (with Mega Menu)
 * - GSAP-like button styling you approved
 * - Mega menu under "Programme" with active + coming-soon items
 * - Prevents React error #130 by ensuring we never render objects
 * - Includes a TestPanel with visual test cases
 * - FIXES:
 *   • Correct template-literal usage for class concatenation
 *   • Fixed all className interpolations using TOKENS.mono
 *   • Removed invalid Tailwind "bg-[${TOKENS.bg}]" usage in className (use inline style)
 *   • Fixed <style> JSX usage for marquee keyframes
 *   • Repaired broken strings/typos (focus-visible, Container className, etc.)
 *****************/

/*******
 * Brand Tokens
 *******/
const TOKENS = {
  bg: "#F1F1F1",
  text: "#121212",
  dark: "#121212",
  lightText: "#F1F1F1",
  accent: "#C9FE6E",
  mono: "font-mono",
}

/*******
 * GSAP-like Button
 *******/
const BASE = [
  "inline-flex items-center justify-center",
  "h-[41px] px-4 rounded-[2px]",
  "font-mono uppercase text-[13px]",
  "transition-transform hover:-translate-y-[1px]",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#121212]",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ")

const VARIANT_CLASSES = {
  outline: "border border-[#121212] text-[#121212] bg-transparent hover:bg-[#121212] hover:text-white",
  solid: "bg-[#C9FE6E] text-[#121212] hover:brightness-95",
  ghost: "text-[#121212] hover:underline",
}

export function GButton({ children, variant = "outline", className = "", arrow = true, ...props }) {
  const isValid = Object.prototype.hasOwnProperty.call(VARIANT_CLASSES, variant)
  const resolved = isValid ? variant : "outline" // safe fallback
  const classes = `${BASE} ${VARIANT_CLASSES[resolved]} ${className}`.trim()
  return (
    <button className={classes} {...props}>
      {children}
      {arrow ? <span className="ml-2 leading-none">↗</span> : null}
    </button>
  )
}

/*******
 * Layout Helpers
 *******/
function Container({ className = "", children }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

function Section({ id, className = "", children, style }) {
  return (
    <section id={id} className={className} style={style}>
      <Container>{children}</Container>
    </section>
  )
}

/*******
 * Mega Menu Data (simple structure with active & coming soon)
 *******/
const MEGA_PROGRAMS = [
  {
    group: "Data",
    items: [
      { label: "Datenanalyse", active: true, href: "#analytics" },
      { label: "Data Science", active: true, href: "#science" },
      { label: "AI Data Science", active: true, href: "#ai-science" },
    ],
  },
  {
    group: "Softwareentwicklung",
    items: [
      { label: "Softwareentwicklung", active: false },
      { label: "AI Engineering", active: false },
      { label: "Cloud Engineering", active: false },
      { label: "QA Engineering", active: false },
      { label: "Webentwicklung", active: false },
    ],
  },
  {
    group: "Cybersecurity",
    items: [
      { label: "Cybersecurity", active: false },
      { label: "AI Cybersecurity", active: false },
      { label: "eHealth Cybersecurity", active: false },
      { label: "IT-Support", active: false },
      { label: "Systemadministration", active: false },
    ],
  },
  {
    group: "Du weißt nicht genau wohin?",
    items: [
      { label: "Orientierungskurs zur Karrierefindung", active: false },
      { label: "Kurse vergleichen", active: false },
    ],
  },
]

/*******
 * Navbar + Mega Menu
 *******/
function useHoverIntent(openCb, closeCb, delay = 120) {
  const timer = useRef(null)
  const onEnter = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => openCb(), 20)
  }
  const onLeave = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => closeCb(), delay)
  }
  useEffect(() => () => timer.current && clearTimeout(timer.current), [])
  return { onEnter, onLeave }
}

function MegaMenu({ open }) {
  // Guard against rendering objects: we map to elements and never return raw objects
  return (
    <div
      role="menu"
      aria-hidden={!open}
      className={`absolute left-0 right-0 top-full border-b border-black/10 shadow-sm transition-opacity ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      style={{ background: TOKENS.bg, color: TOKENS.text }}
    >
      <Container>
        <div className="grid grid-cols-1 gap-10 py-8 md:grid-cols-4">
          {MEGA_PROGRAMS.map((col) => (
            <div key={col.group} className="min-w-0">
              <div className={`${TOKENS.mono} text-xs uppercase opacity-70`}>{col.group}</div>
              <ul className="mt-3 space-y-3">
                {col.items.map((it) => (
                  <li key={it.label}>
                    {it.active ? (
                      <a href={it.href || "#"} className="block">
                        <div className="font-medium hover:underline">{it.label}</div>
                      </a>
                    ) : (
                      <div className="block select-none opacity-60">
                        <div className="font-medium">{it.label}</div>
                        <div className={`${TOKENS.mono} text-[11px] uppercase`}>Coming soon</div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const { onEnter, onLeave } = useHoverIntent(
    () => setOpen(true),
    () => setOpen(false),
  )
  const router = useRouter();

  return (
    <header
      className="sticky top-0 z-40 border-b border-black/10 bg-[var(--bg)]/80 backdrop-blur"
      style={{ "--bg": TOKENS.bg }}
      onMouseLeave={onLeave}
    >
      <Container className="relative flex h-16 items-center justify-between" onMouseEnter={onEnter}>
        <a href="#home" className="flex items-center gap-3" aria-label="dataskools home">
          <div
            className="grid h-9 w-9 place-items-center rounded-xl"
            style={{ background: TOKENS.text, color: TOKENS.bg, fontWeight: 700 }}
          >
            ds
          </div>
          <span className="text-base font-semibold" style={{ color: TOKENS.text }}>
            dataskools
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm md:flex" style={{ color: TOKENS.text }}>
          <button
            className="relative"
            aria-haspopup="menu"
            aria-expanded={open}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
          >
            Programme
          </button>
          <a href="#benefits" className="hover:underline">
            Vorteile
          </a>
          <a href="#process" className="hover:underline">
            Ablauf
          </a>
          <a href="#pricing" className="hover:underline">
            Preise
          </a>
          <a href="#faq" className="hover:underline">
            FAQ
          </a>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <GButton variant="ghost" onClick={() => router.push("/auth/login")}>
  Sign in
</GButton>

        <GButton variant="solid" onClick={() => router.push("/auth/register")}>
  Jetzt bewerben
</GButton>
        </div>
        {/* Mega Menu overlay */}
        <MegaMenu open={open} />
      </Container>
    </header>
  )
}

/*******
 * Hero + Marquee
 *******/
function Marquee() {
  return (
    <div className="overflow-hidden border-y border-black/10" style={{ background: TOKENS.bg, color: TOKENS.text }}>
      <div className="whitespace-nowrap py-6 animate-[marquee_45s_linear_infinite] will-change-transform">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className="mx-8 text-5xl font-medium tracking-tight md:text-6xl">
            Get ready to learn{" "}
            <span className="mx-4 inline-block h-4 w-4 rounded-sm" style={{ background: TOKENS.accent }} />
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  )
}

function Hero() {
  return (
    <div style={{ background: TOKENS.bg, color: TOKENS.text }}>
      <Section id="home" className="py-12 sm:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className={`${TOKENS.mono} uppercase text-xs opacity-70`}>Improve your data skills</p>
            <h1 className="mt-4 text-[42px] leading-[1.05] tracking-[-0.02em] sm:text-6xl">
              Praxisnahe Programme für Data Careers – modern, flexibel und joborientiert.
            </h1>
            <p className="mt-6 max-w-xl text-lg opacity-90">
              Von Data Analytics bis Engineering: Lerne mit Projekten, Mentoring und einer Community, die dich wirklich
              voranbringt.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <GButton variant="outline">Explore programmes</GButton>
              <GButton variant="solid">Jetzt bewerben</GButton>
            </div>
          </div>
          <div className="rounded-lg bg-[#121212] p-2">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-md border border-[#232323] bg-[#0D0D0D]">
              <img
                alt="dashboard preview"
                className="h-full w-full object-cover opacity-90"
                src="https://images.unsplash.com/photo-1551281044-8b89f0491f9b?q=80&w=1600&auto=format&fit=crop"
              />
            </div>
          </div>
        </div>
      </Section>
      <Marquee />
    </div>
  )
}

/*******
 * Benefits (3 cards, dark)
 *******/
function Benefits() {
  const items = [
    { title: "Beginners friendly", text: "Schritt-für-Schritt, viele Beispiele und klare Projekte.", icon: "📘" },
    {
      title: "Easy to implement",
      text: "Code-Snippets & Templates – schnell ins eigene Projekt übertragbar.",
      icon: "⚡",
    },
    { title: "Performance optimized", text: "Sauberer Code, der flüssig läuft – auch in komplexen UIs.", icon: "🚀" },
  ]
  return (
    <div style={{ background: TOKENS.dark, color: TOKENS.lightText }}>
      <Section id="benefits" className="py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="rounded-xl border border-[#232323] bg-[#0D0D0D] p-6">
              <div className="text-4xl" aria-hidden>
                {it.icon}
              </div>
              <h3 className="mt-6 text-[28px] leading-9 tracking-tight">{it.title}</h3>
              <p className="mt-3 text-sm opacity-90">{it.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

/*******
 * Programs
 *******/
const PROGRAMS = [
  {
    id: "analytics",
    title: "Data Analytics",
    badge: "Einsteiger · 12 Wochen",
    desc: "SQL, Excel/Sheets, BI-Dashboards, Grundlagen Statistik & Storytelling.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "science",
    title: "Data Science",
    badge: "Fortgeschritten · 16 Wochen",
    desc: "Python, Pandas, Scikit-learn, ML-Workflow, Experiment Tracking.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "engineering",
    title: "Data Engineering",
    badge: "Fortgeschritten · 16 Wochen",
    desc: "ETL/ELT, Airflow, Warehousing, dbt, Cloud Basics (GCP/AWS).",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop",
  },
]

function Programs() {
  return (
    <Section id="programs" className="py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className={`${TOKENS.mono} uppercase text-xs text-[#121212]/70`}>Programme</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Wähle deinen Track</h2>
        </div>
        <div className="hidden gap-3 sm:flex">
          <GButton variant="outline">Curriculum anfordern</GButton>
          <GButton variant="solid">Jetzt bewerben</GButton>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {PROGRAMS.map((p) => (
          <article key={p.id} className="group overflow-hidden rounded-xl border border-black/10 bg-white">
            <div className="aspect-[16/10] w-full overflow-hidden">
              <img
                src={p.image || "/placeholder.svg"}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-5">
              <div className={`${TOKENS.mono} text-[11px] uppercase opacity-60`}>{p.badge}</div>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm opacity-90">{p.desc}</p>
              <div className="mt-4 flex gap-3">
                <GButton variant="outline">Mehr erfahren</GButton>
                <GButton variant="solid">Jetzt bewerben</GButton>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

/*******
 * Process (3 steps)
 *******/
function Process() {
  const steps = [
    { n: 1, t: "Bewerben", d: "Kurzes Formular, wir melden uns innerhalb von 48h." },
    { n: 2, t: "Lernen", d: "Live + asynchron, reale Projekte, 1:1-Support." },
    { n: 3, t: "Durchstarten", d: "Karriere-Coaching bis zum unterschriebenen Angebot." },
  ]
  return (
    <Section id="process" className="py-16">
      <div className="mb-8">
        <p className={`${TOKENS.mono} uppercase text-xs text-[#121212]/70`}>Ablauf</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">So läuft's ab</h2>
      </div>
      <ol className="grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <li key={s.n} className="rounded-xl border border-black/10 bg-white p-6">
            <div className="mb-3 inline-grid h-9 w-9 place-items-center rounded-full border">
              <span>{s.n}</span>
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{s.t}</h3>
            <p className="mt-2 text-sm opacity-90">{s.d}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

/*******
 * Pricing
 *******/
function Pricing() {
  const plans = [
    {
      name: "Flex",
      price: "€149/Monat",
      features: ["Monatlich kündbar", "Zugang zu allen Modulen", "Community & Events"],
    },
    {
      name: "Pro",
      price: "€1.190",
      badge: "Beliebt",
      features: ["Kompletter Track", "Mentoring & 1:1", "Karriere-Coaching"],
    },
    { name: "Team", price: "Auf Anfrage", features: ["Unternehmenslizenzen", "Onboarding & SSO", "Reporting"] },
  ]
  return (
    <div style={{ background: TOKENS.dark, color: TOKENS.lightText }}>
      <Section id="pricing" className="py-16">
        <div className="mb-8">
          <p className={`${TOKENS.mono} uppercase text-xs opacity-70`}>Preise</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Transparent & fair</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((pl) => (
            <div key={pl.name} className="rounded-xl border border-[#232323] bg-[#0D0D0D] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold tracking-tight">{pl.name}</h3>
                {pl.badge && (
                  <span className="rounded-sm bg-[#C9FE6E] px-2 py-1 text-xs text-[#121212]">{pl.badge}</span>
                )}
              </div>
              <div className="mt-3 text-2xl">{pl.price}</div>
              <ul className="mt-4 space-y-2 text-sm opacity-90">
                {pl.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <GButton variant="solid">Jetzt starten</GButton>
                <GButton variant="outline">Details</GButton>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

/*******
 * FAQ
 *******/
function FAQ() {
  const faqs = [
    {
      q: "Brauche ich Vorkenntnisse?",
      a: "Für Analytics nicht zwingend – Grundverständnis hilft. Für Science/Engineering sind Python/SQL-Grundlagen sinnvoll.",
    },
    {
      q: "Wie viel Zeit sollte ich einplanen?",
      a: "Je nach Track 8–12 Std pro Woche. Live-Sessions sind optional und werden aufgezeichnet.",
    },
    { q: "Gibt es Zertifikate?", a: "Ja, pro Modul sowie ein Abschlusszertifikat pro Track." },
  ]
  return (
    <Section id="faq" className="py-16">
      <div className="mb-8">
        <p className={`${TOKENS.mono} uppercase text-xs text-[#121212]/70`}>FAQ</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Häufige Fragen</h2>
      </div>
      <dl className="space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-xl border border-black/10 bg-white p-6">
            <dt className="text-lg font-semibold tracking-tight">{f.q}</dt>
            <dd className="mt-2 text-sm opacity-90">{f.a}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

/*******
 * Footer
 *******/
function Footer() {
  return (
    <footer style={{ background: TOKENS.dark, color: TOKENS.lightText }}>
      <Section className="py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-[32px] leading-[1.1] tracking-tight">Never miss what's next</h3>
            <form className="mt-6 flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                className="h-[41px] w-full rounded-[2px] border border-[#2a2a2a] bg-transparent px-3 placeholder:text-[#F1F1F1]/50"
                placeholder="Your email"
              />
              <GButton variant="outline">Submit</GButton>
            </form>
            <p className="mt-3 max-w-lg text-xs opacity-60">
              By submitting your email, you’ll be the first to know about updates. You can unsubscribe at any time.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <div className={`${TOKENS.mono} text-xs uppercase opacity-60`}>Social</div>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <a href="#">X (Twitter)</a>
                </li>
                <li>
                  <a href="#">Instagram</a>
                </li>
                <li>
                  <a href="#">Bluesky</a>
                </li>
                <li>
                  <a href="#">LinkedIn</a>
                </li>
              </ul>
            </div>
            <div>
              <div className={`${TOKENS.mono} text-xs uppercase opacity-60`}>Pages</div>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#programs">Programme</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
              </ul>
            </div>
            <div>
              <div className={`${TOKENS.mono} text-xs uppercase opacity-60`}>Contact</div>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <a href="#">Reach us</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          className="mt-10 flex flex-wrap items-center justify-between gap-4 border-top border-white/10 pt-6 text-xs opacity-70"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div>2025 © dataskools</div>
          <div className="flex gap-4">
            <a href="#">Permissions & Terms</a>
            <a href="#">Privacy policy</a>
          </div>
        </div>
      </Section>
    </footer>
  )
}

/*******
 * Test Panel – visual checks
 * (acts as simple test cases in lieu of a test runner)
 *******/
function TestPanel() {
  const comingSoonCount = MEGA_PROGRAMS.reduce((acc, g) => acc + g.items.filter((i) => !i.active).length, 0)
  const activeCount = MEGA_PROGRAMS.reduce((acc, g) => acc + g.items.filter((i) => i.active).length, 0)
  return (
    <Section id="tests" className="py-8">
      <div className={`${TOKENS.mono} uppercase text-xs text-[#121212]/70`}>Tests</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <GButton variant="outline" data-testid="btn-outline">
          Outline
        </GButton>
        <GButton variant="solid" data-testid="btn-solid">
          Solid
        </GButton>
        <GButton variant="ghost" data-testid="btn-ghost">
          Ghost
        </GButton>
        {/* invalid variant on purpose -> should fallback to outline without crashing */}
        <GButton variant={"primary"} data-testid="btn-invalid">
          Invalid variant → fallback
        </GButton>
        {/* extra tests */}
        <GButton variant="solid" disabled data-testid="btn-disabled">
          Disabled
        </GButton>
        <GButton variant="outline" arrow={false} data-testid="btn-no-arrow">
          No Arrow
        </GButton>
      </div>
      <div className="mt-4 grid gap-1 text-xs opacity-70">
        <div>
          Megamenu columns: <span data-testid="mega-columns">{MEGA_PROGRAMS.length}</span>
        </div>
        <div>
          Coming soon items: <span data-testid="coming-soon-count">{comingSoonCount}</span>
        </div>
        <div>
          Active items: <span data-testid="active-count">{activeCount}</span>
        </div>
        <div>
          Programs count: <span data-testid="programs-count">{PROGRAMS.length}</span>
        </div>
        <div className="hidden" aria-hidden>
          {/* Useful for tests to assert IDs exist without visual noise */}
          <ul data-testid="program-ids">
            {PROGRAMS.map((p) => (
              <li key={p.id}>{p.id}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

/*******
 * Page
 *******/
export default function DataskoolsLanding() {
  return (
    <main className="min-h-screen" style={{ background: TOKENS.bg, color: TOKENS.text }}>
      <Navbar />
      <Hero />
      <Benefits />
      <Programs />
      <Process />
      <Pricing />
      <FAQ />
      <TestPanel />
      <Footer />
    </main>
  )
}
