import {
  Box,
  Text,
  Flex,
  Spacer,
  VStack,
  HStack,
  SimpleGrid,
  Tag,
  IconButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import useSWR from "swr";
import { UploadButton } from "@/components/buttons/upload-button";
import { ImageCard } from "@/components/image-card";
import { SettingsIcon } from "@chakra-ui/icons";
import { GallerySettingsButton } from "@/components/buttons/gallery-settings-button";

export type getGalleryType = {
  id: number;
  name: string;
  desc: string;
  category: string;
  user_id: string;
  is_public: boolean;
  image: {
    id: number;
  }[];
  profile: {
    name: string;
  };
};

type getImagesType = {
  image_id: number;
  image_name: string;
  image: { url: string };
  profile: { name: string };
  user_id: string;
};

export default function Gallery() {
  const router = useRouter();
  const id = router.query.id;
  const supabase = useSupabaseClient();
  const user = useUser();

  const getGallery = async (id: string) => {
    const gallery_id = id.split("_").at(1);
    const res = await supabase
      .from("gallery")
      .select("id,name,desc,category,is_public,user_id,image(id),profile(name)")
      .eq("id", gallery_id)
      .returns<getGalleryType[]>();
    if (res.status === 200 && res.data !== null) {
      return res.data[0];
    } else {
      return null;
    }
  };

  const getImages = async (id: number) => {
    const res = await supabase
      .from("gallery_image")
      .select(`image_id,image_name,image(url),profile(name),user_id`)
      .eq("gallery_id", id)
      .returns<getImagesType[]>();
    if (res.status === 200 && res.data !== null) {
      return res.data;
    } else {
      return null;
    }
  };

  const { data: gallery, mutate: galleryMutate } = useSWR(
    `gallery_${id}`,
    getGallery
  );

  const { data: images, mutate: imageMutate } = useSWR(id, getImages);

  const mutate = () => {
    galleryMutate();
    imageMutate();
  };

  return (
    <>
      <Box>
        <Flex alignItems="start">
          <VStack alignItems="start">
            <Flex alignItems="center">
              <Text flex="1" mr="2" fontSize="2xl">
                {gallery?.name}
              </Text>
              <Tag size="sm">{gallery?.category}</Tag>
            </Flex>

            <Flex alignItems="center">
              <Text>{`@${gallery?.profile?.name}`}</Text>
              <Text mx="3">-</Text>
              <Text fontSize="xs" textColor="gray.700">
                {gallery?.desc}
              </Text>
            </Flex>
            <Text fontSize="sm" textColor="gray.500">
              {(gallery?.image ? gallery?.image.length : 0) + " photos"}
            </Text>
          </VStack>
          <Spacer />
          <HStack alignItems="end" spacing="5">
            <Text
              cursor="pointer"
              onClick={router.back}
              textDecoration="underline"
              _hover={{ textColor: "gray.600" }}
            >
              Back
            </Text>
            {user?.id === gallery?.user_id && (
              <>
                <UploadButton id={id as string} mutate={mutate} />
                <GallerySettingsButton galleryId={Number(id)} />
              </>
            )}
          </HStack>
        </Flex>

        <SimpleGrid
          mt="10"
          spacing="50"
          templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        >
          {images?.map((item, index) => (
            <ImageCard
              id={item.image_id}
              src={item.image.url}
              name={item.image_name}
              author={item.profile.name}
              userId={item.user_id}
              key={index}
            />
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
}
