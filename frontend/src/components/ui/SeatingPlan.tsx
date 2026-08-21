export default function SeatingPlan() {
  return (
    <div className="rounded-[1.75rem] border p-6 shadow-[0_16px_40px_rgba(30,77,255,0.1)]">
      <div className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
        Seating plan
      </div>
      <div className="mt-4 grid grid-cols-8 gap-2">
        {Array.from({ length: 40 }).map((_, index) => (
          <div
            key={index}
            className={`h-8 rounded-xl border ${
              index % 7 === 0
                ? "border-blue-300 bg-blue-200"
                : index % 5 === 0
                  ? "border-sky-300 bg-sky-100"
                  : ""
            }`}
          />
        ))}
      </div>
      <div className="mt-4 text-sm text-foot-text-secondary">
        A future interactive seat map can reuse this light blue-white system.
      </div>
    </div>
  )
}
