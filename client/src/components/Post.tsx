import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { PostsFieldsFragment } from "../generated/graphql";
import { DootBar } from "./DootBar";

type PostProps = PostsFieldsFragment;

const Post: React.FC<PostProps> = (post) => {
  const evalSnippet = (snippet: string) => {
    return snippet.length === 50 ? `${snippet} ...` : snippet;
  };
  return (
    <Flex p={5} shadow="md" borderWidth="1px">
      <DootBar {...post} />
      <Flex flex={1} flexDirection="column" justifyContent={"center"}>
        <Flex mr={3} mb={5}>
          <NextLink href={`/post/${post.id}`}>
            <Link>
              <Heading fontSize="xl">{post.title}</Heading>
            </Link>
          </NextLink>
          <Text ml={"auto"} fontWeight="semibold">
            {post.author.username}
          </Text>
        </Flex>
        <Text>{evalSnippet(post.textSnippet)}</Text>
        {post.children}
      </Flex>
    </Flex>
  );
};

export { Post };
