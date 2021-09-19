/*
  Get the default image properties to look for in objects
*/
function defaultImageKeys() {
  return ['thumbnailImageUrl', 'headerImageUrl'] as const;
}

/*
  Given a relative image url and an image server base url, return a absolute
  image url.
*/
export function absoluteImageUrl(relativeImageUrl: string, imageServerUrl: string) {
  return relativeImageUrl ? imageServerUrl + relativeImageUrl : relativeImageUrl;
}

/*
  Transforms the image urls within an array of objects to absolute image urls

  Example input for thingsWithImages:
    [
      {image: "/foo/bar.jpg"},
      {image: "/foo/baz.jpg"}
    ]
*/
export function absolutifyItemImages(thingsWithImages: Record<string, string>[], imageServerUrl: string, imageKeys = defaultImageKeys()) {
  (thingsWithImages || []).forEach(thingWithImages => {
    imageKeys.forEach(imageKey => {
      thingWithImages[imageKey] = absoluteImageUrl(thingWithImages[imageKey], imageServerUrl);
    });
  });
}
