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
  createPost: PostResponse;
  deletePost: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  updatePost?: Maybe<Post>;
};


export type MutationChangePasswordFromTokenArgs = {
  options: TokenPasswordInput;
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['Float'];
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


export type MutationUpdatePostArgs = {
  id: Scalars['Float'];
  title?: InputMaybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  authorId: Scalars['Float'];
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  points: Scalars['Float'];
  text: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type PostInput = {
  text: Scalars['String'];
  title: Scalars['String'];
};

export type PostResponse = {
  __typename?: 'PostResponse';
  errors?: Maybe<Array<FieldError>>;
  post?: Maybe<Post>;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  me?: Maybe<User>;
  post?: Maybe<Post>;
  posts: Array<Post>;
};


export type QueryPostArgs = {
  id: Scalars['Float'];
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

export type RequiredErrorFieldsFragment = { __typename?: 'FieldError', field: string, message: string };

export type RequiredPostFieldsFragment = { __typename?: 'Post', id: number, title: string, text: string, points: number, authorId: number };

export type RequiredPostResponseFragment = { __typename?: 'PostResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, post?: { __typename?: 'Post', id: number, title: string, text: string, points: number, authorId: number } | null };

export type RequiredUserFieldsFragment = { __typename?: 'User', id: number, username: string, email: string };

export type RequiredUserResponseFragment = { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string } | null };

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
  title: Scalars['String'];
  text: Scalars['String'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'PostResponse', post?: { __typename?: 'Post', id: number, title: string, text: string, authorId: number } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string, email: string } | null };

export type PostsQueryVariables = Exact<{ [key: string]: never; }>;


export type PostsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', id: number, title: string }> };

export const RequiredErrorFieldsFragmentDoc = gql`
    fragment RequiredErrorFields on FieldError {
  field
  message
}
    `;
export const RequiredPostFieldsFragmentDoc = gql`
    fragment RequiredPostFields on Post {
  id
  title
  text
  points
  authorId
}
    `;
export const RequiredPostResponseFragmentDoc = gql`
    fragment RequiredPostResponse on PostResponse {
  errors {
    ...RequiredErrorFields
  }
  post {
    ...RequiredPostFields
  }
}
    ${RequiredErrorFieldsFragmentDoc}
${RequiredPostFieldsFragmentDoc}`;
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
    mutation CreatePost($title: String!, $text: String!) {
  createPost(input: {title: $title, text: $text}) {
    post {
      id
      title
      text
      authorId
    }
    errors {
      field
      message
    }
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
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
export const PostsDocument = gql`
    query Posts {
  posts {
    id
    title
  }
}
    `;

export function usePostsQuery(options?: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'>) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};