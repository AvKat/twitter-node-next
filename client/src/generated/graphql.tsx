import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePasswordFromToken: UserResponse;
  createPost: PostMutationResponse;
  deletePost: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  unvote: Scalars['Boolean'];
  updatePost: PostMutationResponse;
  vote: Scalars['Boolean'];
};


export type MutationChangePasswordFromTokenArgs = {
  options: TokenPasswordInput;
};


export type MutationCreatePostArgs = {
  parentId?: InputMaybe<Scalars['Int']>;
  text: Scalars['String'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  options: UsernameOrEmailPasswordInputResolver;
};


export type MutationRegisterArgs = {
  options: UsernameEmailPasswordInputResolver;
};


export type MutationUnvoteArgs = {
  postId: Scalars['Int'];
};


export type MutationUpdatePostArgs = {
  id: Scalars['Int'];
  text?: InputMaybe<Scalars['String']>;
};


export type MutationVoteArgs = {
  isUp: Scalars['Boolean'];
  postId: Scalars['Int'];
};

export type Post = {
  __typename?: 'Post';
  author: User;
  authorId: Scalars['Float'];
  children?: Maybe<Array<Post>>;
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  parent?: Maybe<Post>;
  parentId?: Maybe<Scalars['Int']>;
  points: Scalars['Float'];
  text: Scalars['String'];
  textSnippet: Scalars['String'];
  threadFirstId?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['String'];
  voteStatus?: Maybe<Scalars['Int']>;
};

export type PostMutationResponse = {
  __typename?: 'PostMutationResponse';
  errors?: Maybe<Array<FieldError>>;
  post?: Maybe<Post>;
};

export type PostsResponse = {
  __typename?: 'PostsResponse';
  hasMore: Scalars['Boolean'];
  posts: Array<Post>;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  me?: Maybe<User>;
  post?: Maybe<Post>;
  posts: PostsResponse;
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryPostsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
};

export type TokenPasswordInput = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Float'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernameEmailPasswordInputResolver = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UsernameOrEmailPasswordInputResolver = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};

export type PostMutationResponseFragment = { __typename?: 'PostMutationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, post?: { __typename?: 'Post', id: number, text: string, points: number, voteStatus?: number | null, createdAt: string, textSnippet: string, author: { __typename?: 'User', id: number, username: string } } | null };

export type PostsFieldsFragment = { __typename?: 'Post', id: number, textSnippet: string, points: number, createdAt: string, voteStatus?: number | null, author: { __typename?: 'User', id: number, username: string } };

export type RequiredErrorFieldsFragment = { __typename?: 'FieldError', field: string, message: string };

export type RequiredUserFieldsFragment = { __typename?: 'User', id: number, username: string, email: string };

export type RequiredUserResponseFragment = { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string } | null };

export type SinglePostFieldsFragment = { __typename?: 'Post', id: number, text: string, points: number, voteStatus?: number | null, createdAt: string, textSnippet: string, author: { __typename?: 'User', id: number, username: string } };

export type ChangePasswordFromTokenMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordFromTokenMutation = { __typename?: 'Mutation', changePasswordFromToken: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string } | null } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string } | null } };

