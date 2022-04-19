import { User } from "../entities/User";
import { AppContext } from "../types";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
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
  __prod__,
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

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: AppContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    return User.findOneBy({ id: req.session.userId });
  }

  @FieldResolver(() => String)
  async email(@Ctx() { req }: AppContext, @Root() user: User): Promise<string> {
    if (req.session.userId === user.id) {
      return user.email;
    }

    return "";
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") opts: UsernameEmailPasswordInputResolver,
    @Ctx() { req }: AppContext
  ): Promise<UserResponse> {
    const userName = opts.username.toLowerCase();
    const usernameErrors = validateField(userName, [
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
    const user = await User.create({
      username: userName,
      email: opts.email,
      password: hashedPassword,
    });
    try {
      await user.save();
    } catch (e) {
      if (e.code === "23505") {
        let errors;
        if (e.detail.includes("email")) {
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
    @Ctx() { req }: AppContext
  ): Promise<UserResponse> {
    const uOre = opts.usernameOrEmail.toLowerCase();
    const isEmail = uOre.includes("@");
    const validators = isEmail
      ? [emailValidator]
      : [lengthValidator(MIN_USERNAME_LENGTH, "username")];
    const errors = validateField(uOre, validators);

    if (errors.length > 0) return { errors };

    const user = await User.findOneBy(
      isEmail ? { email: uOre } : { username: uOre }
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
  async logout(@Ctx() { req, res }: AppContext): Promise<boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          return;
        }

        resolve(true);
      });
    });
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") iemail: string,
    @Ctx() { redis }: AppContext
  ): Promise<boolean> {
    const email = iemail.toLowerCase();
    const user = await User.findOneBy({ email });
    if (!user) {
      // Not email. Returns true to prevent random attacks
      return true;
    }

    const token = v4();
    const url = `http://localhost:3000/auth/forgot-password/${token}`;

    redis.set(FORGET_PASSWORD_PREFIX + token, user.id, "EX", 1000 * 3600 * 24);

    if (__prod__) {
      sendEmail(email, `<a href="${url}">Reset Password</a>`);
    } else {
      console.log(url);
    }
    return true;
  }

  @Mutation(() => UserResponse)
  async changePasswordFromToken(
    @Arg("options") { token, newPassword }: TokenPasswordInput,
    @Ctx() { redis, req }: AppContext
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

    const id = parseInt(userId);
    const user = await User.findOneBy({ id });
    if (!user) return { errors: [validationErrors.token.invalid] };

    const password = await argon2.hash(newPassword);
    User.update({ id }, { password });

    await redis.del(redis_key);
    req.session.userId = user.id;

    return { user };
  }
}
