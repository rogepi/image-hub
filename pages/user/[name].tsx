import * as React from "react";
import Image from "next/image";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Flex,
  SimpleGrid,
  Spacer,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import useSWR from "swr";
import Link from "next/link";
import { CreateGalleryButton } from "@/components/buttons/create-gallery-button";
import { useRouter } from "next/router";

export default function GalleriesPage() {
  const router = useRouter();
  const name = router.query.name as string;
  const supabase = useSupabaseClient();
  const user = useUser();
  const isMe = name === user?.user_metadata.name;

  // Get
  const getGalleries = async (name: string) => {
    const res = await supabase
      .from("gallery")
      .select("id,name,category,image(url),is_public,profile(*)")
      .eq("profile.name", name)
      .eq(isMe ? "" : "is_public", true);
    if (res.status === 200 && res.data !== null) {
      return res.data;
    } else {
      return [];
    }
  };
  const { data, mutate } = useSWR(name || "", getGalleries);

  return (
    <>
      <Box>
        <Flex>
          <Text fontSize="2xl">{isMe ? "My" : `${name}'s`} Galleries</Text>
          <Spacer />
          {isMe && <CreateGalleryButton mutate={mutate} />}
        </Flex>
        <SimpleGrid minChildWidth="200px" mt="10" spacing="50">
          {data?.map((item) => (
            <Link href={`/gallery/${item.id}`} key={item.id}>
              <Card>
                <CardBody p="0">
                  <Box
                    p="2.5"
                    w="full"
                    h="full"
                    aspectRatio={1}
                    position="relative"
                  >
                    <Image
                      src={
                        item.image.length === 0
                          ? "/MaterialSymbolsImage.svg"
                          : (item?.image?.at(-1)?.url as string)
                      }
                      alt={item.name}
                      sizes="100"
                      fill
                    />
                  </Box>
                </CardBody>
                <CardFooter>
                  <VStack alignItems="start">
                    <Text fontWeight="semibold" fontSize="lg">
                      {item.name}
                      {item.is_public && <Tag size="sm">Public</Tag>}
                    </Text>
                    <Text>{item?.image.length + " photos"}</Text>
                  </VStack>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
}
