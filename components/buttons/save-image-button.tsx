import * as React from "react";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import useSWR from "swr";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { useMessage } from "@/hooks/use-message";

type SaveImageButtonProps = {
  imageId: number;
  imageName: string;
};

export const SaveImageButton = ({
  imageId,
  imageName,
}: SaveImageButtonProps) => {
  const supabase = useSupabaseClient();
  const session = useSession();
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

  const message = useMessage();
  const isLogin = () => {
    if (!session) {
      message({
        title: "You are not logged in, please login first",
        status: "error",
      });
    }
  };

  const [saving, setSaving] = React.useState(false);
  const onSave = async (gallery_id: number) => {
    setSaving(true);
    const { data: isExistData } = await supabase
      .from("gallery_image")
      .select("*")
      .eq("gallery_id", gallery_id)
      .eq("image_id", imageId);

    if (isExistData?.length !== 0) {
      message({
        title: "This image already exists in this gallery",
        status: "error",
      });
    } else {
      const { error } = await supabase.from("gallery_image").insert([
        {
          gallery_id,
          image_id: imageId,
          user_id: user?.id,
          image_name: imageName,
          is_basic: false,
        },
      ]);
      if (error) {
        message({ title: error.message, status: "error" });
      } else {
        message({ title: "Save successfully", status: "success" });
      }
    }
    setSaving(false);
  };

  return (
    <Menu>
      <MenuButton
        isLoading={saving}
        colorScheme="teal"
        w="full"
        as={Button}
        onClick={isLogin}
      >
        Save
      </MenuButton>
      {session && (
        <MenuList>
          {data?.map((item) => (
            <MenuItem onClick={() => onSave(item.id)} key={item.id}>
              {item.name}
            </MenuItem>
          ))}
          {data?.length === 0 && <MenuItem>No Gallery</MenuItem>}
        </MenuList>
      )}
    </Menu>
  );
};
