import Dataloader from "dataloader";
import { In } from "typeorm";
import { User } from "../entities/User";

export const createUserDataloader = () => {
  return new Dataloader<number, User>(async (userIds) => {
    const users = await User.findBy({ id: In(userIds as number[]) });
    const userMap: Record<string, User> = {};
    users.forEach((u) => {
      userMap[u.id] = u;
    });
    return userIds.map((id) => userMap[id]);
  });
};
