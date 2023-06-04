import { Box, Card } from "@chakra-ui/react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth as SupaAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/router";

export default function Auth() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  if (session) {
    router.push("/");
  }
  return (
    <Card p="10">
      <SupaAuth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
        }}
        theme="default"
      />
    </Card>
  );
}
