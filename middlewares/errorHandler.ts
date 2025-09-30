import AppError from "../utils/app-error";

export default function errorHandler(error, _req, res, next) {
  if (error instanceof AppError || error.name === "AppError") {
    return res.status(error.status).json({ error: error.message });
  } else if (
    error.code === "auth/argument-error" ||
    error.errorInfo?.code === "auth/argument-error"
  ) {
    return res.status(401).json({ error: "Invalid token" });
  }

  next(error);
}
