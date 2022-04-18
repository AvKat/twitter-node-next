import { Resolver, ResolverConfig } from "@urql/exchange-graphcache";
import { stringifyVariables } from "urql";
import { Post, PostsQueryVariables, PostsResponse } from "../generated/graphql";

type DataFields = {
  posts: PostsResponse;
};

// Todo: Make it smarter with id'd cursor
const simplePagination: Resolver<
  DataFields,
  PostsQueryVariables,
  PostsResponse | undefined
> = (_parent, fieldArgs, cache, info) => {
  const { parentKey: entityKey, fieldName } = info;

  const allFields = cache.inspectFields(entityKey);
  const fieldInfos = allFields.filter((field) => field.fieldName === fieldName);

  const size = fieldInfos.length;
  if (size === 0) {
    return undefined;
  }

  const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
  const isItInCache = cache.resolve(
    cache.resolve(entityKey, fieldKey) as string,
    "posts"
  );
  info.partial = !isItInCache;

  let hasMore = true;

  const posts: Post[] = [];
  fieldInfos.forEach((fi) => {
    const key = cache.resolve(entityKey, fi.fieldKey) as string;
    const data = cache.resolve(key, "posts") as Post[];

    posts.push(...data);
    const hm = cache.resolve(key, "hasMore");
    if (!hm) {
      hasMore = false;
    }
  });

  return {
    hasMore,
    posts,
    __typename: "PostsResponse",
  };
};

const urqlCacheQueryResolvers: ResolverConfig = {
  Query: {
    posts: simplePagination,
  },
};

export { urqlCacheQueryResolvers };
