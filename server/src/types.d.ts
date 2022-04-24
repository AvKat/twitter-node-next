import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";
import { createUpdootDataloader } from "./utils/createUpdootDataloader";
import { createUserDataloader } from "./utils/createUserDataloader";

export type SessionDataType = {
  userId?: number;
};

export type AppContext = {
  req: Request & { session: Session & SessionDataType };
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserDataloader>;
  updootLoader: ReturnType<typeof createUpdootDataloader>;
};
