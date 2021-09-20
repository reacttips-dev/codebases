interface GiphySticker {
  images: {
    preview: {
      webp: string;
    };
    fixed_width_small: {
      url: string;
      width: string;
      height: string;
    };
    fixed_width_small_still: {
      url: string;
      width: string;
      height: string;
    };
  };
}

export const giphyStickersToTrelloStickers = (
  giphyStickers: GiphySticker[],
  isChrome: boolean,
) => {
  return giphyStickers
    .map((giphySticker) => {
      const fixedWidthSmall = giphySticker.images.fixed_width_small;
      let scaledPreviewUrl = fixedWidthSmall.url;
      if (isChrome && giphySticker.images.preview.webp) {
        scaledPreviewUrl = giphySticker.images.preview.webp;
      }
      const still = giphySticker.images.fixed_width_small_still;
      const width = parseInt(fixedWidthSmall.width, 10);
      const height = parseInt(fixedWidthSmall.height, 10);

      if (width > height) {
        if (height / width < 0.75) {
          return null;
        }
      } else if (width / height < 0.75) {
        return null;
      }

      return {
        url: fixedWidthSmall.url,
        scaled: [
          {
            url: scaledPreviewUrl,
            width,
            height,
          },
        ],
        stillUrl: still.url,
        stillScaled: [
          {
            url: still.url,
            width,
            height,
          },
        ],
      };
    })
    .filter((sticker) => !!sticker);
};
