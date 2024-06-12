import { Request, Response } from "express";

export function myController(request: Request, response: Response) {
  return response.status(200).send("Hello World");
}
