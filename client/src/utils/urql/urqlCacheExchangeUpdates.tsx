import {
  QueryInput,
  Cache,
  DataFields,
  ResolveInfo,
  Variables,
  UpdatesConfig,
} from "@urql/exchange-graphcache";
import {
  MeQuery,
  MeDocument,
  LogoutMutation,
  UserResponse,
} from "../../generated/graphql";

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

type GeneralMeQueryUpdate = {
  [name: string]: UserResponse;
};

function createMeQueryUpdater(mutationName: string): UrqlMutationUpdaterType {
  return (_result, _args, cache, _info) => {
    betterUpdateQuery<GeneralMeQueryUpdate, MeQuery>(
      cache,
      { query: MeDocument },
      _result,
      (result, query) => {
        if (result[mutationName].errors) {
          return query;
        } else {
          return {
            me: result[mutationName].user,
          };
        }
      }
    );
  };
}

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
    login: createMeQueryUpdater("login"),
    register: createMeQueryUpdater("register"),
    changePasswordFromToken: createMeQueryUpdater("changePasswordFromToken"),
    logout,
  },
};

export { urqlCacheExchangeUpdates };
