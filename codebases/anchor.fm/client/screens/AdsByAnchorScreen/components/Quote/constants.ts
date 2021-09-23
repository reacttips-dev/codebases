export type FallbackExtension = 'png' | 'jpg';

export type ImageType = {
  alt: string;
  fallbackExtension: FallbackExtension;
  imagePath: string;
  offset: number;
  size: number;
};

export type ImageMapType = {
  [key: string]: ImageType;
};

export const IMAGE_MAP: ImageMapType = {
  imageOne: {
    alt: 'Man hosting podcast with other contributors',
    fallbackExtension: 'jpg',
    imagePath: '/span/quote-man-hosting-podcast',
    offset: 0,
    size: 225,
  },
  imageTwo: {
    alt: 'Logo for "The Colin and Samir Show"',
    fallbackExtension: 'jpg',
    imagePath: '/span/quote-the-colin-and-samir-show-podcast',
    offset: 50,
    size: 350,
  },
  imageThree: {
    alt: 'Man adding a new track to his podcast',
    fallbackExtension: 'jpg',
    imagePath: '/span/quote-man-with-microphone',
    offset: 100,
    size: 225,
  },
};
