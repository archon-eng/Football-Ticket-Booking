import { useEffect, useRef, useState } from "react"
import championsImage from "../assets/argentine_champions.webp"
import emptySeatsImage from "../assets/empty_seats.jpeg"
import footballPitchImage from "../assets/football_on_pitch.jpg"
import neymarMessi from "../assets/neymar_messi.webp"
import ronaldoImage from "../assets/ronaldo.webp"
import stadiumImage from "../assets/venue.jpeg"
import vozinha from "../assets/vozinha.avif"

interface MatchdayMoment {
  src: string
  title: string
  description: string
}

const featuredImages: MatchdayMoment[] = [
  {
    src: stadiumImage,
    title: "Stadium Atmosphere",
    description: "Feel the anticipation build before the first whistle.",
  },
  {
    src: neymarMessi,
    title: "Pitch-Level Energy",
    description: "Follow the match from the sharpest angle on the pitch.",
  },
  {
    src: ronaldoImage,
    title: "Legend Spotlight",
    description: "Celebrate the players who define football's biggest nights.",
  },
  {
    src: championsImage,
    title: "Championship Moments",
    description: "Relive the scenes that turn a fixture into history.",
  },
  {
    src: emptySeatsImage,
    title: "Seats Ready to Book",
    description: "Pick from available sections and secure your place early.",
  },
  {
    src: vozinha,
    title: "Fan Experience",
    description: "Immerse yourself in the authentic matchday environment.",
  },
]

export default function Dashboard() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    Array(featuredImages.length).fill(false),
  )

  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number((entry.target as HTMLElement).dataset.cardIndex)

          if (Number.isNaN(index)) return

          setVisibleCards((current) =>
            current.map((isVisible, currentIndex) =>
              currentIndex === index ? entry.isIntersecting : isVisible,
            ),
          )
        })
      },
      {
        threshold: 0.25,
      },
    )

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll("article")
      cards.forEach((card) => observer.observe(card))
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen text-foot-text-primary">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="relative overflow-hidden rounded-2xl border border-foot-border bg-foot-surface/95 shadow-2xl shadow-black/20">
          <div className="absolute -right-24 -top-20 h-56 w-56 rounded-full bg-foot-red/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-foot-rose/10 blur-3xl" />

          <div className="grid gap-8 px-5 py-7 sm:px-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:py-10">
            <div>
              <span className="inline-flex rounded-full border border-foot-red/40 bg-foot-red/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-foot-rose">
                UEFA-inspired matchday booking
              </span>
              <h1 className="mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
                Lock in your seat for the biggest nights on the pitch.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300">
                Every point matters. Every rivalry runs deep. Claim your spot in
                the stands, track upcoming European fixtures, and feel the noise
                of matchday live.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/booking"
                  className="rounded-full bg-foot-red px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-foot-red/25 transition-all hover:bg-foot-red-hover hover:-translate-y-0.5 active:translate-y-0"
                >
                  Book seats
                </a>
                <a
                  href="/fixtures"
                  className="rounded-full border border-foot-border px-5 py-2.5 text-sm font-semibold text-foot-text-secondary transition-colors hover:bg-foot-surface-hover"
                >
                  View fixtures
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["Instant", "seat access"],
                  ["Guaranteed", "matchday entry"],
                  ["Fast", "booking flow"],
                ].map(([value, label]) => (
                  <div
                    key={value}
                    className="rounded-xl border border-foot-border bg-foot-surface-elevated/60 px-4 py-3"
                  >
                    <div className="text-2xl font-bold text-white">{value}</div>
                    <div className="mt-1 text-sm text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-foot-border bg-foot-surface">
                <img
                  src={footballPitchImage}
                  alt="Football on the pitch"
                  className="h-104 w-full object-cover sm:h-120"
                />
                <div className="absolute inset-0 bg-linear-to-t from-foot-bg/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-foot-border/70 bg-foot-surface/85 p-4 shadow-lg">
                  <div className="text-xs font-semibold uppercase tracking-wider text-foot-rose">
                    Live atmosphere
                  </div>
                  <div className="mt-1 text-base font-semibold text-white">
                    Prime pitch-side section, 90 minutes of relentless
                    intensity.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-2 sm:px-6 lg:px-8 lg:pb-16">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-white">
          Featured Matchday Moments
        </h2>

        <div ref={gridRef} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredImages.map((image, index) => (
            <article
              key={image.src}
              data-card-index={index}
              className={`overflow-hidden rounded-xl border border-foot-border bg-foot-surface shadow-md transition-all duration-700 ease-out ${
                visibleCards[index]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="relative">
                <img
                  src={image.src}
                  alt={image.title || "Matchday moment"}
                  loading="lazy"
                  decoding="async"
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-foot-bg/50 via-transparent to-transparent" />
              </div>
              {(image.title || image.description) && (
                <div className="p-6">
                  {image.title && (
                    <h3 className="text-xl font-semibold text-white">
                      {image.title}
                    </h3>
                  )}
                  {image.description && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {image.description}
                    </p>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
