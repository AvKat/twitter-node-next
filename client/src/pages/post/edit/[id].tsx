import { Box, Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { InputField } from "../../../components/InputField";
import { LayoutWithNavbar } from "../../../components/LayoutWithNavbar";
import {
  useDeletePostMutation,
  useMeQuery,
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { toErrorMap } from "../../../utils/toErrorMap";
import { createUrqlClient } from "../../../utils/urql";
import { useAuthOnly } from "../../../utils/useAuthOnly";

const EditPost: NextPage = () => {
  useAuthOnly();

  const router = useRouter();
  const [{ data: me }] = useMeQuery();

  const id =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const [{ data }, fetchPosts] = usePostQuery({
    variables: { id },
    pause: true,
  });
  const [, updatePost] = useUpdatePostMutation();
  const [, _deletePost] = useDeletePostMutation();

  useEffect(() => {
    fetchPosts();
  }, [id]);

  const deletePost = () => {
    _deletePost({ id });
    router.push("/");
  };

  if (!data?.post || data.post.author.id !== me?.me?.id) {
    return <LayoutWithNavbar>Cannot edit post</LayoutWithNavbar>;
  }

  return (
    <LayoutWithNavbar variant="small">
      <Formik
        initialValues={{ text: data?.post?.text }}
        onSubmit={async (val, { setErrors }) => {
          const { data } = await updatePost({ id, ...val });

          if (data?.updatePost.errors) {
            setErrors(toErrorMap(data.updatePost.errors));
          } else if (data?.updatePost.post) {
            router.push(`/post/${data.updatePost.post.id}`);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={8}>
              <InputField
                label="Body"
                name="text"
                placeholder="text..."
                textarea
              />
            </Box>
            <Flex
              alignItems={"center"}
              justifyContent="center"
              flexDirection="row"
            >
              <Button
                type="button"
                bgColor="gray.200"
                color="red"
                border={"1px solid red"}
                m={4}
                isLoading={isSubmitting}
                onClick={deletePost}
              >
                Delete
              </Button>
              <Button
                type="submit"
                bgColor={"tan"}
                m={4}
                isLoading={isSubmitting}
              >
                Save
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </LayoutWithNavbar>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
