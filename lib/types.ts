export interface IGallery {
  id: number;
  userId: string;
  name: string;
  desc: string;
  category: string;
  images: IImage[];
  created_at: string;
}

export interface IImage {
  name: string;
  url: string;
}
