import { Flex, Spinner } from "@chakra-ui/react";

export default function LoadingPage() {
  return (
    <Flex
      w={"full"}
      h={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        size="xl"
        color="blue.500"
      />
    </Flex>
  );
}
