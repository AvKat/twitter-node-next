import { cacheExchange } from "@urql/exchange-graphcache";
import { NextUrqlClientConfig } from "next-urql";
import { dedupExchange, fetchExchange } from "urql";
import { isServer } from "..";
import { errorExchange } from "./errorExchange";
import { urqlCacheExchangeUpdates } from "./urqlCacheExchangeUpdates";
import { urqlCacheQueryResolvers } from "./urqlCacheQueryResolvers";

const createUrqlClient: NextUrqlClientConfig = (ssrExchange, ctx) => {
  let cookie;
  if (isServer()) {
    cookie = ctx?.req?.headers.cookie;
  }
  return {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include",
      headers: cookie ? { cookie } : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PostsResponse: () => null,
        },
        updates: urqlCacheExchangeUpdates,
        resolvers: urqlCacheQueryResolvers,
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};

export { createUrqlClient };
