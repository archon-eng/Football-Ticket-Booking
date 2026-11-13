interface SeatingPlanProps {
  selectedSeats: string[]
  onSeatToggle: (seat: string) => void
  maxSeats: number
}

const seats = Array.from({ length: 40 }, (_, index) => ({
  id: `${String.fromCharCode(65 + Math.floor(index / 8))}${(index % 8) + 1}`,
  occupied: index % 11 === 0 || index % 13 === 0,
}))

export default function SeatingPlan({
  selectedSeats,
  onSeatToggle,
  maxSeats,
}: SeatingPlanProps) {
  return (
    <section
      aria-labelledby="seat-map-heading"
      className="luxury-card p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="seat-map-heading"
            className="font-display text-xl font-semibold tracking-normal text-beige"
          >
            Choose your seats
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Select up to {maxSeats} seats.
          </p>
        </div>
        <span className="text-xs tabular-nums text-champagne">
          {selectedSeats.length} / {maxSeats} selected
        </span>
      </div>

      <div className="mx-auto mt-7 h-1 max-w-[72%] bg-champagne/70" />
      <p className="mb-6 mt-2 text-center text-[0.65rem] uppercase tracking-[0.18em] text-text-muted">
        Pitch
      </p>

      <div
        className="mx-auto grid max-w-md grid-cols-8 gap-2 sm:gap-3"
        role="group"
        aria-label="Available seats"
      >
        {seats.map(({ id, occupied }) => {
          const isSelected = selectedSeats.includes(id)
          const isAtLimit = selectedSeats.length >= maxSeats

          return (
            <button
              key={id}
              type="button"
              disabled={occupied || (!isSelected && isAtLimit)}
              aria-label={`Seat ${id}, ${occupied ? "occupied" : isSelected ? "selected" : "available"}`}
              aria-pressed={isSelected}
              onClick={() => onSeatToggle(id)}
              className={`aspect-square border transition-colors disabled:cursor-not-allowed ${
                occupied
                  ? "rounded-sm border-border-subtle bg-surface-hover opacity-45"
                  : isSelected
                    ? "rounded-sm border-champagne bg-champagne text-background shadow-[0_0_16px_rgb(214_193_155_/24%)]"
                    : "rounded-sm border-border bg-surface text-text-secondary hover:border-champagne/70 hover:bg-surface-hover hover:text-beige"
              }`}
            >
              <span
                aria-hidden="true"
                className="block text-[0.58rem] sm:text-xs"
              >
                {id}
              </span>
            </button>
          )
        })}
      </div>

      <div
        className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-text-muted"
        aria-label="Seat legend"
      >
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 border border-border" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 border border-champagne bg-champagne" />
          Selected
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 border border-border-subtle bg-surface-hover opacity-45" />
          Occupied
        </span>
      </div>
    </section>
  )
}
