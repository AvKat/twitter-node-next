import { User } from "../entities/User";
import { EmContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { UserResponse, UsernamePasswordInputResolver } from "./_helpers";

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: EmContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    return em.findOne(User, { id: req.session.userId });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") opts: UsernamePasswordInputResolver,
    @Ctx() { em, req }: EmContext
  ): Promise<UserResponse> {
    if (opts.username.length <= 2) {
      return {
        errors: [
          { field: "username", message: "Length must be greater than 2" },
        ],
      };
    }
    if (opts.password.length < 4) {
      return {
        errors: [
          { field: "password", message: "Length must be greater than 4" },
        ],
      };
    }
    const hashedPassword = await argon2.hash(opts.password);
    const user = em.create(User, {
      username: opts.username,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (e) {
      if (e.code === "23505") {
        return {
          errors: [{ field: "username", message: "Username taken" }],
        };
      }
    }

    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") opts: UsernamePasswordInputResolver,
    @Ctx() { em, req }: EmContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: opts.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "User doesn't exist.",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, opts.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }
}
