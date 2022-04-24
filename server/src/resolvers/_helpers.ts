import { InputType, Field, ObjectType } from "type-graphql";
import { Post } from "../entities/Post";
import { User } from "../entities/User";

/*
 * Used for login, where value can be username or email
 */
@InputType()
class UsernameOrEmailPasswordInputResolver {
  @Field()
  usernameOrEmail: string;

  @Field()
  password: string;
}

@InputType()
class UsernameEmailPasswordInputResolver {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
class TokenPasswordInput {
  @Field()
  token: string;

  @Field()
  newPassword: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class PostMutationResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Post, { nullable: true })
  post?: Post;
}

@ObjectType()
class PostsResponse {
  @Field(() => Boolean)
  hasMore: boolean;

  @Field(() => [Post])
  posts: Post[];
}

export {
  UsernameOrEmailPasswordInputResolver,
  UsernameEmailPasswordInputResolver,
  FieldError,
  PostsResponse,
  PostMutationResponse,
  UserResponse,
  TokenPasswordInput,
};
