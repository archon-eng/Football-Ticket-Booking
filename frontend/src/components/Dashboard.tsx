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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative mx-auto w-full max-w-7xl px-5 py-10 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border shadow-2xl border-slate-800 bg-slate-900/90">
          <div className="absolute -right-24 -top-20 h-56 w-56 rounded-full 0/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />

          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:py-12">
            <div>
              <span className="inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest border-blue-800 text-blue-400">
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
                  className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Book seats
                </a>
                <a
                  href="/fixtures"
                  className="rounded-full border px-6 py-3 text-sm font-semibold transition-colors border-slate-700 text-slate-200 hover:bg-slate-700"
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
                    className="rounded-2xl border px-4 border-slate-800 bg-slate-800/40"
                  >
                    <div className="text-2xl font-bold text-white">
                      {value}
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                <img
                  src={footballPitchImage}
                  alt="Football on the pitch"
                  className="h-104 w-full object-cover sm:h-120"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 p-4 shadow-lg border-slate-700/50 bg-slate-900/80">
                  <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
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

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 pt-4 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-white">
          Featured Matchday Moments
        </h2>

        <div ref={gridRef} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredImages.map((image, index) => (
            <article
              key={image.src}
              data-card-index={index}
              className={`overflow-hidden rounded-2xl border shadow-md transition-all duration-700 ease-out border-slate-800 bg-slate-900 ${
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
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent" />
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
