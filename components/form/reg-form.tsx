import { useMessage } from "@/hooks/use-message";
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

type RegFormType = {
  name: string;
  email: string;
  password: string;
  rePassword: string;
};

export const RegForm = () => {
  const supabase = useSupabaseClient();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegFormType>();

  const message = useMessage();

  const onSubmit = handleSubmit(async (formData) => {
    const { name, email, password, rePassword } = formData;
    if (password !== rePassword) {
      setError("password", {
        message: "The password entered twice is different",
      });
      setError("rePassword", {
        message: "The password entered twice is different",
      });
    } else {
      const { data: isExistName } = await supabase
        .from("profile")
        .select("name")
        .eq("name", name);
      if (isExistName?.length !== 0) {
        setError("name", { message: "This username already exists" });
      } else {
        const { data: isExistEmail } = await supabase
          .from("profile")
          .select("email")
          .eq("email", email);
        if (isExistEmail?.length !== 0) {
          setError("email", { message: "This email address is registered" });
        } else {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) {
            message({ title: error.message, status: "error" });
          } else {
            await supabase.from("profile").insert([
              {
                id: data.user?.id,
                name: formData.name,
                email: formData.email,
              },
            ]);
            message({
              title: "Sign up successfully",
              description: "Please check your email and activate your account",
              status: "success",
            });
          }
        }
      }
    }
  });
  return (
    <Card maxW="xl" mx="auto">
      <CardHeader fontSize="xl" fontWeight="medium">
        New Account Registration
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardBody>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor="name">UserName</FormLabel>
            <Input
              id="name"
              placeholder="A handsome name"
              focusBorderColor="teal"
              {...register("name", {
                required: "Please input username",
              })}
            />
            <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl mt="3" isInvalid={!!errors.email}>
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

          <FormControl mt="3" isInvalid={!!errors.rePassword}>
            <FormLabel htmlFor="rePassword">Repeat Password</FormLabel>
            <Input
              id="rePassword"
              type="password"
              focusBorderColor="teal"
              {...register("rePassword", {
                required: "Please repeat the password",
              })}
            />
            <FormErrorMessage>{errors?.rePassword?.message}</FormErrorMessage>
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
              Sign up
            </Button>
            <Box>
              <Link
                href="/auth/login"
                textDecoration="underline"
                _hover={{ textColor: "gray.500" }}
              >
                Already have an account? Sign in
              </Link>
            </Box>
          </VStack>
        </CardFooter>
      </form>
    </Card>
  );
};
