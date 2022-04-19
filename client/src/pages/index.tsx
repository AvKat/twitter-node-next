import { Button, Stack, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { PostsQueryVariables, usePostsQuery } from "../generated/graphql";
import { LayoutWithNavbar } from "../components/LayoutWithNavbar";
import { useState } from "react";
import { createUrqlClient } from "../utils/urql";
import { Post } from "../components/Post";

const Index: NextPage = ({}) => {
  const [variables, setVariables] = useState<PostsQueryVariables>({
    limit: 10,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });
  const posts = data?.posts.posts || [];

  const fetchMorePosts = () => {
    const cursor = posts[posts.length - 1].createdAt;
    setVariables((v) => ({ limit: v.limit, cursor }));
  };

  return (
    <LayoutWithNavbar>
      <br />
      <Stack spacing={5}>
        {data && posts.map((post) => <Post {...post} />)}
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
