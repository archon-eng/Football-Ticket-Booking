export default function SeatingPlan() {
  return (
    <div className="rounded-2xl border border-foot-border bg-foot-surface p-6 shadow-xl shadow-black/20">
      <div className="text-sm font-semibold uppercase tracking-[0.22em] text-foot-rose">
        Seating plan
      </div>
      <div className="mt-5 grid grid-cols-8 gap-2">
        {Array.from({ length: 40 }).map((_, index) => (
          <div
            key={index}
            className={`aspect-square rounded-md border ${
              index % 7 === 0
                ? "border-foot-red bg-foot-red"
                : index % 5 === 0
                  ? "border-foot-rose bg-foot-rose"
                  : "border-foot-border bg-foot-surface-elevated"
            }`}
          />
        ))}
      </div>
      <div className="mt-4 text-sm leading-relaxed text-foot-text-secondary">
        Available sections are highlighted in red. Seat selection will update
        live.
      </div>
    </div>
  )
}
