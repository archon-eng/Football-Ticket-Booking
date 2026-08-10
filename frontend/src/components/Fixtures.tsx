export default function Fixtures() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center px-5 py-12 lg:px-8">
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 lg:p-10">
        <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-400">
          Fixtures
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Match calendars presented with clean hierarchy.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
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
              className="rounded-2xl border border-slate-200/80 bg-linear-to-b from-white to-slate-50/50 p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 dark:hover:border-blue-800"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {name}
              </div>
              <div className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                {time}
              </div>
              <div className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Live fixtures can sit inside these cards as the product grows.
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
