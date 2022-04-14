import { Box, Button, Center, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";

const Register: NextPage = () => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={console.log}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label="Username"
              name="username"
              placeholder="Username"
            />
            <Box mt={8}>
              <InputField
                label="Password"
                name="password"
                placeholder="Password"
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

export default Register;
