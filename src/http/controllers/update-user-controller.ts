import z from "zod";
import { Request, Response, type NextFunction } from "express";
import { UpdateUserUseCase } from "../../domain/use-cases/update-user-case";

export async function updateUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const paramsSchema = z.object({
      id: z.string(),
    });

    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      oldPassword: z.string(),
      newPassword: z.string(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { name, email, oldPassword, newPassword } = bodySchema.parse(
      request.body
    );

    const { user } = await UpdateUserUseCase.execute({
      userId: id,
      name,
      email,
      newPassword,
      oldPassword,
    });

    return response.status(200).json({ user });
  } catch (error: unknown) {
    next(error);
  }
}
