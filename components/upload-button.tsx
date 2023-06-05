import {
  Button,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ImageUpload } from "./image-upload";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { generateUuid } from "@/lib/utils";

type FormValues = {
  name: string;
  image: File;
};

type UploadButtonProps = {
  id: string;
  mutate: () => void;
};

export const UploadButton = ({ id, mutate }: UploadButtonProps) => {
  const supabase = useSupabaseClient();
  const user = useUser();
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
            user_id: user?.id,
            image_name: formData.name,
            is_basic: true,
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
      <Button onClick={onOpen} colorScheme="teal">
        Upload
      </Button>

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
};
