import { AddIcon } from "@chakra-ui/icons";
import { InputGroup, Flex, Button } from "@chakra-ui/react";
import * as React from "react";
import { Image } from "@chakra-ui/react";
import { UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";

interface ImageUploadProps {
  id: string;
  register: UseFormRegisterReturn;
  setValue: UseFormSetValue<any>;
  multiple?: boolean;
}

export const ImageUpload = (props: ImageUploadProps) => {
  const { id, register, setValue, multiple } = props;

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register as {
    ref: (instance: HTMLInputElement | null) => void;
  };

  const [image, setImage] = React.useState<string>();

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      setValue("image", event.target.files[0]);
    }
  };

  return (
    <>
      <InputGroup onClick={handleClick}>
        <input
          id={id}
          type={"file"}
          multiple={multiple || false}
          hidden
          accept={"image/png, image/jpeg, image/webp"}
          {...rest}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
          onChange={handleFileInputChange}
        />

        {image ? (
          <Flex
            w="full"
            p="1"
            border="1px"
            justifyContent="center"
            rounded="lg"
            borderColor="gray.200"
          >
            <Image src={image} alt="upload image" />
          </Flex>
        ) : (
          <Flex
            border="4px"
            borderStyle="dashed"
            borderColor="teal"
            rounded="lg"
            w="full"
            h="200"
            justifyContent="center"
            alignItems="center"
            cursor="pointer"
          >
            <AddIcon color="teal" h="30" w="30" />
          </Flex>
        )}
      </InputGroup>
      {image && (
        <Flex mt="2" justifyContent="end">
          <Button onClick={handleClick} size="xs">
            Change
          </Button>
        </Flex>
      )}
    </>
  );
};
