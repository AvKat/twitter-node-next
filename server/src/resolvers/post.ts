import { Post } from "../entities/Post";
import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../utils/isAuth";
import { PostInput, PostsResponse, PostMutationResponse } from "./_helpers";
import { AppContext } from "../types";
import { validateField } from "../utils/validation";
import { lengthValidator } from "../utils/validation/validators";
import { LessThan } from "typeorm";

@Resolver(() => Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.text.slice(0, 50);
  }

  @Query(() => PostsResponse)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", { nullable: true }) cursor?: string
  ): Promise<PostsResponse> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    let minWhere = null;
    if (cursor) {
      minWhere = new Date(parseInt(cursor));
    }

    const posts = await Post.find({
      where: minWhere ? { createdAt: LessThan(minWhere) } : {},
      take: realLimitPlusOne,
      order: {
        createdAt: "DESC",
      },
    });

    const hasMore = posts.length === realLimitPlusOne;
    return { hasMore, posts: posts.slice(0, realLimit) };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number): Promise<Post | null> {
    return Post.findOneBy({ id });
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: AppContext
  ): Promise<PostMutationResponse> {
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
