import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useLoginMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { createUrqlClient } from "../../utils/urqlCacheExchangeUpdates";

const Login: NextPage = () => {
  const [, login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (val, { setErrors }) => {
          const { data } = await login(val);
          if (data?.login.errors) {
            setErrors(toErrorMap(data.login.errors));
          } else if (data?.login.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="Username or Email" name="usernameOrEmail" />
            <Box mt={8}>
              <InputField
                label="Password"
                name="password"
                inputProps={{ type: "password" }}
              />
            </Box>
            <Flex alignItems={"center"} flexDirection="column">
              <Button
                type="submit"
                bgColor={"tan"}
                my={4}
                isLoading={isSubmitting}
              >
                Login
              </Button>
              <NextLink href={"/auth/forgot-password"}>
                <Link>Forgot Password?</Link>
              </NextLink>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
