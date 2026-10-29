import { Link } from "react-router-dom"

const questions = [
  {
    question: "How do I find tickets for a fixture?",
    answer:
      "Visit Fixtures to browse the listed matches, then choose Reserve seats to select a seating tier and quantity.",
  },
  {
    question: "Can I choose a seating category?",
    answer:
      "Yes. The reservation form currently offers pitch-side, lower-tier, and upper-tier estimates. Availability and final pricing will be confirmed when checkout is available.",
  },
  {
    question: "Is my booking confirmed after I review the order?",
    answer:
      "No. Reviewing the estimate does not reserve tickets. Payment and ticket confirmation are not yet available through this site.",
  },
  {
    question: "Do I need an account?",
    answer:
      "You can browse venues and fixtures without signing in. An account is available for supporters and venue administrators.",
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
          Clear answers for planning your next matchday.
        </p>
      </header>

      <section
        className="mt-5 divide-y divide-border-subtle"
        aria-label="Frequently asked questions"
      >
        {questions.map(({ question, answer }) => (
          <details key={question} className="group py-5">
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
        <p className="text-sm text-text-muted">Ready to find your fixture?</p>
        <Link
          to="/fixtures"
          className="inline-flex min-h-11 w-fit items-center gap-3 border border-champagne/50 px-5 text-sm font-semibold text-beige transition-colors hover:bg-champagne hover:text-background"
        >
          Browse fixtures <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  )
}
