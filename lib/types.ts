type LatestImagesType = {
  gallery_id: string;
  image_name: string;
  user_id: string;
  image: {
    id: number;
    url: string;
    profile: {
      name: string;
    };
  };
};

type LatestGalleriesType = {
  id: number;
  name: string;
  category: string;
  image: {
    url: string;
  }[];
  profile: {
    name: string;
  };
};

type GalleriesType = {
  id: number;
  name: string;
  category: string;
  image: string;
  count: number;
  author: string;
};
