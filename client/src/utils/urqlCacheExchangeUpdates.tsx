import {
  QueryInput,
  Cache,
  DataFields,
  ResolveInfo,
  Variables,
  UpdatesConfig,
  cacheExchange,
} from "@urql/exchange-graphcache";
import { NextUrqlClientConfig } from "next-urql";
import { dedupExchange, fetchExchange } from "urql";
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
  ChangePasswordFromTokenMutation,
} from "../generated/graphql";

function betterUpdateQuery<Res, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Res, query: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

type UrqlMutationUpdaterType = (
  parent: DataFields,
  args: Variables,
  cache: Cache,
  info: ResolveInfo
) => void;

const login: UrqlMutationUpdaterType = (_result, _args, cache, _info) => {
  betterUpdateQuery<LoginMutation, MeQuery>(
    cache,
    { query: MeDocument },
    _result,
    (result, query) => {
      if (result.login.errors) {
        return query;
      } else {
        return {
          me: result.login.user,
        };
      }
    }
  );
};

const register: UrqlMutationUpdaterType = (_result, _args, cache, _info) => {
  betterUpdateQuery<RegisterMutation, MeQuery>(
    cache,
    { query: MeDocument },
    _result,
    (result, query) => {
      if (result.register.errors) {
        return query;
      } else {
        return {
          me: result.register.user,
        };
      }
    }
  );
};

const changePasswordFromToken: UrqlMutationUpdaterType = (
  _result,
  _args,
  cache,
  _info
) => {
  betterUpdateQuery<ChangePasswordFromTokenMutation, MeQuery>(
    cache,
    { query: MeDocument },
    _result,
    (result, query) => {
      if (result.changePasswordFromToken.errors) {
        return query;
      } else {
        return {
          me: result.changePasswordFromToken.user,
        };
      }
    }
  );
};

const logout: UrqlMutationUpdaterType = (_result, _args, cache, _info) => {
  betterUpdateQuery<LogoutMutation, MeQuery>(
    cache,
    { query: MeDocument },
    _result,
    () => ({ me: null })
  );
};

const urqlCacheExchangeUpdates: Partial<UpdatesConfig> = {
  Mutation: {
    login,
    register,
    logout,
    changePasswordFromToken,
  },
};

const createUrqlClient: NextUrqlClientConfig = (ssrExchange) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: { credentials: "include" },
  suspense: true,
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: urqlCacheExchangeUpdates,
    }),
    ssrExchange,
    fetchExchange,
  ],
});

export { createUrqlClient, urqlCacheExchangeUpdates };
