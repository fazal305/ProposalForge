export function sendError(res, status, message) {
  res.status(status).json({
    error: message,
  })
}
export function sendServerError(res, error) {
  console.error(error)
  res.status(500).json({
    error: 'Something went wrong. Please try again.',
  })
}
