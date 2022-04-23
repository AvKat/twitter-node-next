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

@Resolver(() => Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.text.slice(0, 50);
  }

  @Query(() => PostsResponse)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Ctx() { req }: AppContext,
    @Arg("cursor", { nullable: true }) cursor?: string
  ): Promise<PostsResponse> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const userId = req.session.userId || false;

    const replacements: any[] = [realLimitPlusOne];

    if (userId) {
      replacements.push(userId);
    }

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await Post.query(
      `
      SELECT p.*,
      json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email,
        '"createdAt"', u."createdAt",
        '"updatedAt"', u."updatedAt"
      ) author,
      ${
        userId
          ? `(SELECT value FROM updoot WHERE "userId" = $2 AND "postId" = p.id) "voteStatus"`
          : 'null as "voteStatus"'
      }
      FROM post p
      INNER JOIN public.user u on u.id = p."authorId"
      ${cursor ? `WHERE p."createdAt" < $${replacements.length}` : ""}
      ORDER BY p."createdAt" DESC
      LIMIT $1
    `,
      replacements
    );

    const hasMore = posts.length === realLimitPlusOne;
    return { hasMore, posts: posts.slice(0, realLimit) };
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: AppContext
  ): Promise<Post | null> {
    const post = await Post.findOne({
      where: { id },
      relations: {
        author: true,
        updoots: true,
      },
    });
    if (!post) {
      return null;
    }

    let voteStatus = null;
    if (req.session.userId) {
      voteStatus = post.updoots.find(
        (u) => u.userId === req.session.userId
      )?.value;
    }

    return {
      ...post,
      voteStatus: voteStatus || null,
    } as any;
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
