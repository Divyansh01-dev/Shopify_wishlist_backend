import { Request, Response, NextFunction } from "express";

export const verifyApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const headerKey = req.headers["x-api-key"];

  if (!headerKey) {
    return res.status(401).json({
      success: false,
      message: "No API key provided",
    });
  }

  if (headerKey !== process.env.API_KEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid API key",
    });
  }

  next();
};
