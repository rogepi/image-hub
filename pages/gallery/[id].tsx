import {
  Box,
  Text,
  Flex,
  Spacer,
  VStack,
  Button,
  HStack,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  ModalFooter,
  useToast,
  FormLabel,
  Input,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Center,
  Tag,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { IGallery } from "@/lib/types";
import { Link } from "@chakra-ui/next-js";
import { ImageUpload } from "@/components/image-upload";
import { generateUuid } from "@/lib/utils";
import { useMemo } from "react";

type FormValues = {
  name: string;
  image: File;
};

export default function Gallery() {
  const router = useRouter();
  const id = router.query.id;
  const supabase = useSupabaseClient();
  const user = useUser();

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

  const getImages = async (id: number) => {
    const res = await supabase
      .from("gallery_image")
      .select(`image_id,image_name,image(url)`)
      .eq("gallery_id", id);
    if (res.status === 200 && res.data !== null) {
      return res.data as unknown as {
        image_id: string;
        image_name: string;
        image: { url: string };
      }[];
    } else {
      return null;
    }
  };

  const { data: galleries } = useSWR(user?.id, getGalleries);
  const gallery = useMemo(() => {
    return galleries?.find((item) => (item.id = id));
  }, [galleries, id]);
  const { data: images, mutate } = useSWR(id, getImages);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { isSubmitting },
    reset,
  } = useForm<FormValues>();
  const handleClose = () => {
    onClose();
    reset();
  };
  const validateImages = (value: File) => {
    if (!value) {
      return "Image is required";
    }
    const fsMb = value.size / (1024 * 1024);
    const MAX_FILE_SIZE = 10;
    if (fsMb > MAX_FILE_SIZE) {
      return "Max file size 10mb";
    }
    return true;
  };

  const toast = useToast();
  setValue;
  const onSubmit = handleSubmit(async (formData) => {
    const { data: uploadData, error } = await supabase.storage
      .from("images")
      .upload(
        `${generateUuid()}.${formData.image.name.split(".").pop()}`,
        formData.image,
        {
          cacheControl: "3600",
          upsert: false,
        }
      );
    if (error) {
      toast({
        title: "Some errors occur",
        description: error.message,
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
    } else {
      const { data: imageUrlData } = await supabase.storage
        .from("images")
        .createSignedUrl(uploadData.path, 52428800);
      const { data: imageData } = await supabase
        .from("image")
        .upsert({
          path: uploadData.path,
          url: imageUrlData?.signedUrl,
          author: user?.id,
        })
        .select();
      if (imageData) {
        const res = await supabase.from("gallery_image").insert([
          {
            gallery_id: id,
            image_id: imageData[0]?.id,
            image_name: formData.name,
          },
        ]);

        if (res.error) {
          toast({
            title: "Some errors occur",
            description: res.error.message,
            status: "error",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        } else {
          mutate();
          toast({
            title: "Upload image successfully",
            description: "Everyone will see your awesome image",
            status: "success",
            position: "top",
            duration: 2000,
            isClosable: true,
            colorScheme: "teal",
          });
          handleClose();
        }
      }
    }
  });
  return (
    <>
      <Box>
        <Flex alignItems="start">
          <VStack alignItems="start">
            <Text fontSize="2xl">
              {gallery?.name}
              <Tag size="sm">{gallery?.category}</Tag>
            </Text>
            <Text>
              {(gallery?.image ? gallery?.image.length : 0) + " photos"}
            </Text>
          </VStack>
          <Spacer />
          <HStack alignItems="end" spacing="5">
            <Link
              href="/user"
              textDecoration="underline"
              _hover={{ textColor: "gray.600" }}
            >
              Back
            </Link>
            <Button onClick={onOpen} colorScheme="teal">
              Upload
            </Button>
          </HStack>
        </Flex>

        <SimpleGrid
          mt="10"
          spacing="50"
          templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        >
          {images?.map((item, index) => (
            <Card overflow="hidden" key={index} h="300px">
              <CardBody position="relative">
                <Center>
                  <Image src={item.image?.url} alt="null" sizes="100" fill />
                </Center>
              </CardBody>
              <CardFooter>
                <VStack alignItems="start">
                  <Text fontWeight="semibold" fontSize="lg">
                    {item.image_name}
                  </Text>
                </VStack>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </Box>

      {/* Upload Modal */}
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Image</ModalHeader>
          <ModalCloseButton />
          <FormControl onSubmit={onSubmit}>
            <ModalBody>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                placeholder="Give your image a name"
                focusBorderColor="teal"
                {...register("name", {
                  required: "You should input this",
                })}
              />
              <FormLabel mt="3" htmlFor="images">
                Pick a image
              </FormLabel>
              <ImageUpload
                id="images"
                setValue={setValue}
                register={register("image", {
                  validate: validateImages,
                })}
              ></ImageUpload>
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
                Upload
              </Button>
            </ModalFooter>
          </FormControl>
        </ModalContent>
      </Modal>
    </>
  );
}
