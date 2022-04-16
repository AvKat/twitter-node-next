import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useRegisterMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { createUrqlClient } from "../../utils/urqlCacheExchangeUpdates";
import NextLink from "next/link";
import { returnToHref } from "../../utils/returnToHref";

const Register: NextPage = () => {
  const [, register] = useRegisterMutation();
  const router = useRouter();

  const return_to = router.query.return_to;
  const href = returnToHref("/auth/login", return_to);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (val, { setErrors }) => {
          const { data } = await register(val);
          if (data?.register.errors) {
            setErrors(toErrorMap(data.register.errors));
          } else if (data?.register.user) {
            router.push(typeof return_to === "string" ? return_to : "/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="Username" name="username" />
            <Box mt={8}>
              <InputField label="Email" name="email" type="email" />
            </Box>
            <Box mt={8}>
              <InputField label="Password" name="password" type="password" />
            </Box>
            <Flex alignItems={"center"} flexDirection="column">
              <Button
                type="submit"
                bgColor={"tan"}
                my={6}
                isLoading={isSubmitting}
              >
                Register
              </Button>

              <NextLink href={href}>
                <Link>Already have an account?</Link>
              </NextLink>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
