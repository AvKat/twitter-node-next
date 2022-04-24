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
import { MIN_POST_TEXT_LENGTH, MIN_POST_TITLE_LENGTH } from "../constants";
import { validationErrors } from "../utils/validation/errors";
import { User } from "../entities/User";
import { LessThan } from "typeorm";

@Resolver(() => Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.text.slice(0, 50);
  }

  @FieldResolver(() => User)
  author(@Root() post: Post, @Ctx() { userLoader }: AppContext) {
    return userLoader.load(post.authorId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { req, updootLoader }: AppContext
  ): Promise<number | null> {
    if (!req.session.userId) return null;

    const updoot = await updootLoader.load({
      postId: post.id,
      userId: req.session.userId,
    });
    return updoot?.value || null;
  }

  @Query(() => PostsResponse)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", { nullable: true }) cursor?: string
  ): Promise<PostsResponse> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const posts = await Post.find({
      order: {
        createdAt: "DESC",
      },
      take: realLimitPlusOne,
      where: {
        createdAt: cursor ? LessThan(new Date(parseInt(cursor))) : undefined,
      },
    });

    const hasMore = posts.length === realLimitPlusOne;
    return { hasMore, posts: posts.slice(0, realLimit) };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | null> {
    return Post.findOne({
      where: { id },
    });
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: AppContext
  ): Promise<PostMutationResponse> {
    const titleErrors = validateField(input.title, [
      lengthValidator(MIN_POST_TITLE_LENGTH, "title"),
    ]);
    const textErrors = validateField(input.text, [
      lengthValidator(MIN_POST_TEXT_LENGTH, "text"),
    ]);
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

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: AppContext,
    @Arg("title", () => String, { nullable: true }) title?: string,
    @Arg("text", () => String, { nullable: true }) text?: string
  ): Promise<PostMutationResponse> {
    const errors = [];

    if (title) {
      const titleErrors = validateField(title, [
        lengthValidator(MIN_POST_TITLE_LENGTH, "title"),
      ]);
      errors.push(...titleErrors);
    }
    if (text) {
      const textErrors = validateField(text, [
        lengthValidator(MIN_POST_TEXT_LENGTH, "text"),
      ]);
      errors.push(...textErrors);
    }

    if (errors.length > 0) {
      return { errors };
    }

    const data = await Post.createQueryBuilder()
      .update()
      .set({ text, title })
      .where('id = :id and "authorId" = :authorId', {
        id,
        authorId: req.session.userId,
      })
      .returning("*")
      .execute();
    const post = data.raw[0];

    if (!post) {
      return { errors: [validationErrors.user.unauthorized] };
    }

    return { post };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: AppContext
  ): Promise<boolean> {
    try {
      await Post.delete({ id, authorId: req.session.userId });
      return true;
    } catch (err) {
      return false;
    }
  }
}
