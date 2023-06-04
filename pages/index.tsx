import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  SimpleGrid,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: images } = await supabase
    .from("image")
    .select("id, url, author")
    .order("id", { ascending: false })
    .limit(6);

  return {
    props: {
      images,
    },
  };
};

export default function HomePage({
  images,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(images);
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
          spacing="50"
          templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        >
          {(images as any[])?.map((item, index) => (
            <Card overflow="hidden" key={index} h="300px">
              <CardBody position="relative">
                <Center>
                  <Image src={item?.url} alt="null" sizes="100" fill />
                </Center>
              </CardBody>
              <CardFooter>
                <VStack alignItems="start">
                  <Text fontWeight="semibold" fontSize="lg">
                    {/* {item?.image_name} */}
                  </Text>
                </VStack>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
      <Box>
        <Text fontSize="2xl">Latest Gallery</Text>
      </Box>
    </VStack>
  );
}
