import { Box, Flex, Link, Text } from "@chakra-ui/react";

export default function MainFooter() {
  return (
    <Box
      as="footer"
      bottom="0"
      width="100%"
      bg="transparent"
      py={4}
      mt="auto"
      zIndex={10}
    >
      <Flex direction="column" align="center" justify="center">
        <Text fontSize="sm" mb={2}>
          &copy; {new Date().getFullYear()} Triumph Voting App. All rights
          reserved.
        </Text>
        <Flex gap={4}>
          <Link
            href="https://voters-app.example.com"
            color="teal.200"
            isExternal
          >
            Voters App
          </Link>
          <Link href="https://ecs-app.example.com" color="teal.200" isExternal>
            ECS App
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}
