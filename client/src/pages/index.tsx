import { Box, List, ListItem } from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { Navbar } from "../components/Navbar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/urqlCacheExchangeUpdates";

const Index: NextPage = ({}) => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <Navbar />
      <Box>Hi</Box>
      <br />
      <List>
        {data &&
          data.posts.map((post) => (
            <ListItem key={post.id}>{post.title}</ListItem>
          ))}
      </List>
    </>
  );
};

export default withUrqlClient(createUrqlClient, {
  ssr: true,
})(Index);
