import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { Outlet } from "react-router";
import MainNav from "./MainNav";

export const ProtectedOutlet = withAuthenticationRequired(Outlet, {
  onRedirecting: () => (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      width={"full"}
      flexDirection={"column"}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        size="xl"
        margin={"auto"}
        mt={"20vh"}
      />
    </Flex>
  ),
});

const ProtectedLayout = () => {
  return (
    <>
      <MainNav />
      <Box as="main" maxW="7xl" mx="auto" px={{ base: 4, md: 8 }} py={"70px"}>
        <ProtectedOutlet />
      </Box>
    </>
  );
};

export default ProtectedLayout;
