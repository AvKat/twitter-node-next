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
import { PostsResponse, PostMutationResponse } from "./_helpers";
import { AppContext } from "../types";
import { validateField } from "../utils/validation";
import { lengthValidator } from "../utils/validation/validators";
import { MIN_POST_TEXT_LENGTH } from "../constants";
import { validationErrors } from "../utils/validation/errors";
import { User } from "../entities/User";

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

  @FieldResolver(() => [Post], { nullable: true })
  async children(@Root() post: Post) {
    return Post.findBy({ parentId: post.id });
  }

  @Query(() => PostsResponse)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", { nullable: true }) cursor?: string
  ): Promise<PostsResponse> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const qb = Post.createQueryBuilder()
      .where('"parentId" is null')
      .take(realLimitPlusOne)
      .orderBy('"createdAt"', "DESC");

    if (cursor) {
      qb.andWhere('"createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    }

    const posts = await qb.getMany();
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
    @Arg("text") text: string,
    @Ctx() { req }: AppContext,
    @Arg("parentId", () => Int, { nullable: true }) parentId?: number
  ): Promise<PostMutationResponse> {
    const errors = validateField(text, [
      lengthValidator(MIN_POST_TEXT_LENGTH, "text"),
    ]);

    if (errors.length > 0) {
      return { errors };
    }

    const post = await Post.create({
      text,
      parentId,
      authorId: req.session.userId,
    }).save();
    return { post };
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: AppContext,
    @Arg("text", () => String, { nullable: true }) text?: string
  ): Promise<PostMutationResponse> {
    if (text) {
      const errors = validateField(text, [
        lengthValidator(MIN_POST_TEXT_LENGTH, "text"),
      ]);
      if (errors.length > 0) {
        return { errors };
      }
    }

    const data = await Post.createQueryBuilder()
      .update()
      .set({ text })
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
