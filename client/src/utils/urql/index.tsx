import { cacheExchange } from "@urql/exchange-graphcache";
import { NextUrqlClientConfig } from "next-urql";
import { dedupExchange, fetchExchange } from "urql";
import { errorExchange } from "./errorExchange";
import { urqlCacheExchangeUpdates } from "./urqlCacheExchangeUpdates";
import { urqlCacheQueryResolvers } from "./urqlCacheQueryResolvers";

const createUrqlClient: NextUrqlClientConfig = (ssrExchange) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: { credentials: "include" },
  suspense: true,
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
});

export { createUrqlClient };
