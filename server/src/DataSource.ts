import { DataSource, DataSourceOptions } from "typeorm";
import { Post } from "./entities/Post";
import { Updoot } from "./entities/Updoot";
import { User } from "./entities/User";

const typeOrmConfig: DataSourceOptions = {
  type: "postgres",
  database: "twitter-nn",
  username: "postgres",
  password: "postgres",
  logging: true,
  synchronize: true,
  entities: [Post, User, Updoot],
};

export const AppDataSource = new DataSource(typeOrmConfig);
