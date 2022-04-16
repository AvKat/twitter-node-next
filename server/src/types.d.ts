import { EntityManager, Connection, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";

export type SessionDataType = {
  userId?: number;
};

export type EmContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: Session & SessionDataType };
  res: Response;
  redis: Redis;
};
