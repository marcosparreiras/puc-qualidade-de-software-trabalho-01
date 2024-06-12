import { Request, Response, NextFunction } from "express";
import { DomainException } from "../../domain/exceptions/domain-exception";
import { ZodError } from "zod";

export async function errorHandlerMiddleware(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Error during validation",
      errors: error.flatten().fieldErrors,
    });
  }
  if (error instanceof DomainException) {
    return response.status(error.errorCode).json({ message: error.message });
  }

  console.log(error.message);
  return response.status(500).json({ message: "Internal server error" });
}
