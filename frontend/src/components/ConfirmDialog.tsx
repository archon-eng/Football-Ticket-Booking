import type { ReactNode } from "react"

interface ConfirmDialogProps {
  isOpen: boolean
  prompt: ReactNode
  confirmLabel: string
  cancelLabel?: string
  onCancel: () => void
  onConfirm: () => void | Promise<void>
  confirming?: boolean
  confirmDisabled?: boolean
}

export default function ConfirmDialog({
  isOpen,
  prompt,
  confirmLabel,
  cancelLabel = "Cancel",
  onCancel,
  onConfirm,
  confirming = false,
  confirmDisabled = false,
}: ConfirmDialogProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-40 bg-black/60"
        onClick={confirming ? undefined : onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof prompt === "string" ? prompt : "Confirmation"}
        className="relative z-50 w-full max-w-md rounded-2xl border border-border-strong bg-surface p-6 shadow-2xl"
      >
        <p className="text-sm leading-7 text-beige">{prompt}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={confirming}
            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={confirming || confirmDisabled}
            className="luxury-button luxury-button-primary px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirming ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
