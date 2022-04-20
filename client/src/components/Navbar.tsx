import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { AddIcon } from "@chakra-ui/icons";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  const { onClose, onOpen, isOpen } = useDisclosure();

  return (
    <>
      <Flex
        bg="tan"
        p={4}
        position="sticky"
        top={0}
        zIndex={1}
        justifyContent="center"
      >
        <Flex maxWidth={800} flex={1} alignItems={"center"}>
          <NextLink href="/">
            <Link>
              <Heading>Home</Heading>
            </Link>
          </NextLink>
          <Flex ml={"auto"} alignItems="center">
            {fetching ? null : !data?.me ? (
              <>
                <NextLink href={"/auth/login"}>
                  <Link mr={3}>Login</Link>
                </NextLink>
                <NextLink href={"/auth/register"}>
                  <Link>Register</Link>
                </NextLink>
              </>
            ) : (
              <>
                <Box>
                  <NextLink href={"/create-post"}>
                    <IconButton aria-label="Add Post" icon={<AddIcon />} />
                  </NextLink>
                </Box>
                <Box fontWeight={"bold"} mx={5}>
                  {data.me.username}
                </Box>
                <Button
                  variant={"link"}
                  onClick={onOpen}
                  isLoading={logoutFetching}
                  color="blackAlpha.700"
                >
                  Logout
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Do you really want to log out?</ModalHeader>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                logout();
                onClose();
              }}
            >
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export { Navbar };
