import { NextFunction, Request, Response } from "express";

export default function error_handler( err: any, _req: Request, res: Response, _next: NextFunction) {
  return res.status(500).json({
    message: "Something Wrong with the server",
    error: err,
  });
}

