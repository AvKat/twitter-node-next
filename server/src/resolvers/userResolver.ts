import { User } from "../entities/User";
import { EmContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import {
  UserResponse,
  UsernameOrEmailPasswordInputResolver,
  UsernameEmailPasswordInputResolver,
  TokenPasswordInput,
} from "./_helpers";
import {
  COOKIE_NAME,
  FORGET_PASSWORD_PREFIX,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from "../constants";
import { validateField } from "../utils/validation";
import {
  emailValidator,
  lengthValidator,
  usernameValidator,
} from "../utils/validation/validators";
import { validationErrors } from "../utils/validation/errors";
import { sendEmail } from "../utils/sendEmails";
import { v4 } from "uuid";

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
    @Arg("options") opts: UsernameEmailPasswordInputResolver,
    @Ctx() { em, req }: EmContext
  ): Promise<UserResponse> {
    const usernameErrors = validateField(opts.username, [
      usernameValidator,
      lengthValidator(MIN_USERNAME_LENGTH, "username"),
    ]);
    const emailErrors = validateField(opts.email, [emailValidator]);
    const passwordErrors = validateField(opts.password, [
      lengthValidator(MIN_PASSWORD_LENGTH, "password"),
    ]);

    const errors = [...usernameErrors, ...emailErrors, ...passwordErrors];

    if (errors.length > 0) return { errors };

    const hashedPassword = await argon2.hash(opts.password);
    const user = em.create(User, {
      username: opts.username,
      email: opts.email,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (e) {
      if (e.code === "23505") {
        let errors;
        if (e.constraint.includes("email")) {
          errors = [validationErrors.email.duplicate];
        } else {
          errors = [validationErrors.username.duplicate];
        }
        return { errors };
      }
    }

    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") opts: UsernameOrEmailPasswordInputResolver,
    @Ctx() { em, req }: EmContext
  ): Promise<UserResponse> {
    const isEmail = opts.usernameOrEmail.includes("@");
    const validators = isEmail
      ? [emailValidator]
      : [lengthValidator(MIN_USERNAME_LENGTH, "username")];
    const errors = validateField(opts.usernameOrEmail, validators);

    if (errors.length > 0) return { errors };

    const user = await em.findOne(
      User,
      isEmail
        ? { email: opts.usernameOrEmail }
        : { username: opts.usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [validationErrors.usernameOrEmail.notExists],
      };
    }

    const valid = await argon2.verify(user.password, opts.password);
    if (!valid) {
      return {
        errors: [validationErrors.password.incorrect],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: EmContext): Promise<boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          console.log(err);
          return;
        }

        resolve(true);
      });
    });
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { em, redis }: EmContext
  ): Promise<boolean> {
    const user = await em.findOne(User, { email });
    if (!user) {
      // Not email. Returns true to prevent random attacks
      return true;
    }

    const token = v4();

    redis.set(FORGET_PASSWORD_PREFIX + token, user.id, "EX", 1000 * 3600 * 24);

    sendEmail(
      email,
      `<a href="http://localhost:3000/forgot-password/${token}">Reset Password</a>`
    );
    return true;
  }

  @Mutation(() => UserResponse)
  async changePasswordFromToken(
    @Arg("options") { token, newPassword }: TokenPasswordInput,
    @Ctx() { em, redis, req }: EmContext
  ): Promise<UserResponse> {
    const passwordErrors = validateField(newPassword, [
      lengthValidator(MIN_PASSWORD_LENGTH, "newPassword", "password"),
    ]);
    if (passwordErrors.length > 0) {
      return { errors: passwordErrors };
    }

    const redis_key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(redis_key);
    if (!userId) {
      return { errors: [validationErrors.token.invalid] };
    }

    const user = await em.findOne(User, { id: parseInt(userId) });
    if (!user) return { errors: [validationErrors.token.invalid] };

    user.password = await argon2.hash(newPassword);
    await em.persistAndFlush(user);

    await redis.del(redis_key);
    req.session.userId = user.id;

    return { user };
  }
}
