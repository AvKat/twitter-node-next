import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { PostsFieldsFragment } from "../generated/graphql";

type PostProps = PostsFieldsFragment;

const Post: React.FC<PostProps> = (post) => {
  const evalSnippet = (snippet: string) => {
    return snippet.length === 50 ? `${snippet} ...` : snippet;
  };
  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Flex flex={1} mr={3}>
        <Heading fontSize="xl">{post.title}</Heading>
        <Text ml={"auto"} fontWeight="semibold">
          {post.author.username}
        </Text>
      </Flex>
      <Text my={5}>{evalSnippet(post.textSnippet)}</Text>
    </Box>
  );
};

export { Post };
