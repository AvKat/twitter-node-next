import {
  QueryInput,
  Cache,
  DataFields,
  ResolveInfo,
  Variables,
  UpdatesConfig,
} from "@urql/exchange-graphcache";
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
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
  },
};

export { urqlCacheExchangeUpdates };
