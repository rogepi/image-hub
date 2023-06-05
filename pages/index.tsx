import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Box, SimpleGrid, StackDivider, Text, VStack } from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

type GalleriesType = {
  id: number;
  name: string;
  category: string;
  image: {
    url: string;
  }[];
  profile: {
    name: string;
  };
}[];

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: latestImages } = await supabase
    .from("gallery_image")
    .select("gallery_id, image_name, image(id,url,profile(name))")
    .eq("is_basic", true)
    .order("created_at", { ascending: false })
    .limit(8);

  const { data: latestGalleries } = await supabase
    .from("gallery")
    .select("id,name,category,image(url),profile(name)")
    .order("created_at", { ascending: false })
    .limit(8);

  const galleries = (latestGalleries as unknown as GalleriesType).map(
    (item) => ({
      ...item,
      image: item.image.at(-1)?.url || "/MaterialSymbolsImage.svg",
      count: item.image.length,
      author: item.profile.name,
    })
  );
  console.log(galleries);

  return {
    props: {
      latestImages,
      galleries,
    },
  };
};

export default function HomePage({
  latestImages,
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
          {(latestImages as any[])?.map((item, index) => (
            <VStack align="start" w="full" h="full" aspectRatio={1} key={index}>
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
                <Image
                  src={item.image?.url}
                  alt={item.image_name}
                  sizes="100"
                  fill
                />
              </Box>
              <Text textColor="gray.600">{item.image_name}</Text>
              <Text>{"@" + item.image.profile.name}</Text>
            </VStack>
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
          {(galleries as any[])?.map((item, index) => (
            <VStack align="start" w="full" h="full" aspectRatio={1} key={index}>
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
              <Text textColor="gray.600">{item.name}</Text>
              <Text>{item.count + " photos"}</Text>
              <Text>{"@" + item.profile.name}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Box>
    </VStack>
  );
}
