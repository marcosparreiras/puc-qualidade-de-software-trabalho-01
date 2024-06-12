import type { UserEntity } from "../../domain/entities/user-entity";

interface HttpUserPresenter {
  _id: string;
  name: string;
  email: string;
}

export function httpUserPresenter(user: UserEntity): HttpUserPresenter {
  return {
    _id: user.id,
    name: user.name,
    email: user.email,
  };
}
