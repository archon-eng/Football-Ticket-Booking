import type { ErrorRequestHandler } from "express"

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error)
    return
  }

  console.error("Unhandled request error:", error)
  const errorStatus =
    typeof error === "object" && error !== null
      ? "status" in error && typeof error.status === "number"
        ? error.status
        : "statusCode" in error && typeof error.statusCode === "number"
          ? error.statusCode
          : 500
      : 500
  const status = errorStatus >= 400 && errorStatus < 500 ? errorStatus : 500

  res.status(status).json({
    message:
      status === 413
        ? "The submitted request exceeds the permitted size. Please refine your submission and try again."
        : status === 400
          ? "We could not process your request because the submitted information is invalid. Please review your details and try again."
          : "We were unable to complete your request at this time. Please try again shortly.",
  })
}
