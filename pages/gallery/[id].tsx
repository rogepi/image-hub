import {
  Box,
  Text,
  Flex,
  Spacer,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Center,
  Tag,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import useSWR from "swr";
import { Link } from "@chakra-ui/next-js";
import { useMemo } from "react";
import { UploadButton } from "@/components/upload-button";

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
      .select("id,name,category,user_id,image(id)")
      .eq("user_id", userId);
    if (res.status === 200 && res.data !== null) {
      return res.data;
    } else {
      return [];
    }
  };

  const getGallery = async (id: string) => {
    const gallery_id = id.split("_").at(1);
    const res = await supabase
      .from("gallery")
      .select("id,name,category,user_id,image(id)")
      .eq("id", gallery_id);
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

  const { data: galleries, mutate: galleryMutate } = useSWR(
    `gallery_${id}`,
    getGallery
  );

  const gallery = galleries?.find((item) => item.id?.toString() === id);

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
            <Text>{`@${user?.user_metadata.name}`}</Text>
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
              <UploadButton id={id as string} mutate={mutate} />
            )}
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
    </>
  );
}
