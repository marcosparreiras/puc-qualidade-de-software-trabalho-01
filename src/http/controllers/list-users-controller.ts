import z from "zod";
import { Request, Response, type NextFunction } from "express";
import { ListUsersUseCase } from "../../domain/use-cases/list-users-use-case";
import { httpUserPresenter } from "../utils/http-user-presenter";

export async function listUsersController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const querySchema = z.object({
      page: z.coerce.number().default(1),
    });

    const { page } = querySchema.parse(request.query);
    const { users } = await ListUsersUseCase.execute({ page });

    return response
      .status(200)
      .set("X-Total-Count", users.length.toString())
      .json({ users: users.map(httpUserPresenter) });
  } catch (error: unknown) {
    next(error);
  }
}
