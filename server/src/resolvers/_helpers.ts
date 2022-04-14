import { InputType, Field, ObjectType } from "type-graphql";
import { User } from "../entities/User";

@InputType()
class UsernamePasswordInputResolver {
  @Field()
  username: string;

  @Field()
  password: string;
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

export { UsernamePasswordInputResolver, FieldError, UserResponse };
