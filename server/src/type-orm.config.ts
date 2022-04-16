import { DataSourceOptions } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export const typeOrmConfig: DataSourceOptions = {
  type: "postgres",
  database: "twitter-nn",
  username: "postgres",
  password: "postgres",
  logging: true,
  synchronize: true,
  entities: [Post, User],
};
