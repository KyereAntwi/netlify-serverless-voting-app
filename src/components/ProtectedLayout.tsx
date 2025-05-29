import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Flex, Spinner } from "@chakra-ui/react";
import { Outlet } from "react-router";

const ProtectedOutlet = withAuthenticationRequired(Outlet, {
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
      <ProtectedOutlet />
    </>
  );
};

export default ProtectedLayout;
