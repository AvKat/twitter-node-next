import { EditIcon } from "@chakra-ui/icons";
import { Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { DootBar } from "../../components/DootBar";
import { LayoutWithNavbar } from "../../components/LayoutWithNavbar";
import { useMeQuery, usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/urql";

const PostPage = () => {
  const router = useRouter();
  const id = parseInt((router.query.id as string) || "");
  const [{ data, error }] = usePostQuery({ variables: { id } });
  const [{ data: me }] = useMeQuery();

  if (error) {
    return <LayoutWithNavbar>{error.message}</LayoutWithNavbar>;
  }
  if (!data?.post) {
    return <LayoutWithNavbar>No post found</LayoutWithNavbar>;
  }

  const date = new Date(parseInt(data.post.createdAt));
  return (
    <LayoutWithNavbar>
      <Flex direction={"column"}>
        <Flex flex={1} flexDirection="column" justifyContent={"center"}>
          <Flex alignItems={"center"}>
            <Heading fontSize="4xl" my={2}>
              {data.post.title}
            </Heading>
            {me?.me?.id === data.post.author.id && (
              <NextLink href={`/post/edit/${data.post.id}`}>
                <IconButton
                  icon={<EditIcon />}
                  aria-label="Edit Post"
                  ml={"auto"}
                />
              </NextLink>
            )}
          </Flex>
          <Text fontWeight="semibold" ml={1} textDecor="underline">
            {`${data.post.author.username}:  ${date.toDateString()}`}
          </Text>
          <Text my={7}>{data.post.text}</Text>
          <DootBar
            {...data.post}
            textSnippet={data.post.text}
            flexDirection="row"
          />
        </Flex>
      </Flex>
    </LayoutWithNavbar>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(PostPage);
