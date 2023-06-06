import Image from "next/image";
import {
  Box,
  VStack,
  Text,
  Modal,
  useDisclosure,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Flex,
  ModalHeader,
  Button,
  ModalFooter,
  HStack,
  Stack,
  Spacer,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { saveImage } from "@/lib/utils";
import { SaveImageButton } from "./save-image-button";

type ImageCardProps = {
  id: number;
  src: string;
  name: string;
  author: string;
  userId: string;
};

export const ImageCard = ({
  id,
  src,
  name,
  author,
  userId,
}: ImageCardProps) => {
  const router = useRouter();
  const user = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isSelf = userId === user?.id;

  return (
    <>
      <VStack align="start" w="full" h="full" aspectRatio={1}>
        <Box
          onClick={onOpen}
          rounded="md"
          overflow="hidden"
          position="relative"
          border="1px"
          borderColor="gray.100"
          cursor="pointer"
          p="2.5"
          w="full"
          h="full"
          aspectRatio={1}
          _hover={{ opacity: "75%" }}
        >
          <Image src={src} alt={name} sizes="100" fill />
        </Box>
        <Text fontSize="sm" textColor="gray.700">
          {name}
        </Text>
        {router.pathname.startsWith("/user") && <Text>{"@" + author}</Text>}
      </VStack>

      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent fontFamily="mono">
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody mt="3">
            <Flex flexDir={{ base: "column", md: "row" }}>
              <Box
                position="relative"
                border="1px"
                overflow="hidden"
                borderColor="gray.300"
                rounded="md"
                p="2.5"
                w="full"
                h="full"
                aspectRatio={1}
              >
                <Image src={src} alt={name} sizes="100" fill />
              </Box>
              <Flex flexDir="column" ml="3" w="1/3">
                <Box>
                  <Text fontSize="xl" fontWeight="semibold">
                    {name}
                  </Text>
                  <Text fontSize="lg">{`@${author}`}</Text>
                </Box>
                <Spacer mt={{ base: "3", md: "0" }} />
                <VStack>
                  <SaveImageButton imageId={id} imageName={name} />
                  <Button onClick={() => saveImage(src, name)} w="full">
                    Download
                  </Button>
                </VStack>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
