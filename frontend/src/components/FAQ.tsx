import { Link } from "react-router-dom"

const questions = [
  {
    question: "How can I explore tickets for a fixture?",
    answer:
      "Browse Fixtures, select a match, and choose Explore seating to review the available tiers and estimate.",
  },
  {
    question: "Can I choose a seating tier?",
    answer:
      "Yes. The estimate currently includes pitch-side, lower-tier, and upper-tier options. Final availability and pricing will be confirmed when checkout is introduced.",
  },
  {
    question: "Is my seat reserved when I review an estimate?",
    answer:
      "No. Reviewing an estimate does not reserve a seat. Checkout and ticket confirmation are not yet available.",
  },
  {
    question: "Do I need an account to explore?",
    answer:
      "No. You can explore venues and fixtures without signing in. Accounts are available for supporters and venue administrators.",
  },
]

export default function FAQ() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <header className="max-w-3xl border-b border-border pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
          Guest services
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-normal text-beige sm:text-5xl">
          A few helpful details.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted">
          Straightforward answers to help you plan your next matchday.
        </p>
      </header>

      <section
        className="mt-6 grid gap-3"
        aria-label="Frequently asked questions"
      >
        {questions.map(({ question, answer }) => (
          <details
            key={question}
            className="luxury-card luxury-card-interactive group px-5 py-2"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-2 font-display text-lg font-semibold tracking-normal text-beige marker:hidden">
              {question}
              <span
                className="text-xl font-normal text-champagne transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="max-w-3xl pb-2 pr-8 pt-3 text-sm leading-7 text-text-secondary">
              {answer}
            </p>
          </details>
        ))}
      </section>

      <div className="mt-12 flex flex-col justify-between gap-5 border-t border-border pt-7 sm:flex-row sm:items-center">
        <p className="text-sm text-text-muted">
          Ready to discover your next fixture?
        </p>
        <Link
          to="/fixtures"
          className="luxury-button luxury-button-primary"
        >
          Explore fixtures <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  )
}
