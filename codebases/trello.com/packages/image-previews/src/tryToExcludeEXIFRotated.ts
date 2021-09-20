export interface Preview {
  scaled?: boolean;
  width: number;
  height: number;
  url?: string;
}

// HACK: Okay, so EXIF is ruining everything
//
// If a user has an image that has an EXIF orientation set, then the list
// of previews might have some images that are oriented the "right" way
// regardless of if EXIF orientation is respected (because the server
// auto-oriented them as part of the scaling process) and the original
// image, which will only be oriented correctly if EXIF orientation is
// respected … which it *won't* be if it's being displayed in HTML by a
// browser (however, Chrome at least will respect EXIF if you're using
// the browser to view the image directly)
//
// So, rather than wait for image-orientation: from-image to become a thing
// we can mitigate the problem by removing the one image with a width/height
// that gives it an aspect ratio unlike the rest of the previews.  Of course,
// this isn't a complete solution because it only works if there were at least
// two previews generated … but that's better than things just looking broken.
export function tryToExcludeEXIFRotated(
  previews: Preview[] | null = [],
): Preview[] {
  if (!previews) {
    return [];
  }

  // Try to figure out the most common orientation.
  const portraitLevel = previews.reduce(function (
    memo,
    { scaled, width, height },
  ) {
    // It's possible for scaled down versions of a non-square image to
    // end up with dimensions that are square (due to rounding)  Don't use
    // those to determine the actual orientation
    if (!scaled || width === height) {
      return memo;
    } else if (height > width) {
      return memo + 1;
    } else {
      return memo - 1;
    }
  },
  0);

  const usePortrait = portraitLevel > 0;

  return previews.filter(function ({ width, height }) {
    if (usePortrait) {
      return height >= width;
    } else {
      return width >= height;
    }
  });
}
