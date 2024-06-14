import { Request, Response, NextFunction } from "express";
import type { Sql } from "postgres";

export function deleteAllUsersControllerFactory(dbConnection: Sql) {
  async function deleteAllUsersController(
    _request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      await dbConnection`DELETE FROM users`;
      response.status(204).json();
    } catch (error: unknown) {
      next(error);
    }
  }
  return deleteAllUsersController;
}
