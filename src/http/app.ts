import express from "express";
import postgres from "postgres";
import cors from "cors";
import { env } from "../../env";
import { listUsersController } from "./controllers/list-users-controller";
import { UserRepositoryRegistry } from "../domain/registry/user-repository-registry";
import { PasswordEncoderRegistry } from "../domain/registry/password-encoder-registry";
import { BcryptPasswordEncoder } from "../adapters/bcrypt-password-encoder";
import { PostgresUserRepository } from "../adapters/postgres-user-repository";
import { createUserController } from "./controllers/create-user-controller";
import { deleteUserController } from "./controllers/delete-user-controller";
import { getUserContoller } from "./controllers/get-user-controller";
import { errorHandlerMiddleware } from "./middlewares/error-handler-middleware";
import type { UserRepository } from "../domain/bondaries/user-repository";
import type { PasswordEncoder } from "../domain/bondaries/password-encoder";
import { updateUserController } from "./controllers/update-user-controller";

const dbConnection = postgres(env.DB_CONNECTION_URL);
const userRepository: UserRepository = new PostgresUserRepository(dbConnection);
const passwordEncoder: PasswordEncoder = new BcryptPasswordEncoder();

UserRepositoryRegistry.set(userRepository);
PasswordEncoderRegistry.set(passwordEncoder);

export const app = express();

app.use(express.json());
app.use(
  cors({
    exposedHeaders: "X-Total-Count",
  })
);

app.get("/users", listUsersController);
app.post("/users", createUserController);
app.get("/users/:id", getUserContoller);
app.put("/users/:id", updateUserController);
app.delete("/users/:id", deleteUserController);

app.use(errorHandlerMiddleware);
