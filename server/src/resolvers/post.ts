import { Post } from "../entities/Post";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../utils/isAuth";
import { PostInput, PostResponse } from "./_helpers";
import { AppContext } from "../types";
import { validateField } from "../utils/validation";
import { lengthValidator } from "../utils/validation/validators";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find();
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number): Promise<Post | null> {
    return Post.findOneBy({ id });
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: AppContext
  ): Promise<PostResponse> {
    const titleErrors = validateField(input.title, [
      lengthValidator(5, "title"),
    ]);
    const textErrors = validateField(input.text, [lengthValidator(15, "text")]);
    const errors = [...titleErrors, ...textErrors];

    if (errors.length > 0) {
      return { errors };
    }

    const post = await Post.create({
      ...input,
      authorId: req.session.userId,
    }).save();
    return { post };
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title?: string
  ): Promise<Post | null> {
    const post = await Post.findOneBy({ id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    try {
      Post.delete({ id });
      return true;
    } catch (err) {
      return false;
    }
  }
}
