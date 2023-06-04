import { useToast } from "@chakra-ui/react";

export const useMessage = () => {
  const toast = useToast();
  const message = ({
    title,
    description,
    status = "info",
  }: {
    title?: string;
    description?: string;
    status?: "info" | "warning" | "success" | "error" | "loading" | undefined;
  }) =>
    toast({
      title,
      description,
      status,
      position: "top",
      duration: 2000,
      isClosable: true,
    });
  return message;
};
