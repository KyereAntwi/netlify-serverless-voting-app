import {
  Box,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorMode,
  useColorModeValue,
  Text,
  HStack,
  Spacer,
  MenuDivider,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useAuth0 } from "@auth0/auth0-react";
import type React from "react";
import TriumphLogo from "../assets/triumphlogo";

const MainNav: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout, isAuthenticated } = useAuth0();

  return (
    <Box
      as="nav"
      position="fixed"
      top="0"
      left="0"
      width="100%"
      bg={useColorModeValue("white", "gray.800")}
      boxShadow="sm"
      zIndex="1000"
    >
      <Flex
        maxW="7xl"
        mx="auto"
        px={{ base: 4, md: 8 }}
        h="64px"
        align="center"
      >
        {/* Brand */}
        <HStack spacing={3}>
          <TriumphLogo />
          <Text
            fontWeight="bold"
            fontSize="xl"
            color={useColorModeValue("blue.600", "blue.300")}
            letterSpacing="wide"
          >
            Triumph Voting
          </Text>
        </HStack>
        <Spacer />
        {/* Right Side */}
        <HStack spacing={2}>
          {/* Theme Toggle */}
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="md"
          />
          {/* User Menu */}
          {isAuthenticated && user && (
            <Menu>
              <MenuButton
                as={Avatar}
                size="sm"
                name={user.name}
                src={user.picture}
                cursor="pointer"
              />
              <MenuList>
                <Box px={4} py={2}>
                  <HStack>
                    <Avatar size="sm" name={user.name} src={user.picture} />
                    <Text fontWeight="medium">{user.name}</Text>
                  </HStack>
                </Box>
                <MenuDivider />
                <MenuItem
                  color="red.500"
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default MainNav;
