import * as React from "react";
import { GALLERY_CATEGORYS } from "@/lib/constants";
import {
  Button,
  FormControl,
  FormErrorMessage,
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
  Switch,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useForm } from "react-hook-form";

type FormValueType = {
  name: string;
  desc: string;
  category: string;
  isPublic: boolean;
};

type CreateGalleryButtonProps = {
  mutate?: () => void;
  customNode?: React.ReactNode;
};

export const CreateGalleryButton = ({
  mutate,
  customNode,
}: CreateGalleryButtonProps) => {
  const supabase = useSupabaseClient();
  const user = useUser();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<FormValueType>();

  const toast = useToast();
  const onSubmit = handleSubmit(async (data) => {
    const res = await supabase.from("gallery").insert([
      {
        name: data.name,
        desc: data.desc,
        category: data.category,
        user_id: user?.id,
        is_public: data.isPublic,
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
      mutate && mutate();
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
      {customNode || (
        <Button onClick={onOpen} colorScheme="teal">
          Create New
        </Button>
      )}

      {/* Create Modal */}
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create A New Gallery</ModalHeader>
          <ModalCloseButton />
          <form>
            <ModalBody>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  id="name"
                  placeholder="Your gallery's name"
                  focusBorderColor="teal"
                  {...register("name", {
                    required: "Gallery Name Is Required",
                  })}
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.desc}>
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
                <FormErrorMessage>{errors.desc?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.category}>
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
                <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel mt={3} htmlFor="is_public">
                  Public
                </FormLabel>
                <Switch
                  colorScheme="teal"
                  id="is_public"
                  {...register("isPublic")}
                />
              </FormControl>
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
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
