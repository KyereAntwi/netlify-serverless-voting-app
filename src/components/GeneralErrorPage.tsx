import { Flex, Alert, AlertIcon } from "@chakra-ui/react";

interface Props {
  message?: string;
}

export default function GeneralErrorPage({ message }: Props) {
  return (
    <Flex w={"full"} h={"full"} justifyContent={"center"} alignItems={"center"}>
      <Alert status="error">
        <AlertIcon />
        {message || "An unexpected error occurred. Please try again later."}
      </Alert>
    </Flex>
  );
}
