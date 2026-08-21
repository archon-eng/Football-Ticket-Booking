export default function Fixtures() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center px-5 py-12 lg:px-8">
      <section className="w-full rounded-3xl border p-8 border-slate-800 bg-slate-900 lg:p-10">
        <span className="inline-flex rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest border-blue-900/60 text-blue-400">
          Fixtures
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">
          Match calendars presented with clean hierarchy.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          Use this page for kickoff dates, competition filters, and upcoming
          match cards. The light blue-white treatment keeps it readable and
          premium.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Champions League", "Today · 21:00"],
            ["Europa League", "Tomorrow · 00:00"],
            ["Conference League", "Today · 21:00"],
          ].map(([name, time]) => (
            <article
              key={name}
              className="rounded-2xl border bg-linear-to-b from-white to-slate-50/50 p-6 shadow-sm transition-all hover:border-blue-300 border-slate-800 to-slate-900 hover:border-blue-800"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                {name}
              </div>
              <div className="mt-3 text-xl font-bold text-white">
                {time}
              </div>
              <div className="mt-2 text-sm leading-relaxed text-slate-400">
                Live fixtures can sit inside these cards as the product grows.
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
