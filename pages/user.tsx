import * as React from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Spacer,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import useSWR from "swr";
import { IGallery } from "@/lib/types";
import { GALLERY_CATEGORYS } from "@/lib/constants";
import Link from "next/link";

export default function User() {
  const supabase = useSupabaseClient();
  const user = useUser();

  // Get
  const getGalleries = async (userId: string) => {
    const res = await supabase
      .from("gallery")
      .select("id,name,category,image(id)")
      .eq("userId", userId);
    if (res.status === 200 && res.data !== null) {
      return res.data;
    } else {
      return [];
    }
  };
  const { data, mutate } = useSWR(user?.id, getGalleries);

  // Create
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    reset,
  } = useForm();

  const toast = useToast();
  const onSubmit = handleSubmit(async (data) => {
    const res = await supabase.from("gallery").insert([
      {
        userId: user?.id,
        name: data.name,
        desc: data.desc,
        category: data.category,
      },
    ]);
    if (res.status === 201) {
      toast({
        title: "Create Gallery successfully",
        description: "You can start uploading photos now",
        status: "success",
        position: "top",
        duration: 2000,
        isClosable: true,
        colorScheme: "teal",
      });
      onClose();
      reset();
      mutate();
    } else {
      toast({
        title: "Some errors occur",
        description: res.statusText,
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
    }
  });
  return (
    <>
      <Box>
        <Flex>
          <Text fontSize="2xl">My Galleries</Text>
          <Spacer />
          <Button onClick={onOpen} colorScheme="teal">
            Create New
          </Button>
        </Flex>
        <SimpleGrid minChildWidth="200px" mt="10" spacing="50">
          {data?.map((item) => (
            <Link href={`/gallery/${item.id}`} key={item.id}>
              <Card>
                <CardBody p="0">
                  <Center>
                    <Image
                      src="/MaterialSymbolsImage.svg"
                      alt="null"
                      width={260}
                      height={260}
                    />
                  </Center>
                </CardBody>
                <CardFooter>
                  <VStack alignItems="start">
                    <Text fontWeight="semibold" fontSize="lg">
                      {item.name}
                    </Text>
                    <Text>
                      {(item.image ? item.image.length : 0) + " photos"}
                    </Text>
                  </VStack>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </SimpleGrid>
      </Box>

      {/* Create Modal */}
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <FormControl onSubmit={onSubmit}>
            <ModalHeader>Create A New Gallery</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                placeholder="Your gallery's name"
                focusBorderColor="teal"
                {...register("name", {
                  required: "Gallery Name Is Required",
                })}
              />
              <FormLabel mt={3} htmlFor="desc">
                Description
              </FormLabel>
              <Input
                id="desc"
                placeholder="Introduce your gallery"
                focusBorderColor="teal"
                {...register("desc", {
                  required: "Gallery Name Is Required",
                })}
              />
              <FormLabel mt={3} htmlFor="category">
                Category
              </FormLabel>
              <Select
                id="category"
                focusBorderColor="teal"
                placeContent="The content of your gallery is about..."
                {...register("category", {
                  required: "Please Choose A Category",
                })}
              >
                {Object.keys(GALLERY_CATEGORYS).map((item, index) => (
                  <option value={item} key={index}>
                    {item}
                  </option>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} mr={3}>
                Close
              </Button>
              <Button
                onClick={onSubmit}
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Create
              </Button>
            </ModalFooter>
          </FormControl>
        </ModalContent>
      </Modal>
    </>
  );
}
