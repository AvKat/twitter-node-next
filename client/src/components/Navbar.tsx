import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React, { useEffect } from "react";
import NextLink from "next/Link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching }, refetch] = useMeQuery({
    pause: true,
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Flex bg="tan" p={4}>
      <Box ml={"auto"}>
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
          <Flex>
            <Box mr={3}>{data.me.username}</Box>
            <Button
              variant={"link"}
              onClick={() => logout()}
              isLoading={logoutFetching}
            >
              Logout
            </Button>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export { Navbar };