export type CreatePostMutationVariables = Exact<{
  text: Scalars['String'];
  parentId?: InputMaybe<Scalars['Int']>;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'PostMutationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, post?: { __typename?: 'Post', id: number, text: string, points: number, voteStatus?: number | null, createdAt: string, textSnippet: string, author: { __typename?: 'User', id: number, username: string } } | null } };

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type UnvoteMutationVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type UnvoteMutation = { __typename?: 'Mutation', unvote: boolean };

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  text?: InputMaybe<Scalars['String']>;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost: { __typename?: 'PostMutationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, post?: { __typename?: 'Post', id: number, text: string, points: number, voteStatus?: number | null, createdAt: string, textSnippet: string, author: { __typename?: 'User', id: number, username: string } } | null } };

export type VoteMutationVariables = Exact<{
  postId: Scalars['Int'];
  isUp: Scalars['Boolean'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string, email: string } | null };

export type PostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PostQuery = { __typename?: 'Query', post?: { __typename?: 'Post', id: number, text: string, points: number, voteStatus?: number | null, createdAt: string, textSnippet: string, author: { __typename?: 'User', id: number, username: string } } | null };

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PostsResponse', hasMore: boolean, posts: Array<{ __typename?: 'Post', id: number, textSnippet: string, points: number, createdAt: string, voteStatus?: number | null, author: { __typename?: 'User', id: number, username: string } }> } };

export const RequiredErrorFieldsFragmentDoc = gql`
    fragment RequiredErrorFields on FieldError {
  field
  message
}
    `;
export const SinglePostFieldsFragmentDoc = gql`
    fragment SinglePostFields on Post {
  id
  text
  points
  author {
    id
    username
  }
  voteStatus
  createdAt
  textSnippet
}
    `;
export const PostMutationResponseFragmentDoc = gql`
    fragment PostMutationResponse on PostMutationResponse {
  errors {
    ...RequiredErrorFields
  }
  post {
    ...SinglePostFields
  }
}
    ${RequiredErrorFieldsFragmentDoc}
${SinglePostFieldsFragmentDoc}`;
export const PostsFieldsFragmentDoc = gql`
    fragment PostsFields on Post {
  id
  textSnippet
  points
  createdAt
  voteStatus
  author {
    id
    username
  }
}
    `;
export const RequiredUserFieldsFragmentDoc = gql`
    fragment RequiredUserFields on User {
  id
  username
  email
}
    `;
export const RequiredUserResponseFragmentDoc = gql`
    fragment RequiredUserResponse on UserResponse {
  errors {
    ...RequiredErrorFields
  }
  user {
    ...RequiredUserFields
  }
}
    ${RequiredErrorFieldsFragmentDoc}
${RequiredUserFieldsFragmentDoc}`;
export const ChangePasswordFromTokenDocument = gql`
    mutation ChangePasswordFromToken($token: String!, $newPassword: String!) {
  changePasswordFromToken(options: {token: $token, newPassword: $newPassword}) {
    ...RequiredUserResponse
  }
}
    ${RequiredUserResponseFragmentDoc}`;

export function useChangePasswordFromTokenMutation() {
  return Urql.useMutation<ChangePasswordFromTokenMutation, ChangePasswordFromTokenMutationVariables>(ChangePasswordFromTokenDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(options: {usernameOrEmail: $usernameOrEmail, password: $password}) {
    ...RequiredUserResponse
  }
}
    ${RequiredUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
  register(options: {username: $username, email: $email, password: $password}) {
    ...RequiredUserResponse
  }
}
    ${RequiredUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($text: String!, $parentId: Int) {
  createPost(text: $text, parentId: $parentId) {
    ...PostMutationResponse
  }
}
    ${PostMutationResponseFragmentDoc}`;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($id: Int!) {
  deletePost(id: $id)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const UnvoteDocument = gql`
    mutation Unvote($postId: Int!) {
  unvote(postId: $postId)
}
    `;

export function useUnvoteMutation() {
  return Urql.useMutation<UnvoteMutation, UnvoteMutationVariables>(UnvoteDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: Int!, $text: String) {
  updatePost(id: $id, text: $text) {
    ...PostMutationResponse
  }
}
    ${PostMutationResponseFragmentDoc}`;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const VoteDocument = gql`
    mutation Vote($postId: Int!, $isUp: Boolean!) {
  vote(postId: $postId, isUp: $isUp)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...RequiredUserFields
  }
}
    ${RequiredUserFieldsFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const PostDocument = gql`
    query Post($id: Int!) {
  post(id: $id) {
    ...SinglePostFields
  }
}
    ${SinglePostFieldsFragmentDoc}`;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'>) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: String) {
  posts(limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      ...PostsFields
    }
  }
}
    ${PostsFieldsFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'>) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};