import Dataloader from "dataloader";
import { Updoot } from "../entities/Updoot";

type KeyType = { postId: number; userId: number };

export const createUpdootDataloader = () => {
  return new Dataloader<KeyType, Updoot | null>(async (keys) => {
    const updoots = await Updoot.createQueryBuilder()
      .whereInIds(keys)
      .getMany();

    const updootsMap: Record<string, Updoot> = {};
    updoots.forEach((u) => {
      updootsMap[`${u.userId}|${u.postId}`] = u;
    });
    return keys.map((k) => {
      return updootsMap[`${k.userId}|${k.postId}`] || null;
    });
  });
};
