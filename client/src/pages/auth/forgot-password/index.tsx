import {
  Box,
  Flex,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { InputField } from "../../../components/InputField";
import { Wrapper } from "../../../components/Wrapper";
import { useForgotPasswordMutation } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/urql";

const ForgotPassswordMain: NextPage = () => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const { isOpen, onOpen, onClose: modalOnClose } = useDisclosure();
  const router = useRouter();

  const onClose = () => {
    modalOnClose();
    router.push("/");
  };

  return (
    <>
      <Wrapper variant="small">
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (val, { setErrors }) => {
            const { data } = await forgotPassword(val);
            if (!data?.forgotPassword) {
              setErrors({ email: "Something went wrong." });
            } else {
              onOpen();
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box mt={8}>
                <InputField label="Email" name="email" type="email" />
              </Box>
              <Flex justifyContent={"center"}>
                <Button
                  type="submit"
                  bgColor={"tan"}
                  mt={4}
                  isLoading={isSubmitting}
                >
                  Request Password Change
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Wrapper>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Link Sent</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h1>A link to reset password has been sent to the email.</h1>
          </ModalBody>

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

export default withUrqlClient(createUrqlClient)(ForgotPassswordMain);
