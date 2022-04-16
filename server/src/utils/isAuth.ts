import { MiddlewareFn } from "type-graphql";
import { AppContext } from "../types";

export const isAuth: MiddlewareFn<AppContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("Not authenticated");
  }

  return next();
};
