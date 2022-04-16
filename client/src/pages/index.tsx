import { Button, List, ListItem } from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/urqlCacheExchangeUpdates";
import NextLink from "next/link";
import { LayoutWithNavbar } from "../components/LayoutWithNavbar";

const Index: NextPage = ({}) => {
  const [{ data }] = usePostsQuery();

  return (
    <LayoutWithNavbar>
      <NextLink href={"/create-post"}>
        <Button type="button" bgColor={"teal"} my={4} color="white">
          Create Post
        </Button>
      </NextLink>
      <br />
      <List>
        {data &&
          data.posts.map((post) => (
            <ListItem key={post.id}>{post.title}</ListItem>
          ))}
      </List>
    </LayoutWithNavbar>
  );
};

export default withUrqlClient(createUrqlClient, {
  ssr: true,
})(Index);
