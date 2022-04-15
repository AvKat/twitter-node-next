import { Box, Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useRegisterMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { createUrqlClient } from "../../utils/urqlCacheExchangeUpdates";

const Register: NextPage = () => {
  const [, register] = useRegisterMutation();
  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (val, { setErrors }) => {
          const { data } = await register(val);
          if (data?.register.errors) {
            setErrors(toErrorMap(data.register.errors));
          } else if (data?.register.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="Username" name="username" />
            <Box mt={8}>
              <InputField label="Email" name="email" />
            </Box>
            <Box mt={8}>
              <InputField
                label="Password"
                name="password"
                inputProps={{ type: "password" }}
              />
            </Box>
            <Flex justifyContent={"center"}>
              <Button
                type="submit"
                bgColor={"tan"}
                mt={4}
                isLoading={isSubmitting}
              >
                Register
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
