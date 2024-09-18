export interface Place {
  id: string;
  title: string;
  image: {
    src: string;
    alt: string;
    imagePicture: {
      id: number
    }
  };
  lat: number;
  lon: number;
}
