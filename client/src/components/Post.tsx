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
      <NextLink href={`/post/${post.id}`}>
        <Link>
          <Flex flex={1} flexDirection="column" justifyContent={"center"}>
            <Flex mr={3} mb={5} onClick={(e) => e.preventDefault()}>
              <Heading fontSize="xl">{`@${post.author.username}`}</Heading>
            </Flex>
            <Text>{evalSnippet(post.textSnippet)}</Text>
            {post.children}
          </Flex>
        </Link>
      </NextLink>
    </Flex>
  );
};

export { Post };
