import type { ErrorRequestHandler } from "express"

const clientErrorMessages: Record<number, string> = {
  400: "We could not process your request because the submitted information is invalid. Please review your details and try again.",
  401: "Your session is no longer valid. Please sign in and try again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource could not be found.",
  409: "Your request could not be completed because it conflicts with the current state. Please review your details and try again.",
  413: "The submitted request exceeds the permitted size. Please refine your submission and try again.",
  429: "Too many requests were received. Please wait a moment and try again.",
}

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
  const status = errorStatus >= 400 && errorStatus < 600 ? errorStatus : 500

  if (status >= 500) {
    res.status(status).json({
      message:
        "We were unable to complete your request at this time. Please try again shortly.",
    })
    return
  }

  const errorMessage =
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.trim().length > 0
      ? error.message
      : undefined

  res.status(status).json({
    message: clientErrorMessages[status] ?? errorMessage ?? clientErrorMessages[400],
  })
}
