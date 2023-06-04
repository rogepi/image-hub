import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useForm } from "react-hook-form";
import { useMessage } from "@/hooks/use-message";
import { useRouter } from "next/router";

type LoginFormType = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const supabase = useSupabaseClient();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>();

  const message = useMessage();
  const router = useRouter();
  const onSubmit = handleSubmit(async (formData) => {
    const { email, password } = formData;
    const { data: isExistEmail } = await supabase
      .from("profile")
      .select("email")
      .eq("email", email);
    if (isExistEmail?.length === 0) {
      setError("email", { message: "This email address is not registered" });
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        message({ title: error.message, status: "error" });
      } else {
        message({ title: "Sign in successfully", status: "success" });
        router.push("/");
      }
    }
  });

  return (
    <Card maxW="xl" mx="auto">
      <CardHeader fontSize="xl" fontWeight="medium">
        Account Login
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardBody>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              focusBorderColor="teal"
              placeholder="xxx@xx.com"
              {...register("email", {
                required: "Please input email",
              })}
            />
            <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl mt="3" isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              focusBorderColor="teal"
              {...register("password", {
                required: "Please input password",
              })}
            />
            <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
          </FormControl>
        </CardBody>

        <CardFooter>
          <VStack w="full">
            <Button
              type="submit"
              isLoading={isSubmitting}
              w="full"
              colorScheme="teal"
            >
              Sign in
            </Button>
            <Box>
              <Link
                href="/auth/reg"
                textDecoration="underline"
                _hover={{ textColor: "gray.500" }}
              >
                No account? Sign up
              </Link>
            </Box>
          </VStack>
        </CardFooter>
      </form>
    </Card>
  );
};
