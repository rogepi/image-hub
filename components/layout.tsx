import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import * as React from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";
import { useRouter } from "next/router";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();

  const getProfile = async (id: string) => {
    if (id) {
      const { data } = await supabase
        .from("profile")
        .select("name")
        .eq("id", id.split("_").pop());
      if (data) return data[0].name;
    }
  };

  const { data: username } = useSWR(`username_${session?.user.id}`, getProfile);

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
          {session ? (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {username || ""}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => router.push("/user/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => router.push("/user/galleries")}>
                  Galleries
                </MenuItem>
                <MenuItem onClick={() => supabase.auth.signOut()}>
                  Log Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <HStack gap="5">
              <Link href="/auth/login">Sign in</Link>
              <Link href="/auth/reg">
                <Button colorScheme="teal">Sign up</Button>
              </Link>
            </HStack>
          )}
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
