import * as React from "react";
import { Box, Center, Container, Flex, Spacer, Text } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

import { AuthMenu } from "./auth-menu";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container
      maxW="4xl"
      p="3"
      display="flex"
      flexDirection="column"
      minHeight={"100vh"}
      fontFamily="mono"
    >
      {/* Header */}
      <Box>
        <Flex alignItems="center">
          <Link
            href="/"
            _hover={{ textDecoration: "none", textColor: "gray.600" }}
          >
            <Text fontSize="4xl" fontWeight="bold">
              ImageHub
            </Text>
          </Link>
          <Spacer />
          <React.Suspense fallback={<Box />}>
            <AuthMenu />
          </React.Suspense>
        </Flex>
      </Box>

      {/* Main */}
      <Box marginY="8" flexGrow="1">
        {children}
      </Box>

      {/* Footer */}
      <Box>
        <Center>ImageHub by rogepi</Center>
      </Box>
    </Container>
  );
};
