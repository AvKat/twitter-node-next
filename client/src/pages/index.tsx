import { Box, Button, Heading, Text, Stack, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { PostsQueryVariables, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/urqlCacheExchangeUpdates";
import { LayoutWithNavbar } from "../components/LayoutWithNavbar";
import { useState } from "react";

const Index: NextPage = ({}) => {
  const [variables, setVariables] = useState<PostsQueryVariables>({
    limit: 10,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });
  const posts = data?.posts.posts || [];

  const fetchMorePosts = () => {
    const cursor = posts[posts.length - 1].createdAt;
    setVariables({ limit: 10, cursor });
  };

  return (
    <LayoutWithNavbar>
      <br />
      <Stack spacing={5}>
        {data &&
          posts.map((post) => (
            <Box p={5} shadow="md" borderWidth="1px" key={post.id}>
              <Heading fontSize="xl">{post.title}</Heading>
              <Text my={5}>{post.textSnippet}</Text>
            </Box>
          ))}
      </Stack>
      {data && !fetching && data.posts.hasMore && (
        <Flex my={8}>
          <Button onClick={fetchMorePosts} m="auto">
            Load More
          </Button>
        </Flex>
      )}
    </LayoutWithNavbar>
  );
};

export default withUrqlClient(createUrqlClient, {
  ssr: true,
})(Index);
