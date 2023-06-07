import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Flex,
  SimpleGrid,
  StackDivider,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ImageCard } from "@/components/image-card";

export const config = {
  runtime: "edge",
};

export const getServerSideProps: GetServerSideProps<{
  images: LatestImagesType[];
  galleries: GalleriesType[];
}> = async () => {
  const { data: latestImages } = await supabase
    .from("gallery_image")
    .select("gallery_id, image_name,user_id, image(id,url,profile(name))")
    .eq("is_basic", true)
    .order("created_at", { ascending: false })
    .limit(8);

  const { data: latestGalleries } = await supabase
    .from("gallery")
    .select("id,name,category,image(url),profile(name)")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  const images = latestImages as unknown as LatestImagesType[];
  const galleries = (latestGalleries as unknown as LatestGalleriesType[]).map(
    (item) => ({
      ...item,
      image: item.image.at(-1)?.url || "/MaterialSymbolsImage.svg",
      count: item.image.length,
      author: item.profile.name,
    })
  );
  return {
    props: {
      images,
      galleries,
    },
  };
};

export default function HomePage({
  images,
  galleries,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={4}
      align="stretch"
    >
      <Box>
        <Text fontSize="2xl">Latest Image</Text>
        <SimpleGrid
          mt="10"
          spacing="30"
          templateColumns="repeat(auto-fill, minmax(180px, 1fr))"
        >
          {images?.map((item, index) => (
            <ImageCard
              id={item.image.id}
              src={item.image.url}
              name={item.image_name}
              author={item.image.profile.name}
              userId={item.user_id}
              key={index}
            />
          ))}
        </SimpleGrid>
      </Box>
      <Box>
        <Text fontSize="2xl">Latest Gallery</Text>
        <SimpleGrid
          mt="10"
          spacing="30"
          templateColumns="repeat(auto-fill, minmax(180px, 1fr))"
        >
          {galleries?.map((item, index) => (
            <Link href={`/gallery/${item.id}`} key={index}>
              <VStack align="start" w="full" h="full" aspectRatio={1}>
                <Box
                  key={index}
                  rounded="md"
                  overflow="hidden"
                  position="relative"
                  border="1px"
                  borderColor="gray.100"
                  p="2.5"
                  w="full"
                  h="full"
                  aspectRatio={1}
                >
                  <Image src={item.image} alt={item.name} sizes="100" fill />
                </Box>
                <Flex alignItems="center">
                  <Text flex="1" mr="2" fontWeight="semibold" isTruncated>
                    {item.name}
                  </Text>
                  <Tag size="sm">{item.category}</Tag>
                </Flex>
                <Text fontSize="sm" color="gray.600">
                  {item.count} photos
                </Text>
              </VStack>
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </VStack>
  );
}
