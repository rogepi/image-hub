import * as React from "react";
import useSWR from "swr";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";

export const AuthMenu = () => {
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

  const { data: username } = useSWR(
    session ? `username_${session?.user.id}` : null,
    getProfile
  );

  return (
    <Box>
      {session ? (
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {username || ""}
          </MenuButton>

          <MenuList>
            <MenuItem onClick={() => router.push("/user/galleries")}>
              Galleries
            </MenuItem>
            <MenuItem onClick={() => supabase.auth.signOut()}>Log Out</MenuItem>
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
    </Box>
  );
};
