import z from "zod";
import { Request, Response, NextFunction } from "express";
import { CreateUserUseCase } from "../../domain/use-cases/create-user-use-case";
import { httpUserPresenter } from "../utils/http-user-presenter";

export async function createUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const { user } = await CreateUserUseCase.execute({ name, email, password });

    const locationUrl = `${request.protocol}://${request.hostname}${
      request.originalUrl
    }/${user.id.toString()}`;

    return response
      .set("Location", locationUrl)
      .status(201)
      .json({ user: httpUserPresenter(user) });
  } catch (error: unknown) {
    next(error);
  }
}
