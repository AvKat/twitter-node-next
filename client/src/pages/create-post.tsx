import { Box, Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { InputField } from "../components/InputField";
import { LayoutWithNavbar } from "../components/LayoutWithNavbar";
import { useCreatePostMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { createUrqlClient } from "../utils/urql";
import { useAuthOnly } from "../utils/useAuthOnly";

const CreatePost: NextPage = () => {
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();
  useAuthOnly();

  return (
    <LayoutWithNavbar variant="small">
      <Formik
        initialValues={{ text: "" }}
        onSubmit={async (val, { setErrors }) => {
          const { data } = await createPost(val);

          if (data?.createPost.errors) {
            setErrors(toErrorMap(data.createPost.errors));
          } else if (data?.createPost.post) {
            router.push(`/post/${data.createPost.post.id}`);
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
            <Flex alignItems={"center"} flexDirection="column">
              <Button
                type="submit"
                bgColor={"tan"}
                my={4}
                isLoading={isSubmitting}
              >
                Create Post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </LayoutWithNavbar>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
