import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { AppDataSource } from "../DataSource";
import { Post } from "../entities/Post";
import { Updoot } from "../entities/Updoot";
import { AppContext } from "../types";
import { isAuth } from "../utils/isAuth";

@Resolver()
class UpdootResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("isUp", () => Boolean) isUp: boolean,
    @Ctx() { req }: AppContext
  ): Promise<boolean> {
    const { userId } = req.session;
    const value = isUp ? 1 : -1;

    const doot = await Updoot.findOneBy({ postId, authorId: userId });
    if (doot?.value === value) return true;

    try {
      await AppDataSource.transaction(async (em) => {
        if (doot) {
          await em.update(
            Updoot,
            {
              postId,
              authorId: userId,
            },
            { value }
          );
        } else {
          await em.insert(Updoot, {
            authorId: userId!,
            postId,
            value,
          });
        }
        await em.update(
          Post,
          { id: postId },
          {
            points: () => `points + ${(doot ? 2 : 1) * value}`,
          }
        );
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async unvote(
    @Ctx() { req }: AppContext,
    @Arg("postId", () => Int) postId: number
  ): Promise<boolean> {
    const where = { authorId: req.session.userId, postId };
    const doot = await Updoot.findOneBy(where);

    if (!doot) {
      return true;
    }
    try {
      AppDataSource.transaction(async (em) => {
        await em.delete(Updoot, where);
        await em.update(
          Post,
          { id: postId },
          { points: () => `points - ${doot.value}` }
        );
      });
    } catch (e) {
      console.log(e);
    }
    return true;
  }
}

export { UpdootResolver };
