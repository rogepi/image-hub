import * as React from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Flex,
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
  Select,
  SimpleGrid,
  Spacer,
  Tag,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import useSWR from "swr";
import Link from "next/link";
import { CreateGalleryButton } from "@/components/create-gallery-button";

export default function GalleriesPage() {
  const supabase = useSupabaseClient();
  const user = useUser();

  // Get
  const getGalleries = async (userId: string) => {
    const res = await supabase
      .from("gallery")
      .select("id,name,category,image(url),is_public")
      .eq("user_id", userId);
    if (res.status === 200 && res.data !== null) {
      return res.data;
    } else {
      return [];
    }
  };
  const { data, mutate } = useSWR(user?.id, getGalleries);

  return (
    <>
      <Box>
        <Flex>
          <Text fontSize="2xl">My Galleries</Text>
          <Spacer />
          <CreateGalleryButton mutate={mutate} />
        </Flex>
        <SimpleGrid minChildWidth="200px" mt="10" spacing="50">
          {data?.map((item) => (
            <Link href={`/gallery/${item.id}`} key={item.id}>
              <Card>
                <CardBody p="0">
                  <Center>
                    <Image
                      src={
                        item.image.length === 0
                          ? "/MaterialSymbolsImage.svg"
                          : (item?.image?.at(-1)?.url as string)
                      }
                      alt="null"
                      width={260}
                      height={260}
                    />
                  </Center>
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
