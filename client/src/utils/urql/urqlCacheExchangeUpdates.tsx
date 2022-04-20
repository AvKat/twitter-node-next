import {
  QueryInput,
  Cache,
  DataFields,
  ResolveInfo,
  Variables,
  UpdatesConfig,
} from "@urql/exchange-graphcache";
import { gql } from "urql";
import {
  MeQuery,
  MeDocument,
  LogoutMutation,
  UserResponse,
  VoteMutationVariables,
} from "../../generated/graphql";
import { invalidatePosts } from "./_helpers";

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
    // Switch to a better method with lesser data load
    invalidatePosts(cache);
  };
}

const logout: UrqlMutationUpdaterType = (_result, _args, cache, _info) => {
  betterUpdateQuery<LogoutMutation, MeQuery>(
    cache,
    { query: MeDocument },
    _result,
    () => ({ me: null })
  );
  invalidatePosts(cache);
};

const createPost: UrqlMutationUpdaterType = (_result, _args, cache, _info) => {
  invalidatePosts(cache);
};

const ReqPostFragment = gql`
  fragment _ on Post {
    id
    points
    voteStatus
  }
`;
const updateVote: UrqlMutationUpdaterType = (_result, args, cache, _info) => {
  const { postId, isUp } = args as VoteMutationVariables;
  const isVoting = typeof isUp !== "undefined";

  const post = cache.readFragment(ReqPostFragment, { id: postId });

  if (post) {
    let params;
    if (isVoting) {
      // Vote is called
      const value = isUp ? 1 : -1;
      const realValue = (post.voteStatus ? 2 : 1) * value;

      if (post.voteStatus === value) return;
      params = {
        id: postId,
        points: post.points + realValue,
        voteStatus: value,
      };
    } else {
      // Unvote is called
      params = {
        id: postId,
        points: post.points - post.voteStatus,
        voteStatus: null,
      };
    }

    cache.writeFragment(ReqPostFragment, params);
  }
};

const urqlCacheExchangeUpdates: Partial<UpdatesConfig> = {
  Mutation: {
    login: createMeQueryUpdater("login"),
    register: createMeQueryUpdater("register"),
    changePasswordFromToken: createMeQueryUpdater("changePasswordFromToken"),
    logout,
    createPost,
    vote: updateVote,
    unvote: updateVote,
  },
};

export { urqlCacheExchangeUpdates };
