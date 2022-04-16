import {
  Box,
  Flex,
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Link,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { InputField } from "../../../components/InputField";
import { Wrapper } from "../../../components/Wrapper";
import { useChangePasswordFromTokenMutation } from "../../../generated/graphql";
import { toErrorMap } from "../../../utils/toErrorMap";
import { createUrqlClient } from "../../../utils/urqlCacheExchangeUpdates";

const ForgotPasssword: NextPage<{ token: string }> = ({ token }) => {
  const [_, changePassword] = useChangePasswordFromTokenMutation();
  const router = useRouter();
  const [tokenError, setTokenErr] = useState("");
  const { isOpen, onOpen, onClose: modalOnClose } = useDisclosure();

  const onClose = () => {
    modalOnClose();
    router.push("/");
  };

  return (
    <>
      <Wrapper variant="small">
        <Formik
          initialValues={{ newPassword: "" }}
          onSubmit={async (val, { setErrors }) => {
            const { data } = await changePassword({
              newPassword: val.newPassword,
              token,
            });
            if (data?.changePasswordFromToken.errors) {
              const errorMap = toErrorMap(data.changePasswordFromToken.errors);
              console.log(errorMap);
              if (errorMap.token) {
                setTokenErr(errorMap.token);
              }
              setErrors(errorMap);
            } else if (data?.changePasswordFromToken.user) {
              onOpen();
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box mt={8}>
                <InputField
                  label="New Password"
                  name="newPassword"
                  inputProps={{ type: "password" }}
                />
              </Box>
              {tokenError && (
                <Flex color={"red"} justifyContent="center">
                  {tokenError + ".  "}
                  <NextLink href="/forgot-password">
                    <Link>Get new token</Link>
                  </NextLink>
                </Flex>
              )}
              <Flex justifyContent={"center"}>
                <Button
                  type="submit"
                  bgColor={"tan"}
                  mt={4}
                  isLoading={isSubmitting}
                >
                  Change Password
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Wrapper>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Password Changed Succesfully</ModalHeader>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Home
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

ForgotPasssword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient, { neverSuspend: true })(
  ForgotPasssword
);
