import z from "zod";
import { Request, Response, type NextFunction } from "express";
import { DeleteUserUseCase } from "../../domain/use-cases/delete-user-use-case";

export async function deleteUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const paramsSchema = z.object({
      id: z.string(),
    });

    const { id } = paramsSchema.parse(request.params);
    await DeleteUserUseCase.execute({ userId: id });

    return response.status(204).json();
  } catch (error: unknown) {
    next(error);
  }
}
