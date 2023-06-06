import useSWR from "swr";
import { getGalleryType } from "@/pages/gallery/[id]";
import { SettingsIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Select,
  Switch,
  IconButton,
  Input,
  Modal,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
} from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useForm } from "react-hook-form";
import { GALLERY_CATEGORYS } from "@/lib/constants";
import { useMessage } from "@/hooks/use-message";

type GallerySettingsButtonProps = {
  galleryId: number;
};

type FormValueType = {
  name: string;
  desc: string;
  category: string;
  isPublic: boolean;
};

export const GallerySettingsButton = ({
  galleryId,
}: GallerySettingsButtonProps) => {
  const supabase = useSupabaseClient();

  const getGallery = async (id: string) => {
    const gallery_id = id.split("_").at(1);
    const res = await supabase
      .from("gallery")
      .select("id,name,desc,category,user_id,image(id),profile(name)")
      .eq("id", gallery_id)
      .returns<getGalleryType[]>();
    if (res.status === 200 && res.data !== null) {
      return res.data;
    } else {
      return [];
    }
  };

  const { data: gallery, mutate } = useSWR(`gallery_${galleryId}`, getGallery);

  const defaultValues: FormValueType = {
    name: gallery?.[0].name || "",
    desc: gallery?.[0].desc || "",
    category: gallery?.[0].category || GALLERY_CATEGORYS.Animals,
    isPublic: gallery?.[0].is_public || false,
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<FormValueType>({ defaultValues });

  const message = useMessage();
  const onSubmit = handleSubmit(async (formData) => {
    const { error } = await supabase
      .from("gallery")
      .update({
        name: formData.name,
        desc: formData.desc,
        category: formData.category,
        is_public: formData.isPublic,
      })
      .eq("id", galleryId);

    if (error) {
      message({ title: error.message, status: "error" });
    } else {
      message({ title: "Update successfully", status: "success" });
      mutate();
      onClose();
    }
  });

  return (
    <>
      <IconButton
        onClick={onOpen}
        aria-label="settings"
        icon={<SettingsIcon />}
      />

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Gallery Settings</ModalHeader>
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
              <Button colorScheme="red" mr={3} onClick={onClose}>
                Close
              </Button>

              <Button
                onClick={onSubmit}
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Update
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
