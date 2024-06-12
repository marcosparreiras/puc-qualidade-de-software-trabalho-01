import z from "zod";
import { Request, Response, type NextFunction } from "express";
import { GetUserUseCase } from "../../domain/use-cases/get-user-use-case";
import { httpUserPresenter } from "../utils/http-user-presenter";

export async function getUserContoller(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const paramsSchema = z.object({
      id: z.string(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { user } = await GetUserUseCase.execute({ userId: id });

    return response.status(200).json({ user: httpUserPresenter(user) });
  } catch (error: unknown) {
    next(error);
  }
}
