export default function loadImg(dataUrl, dims) {
  // destructure props from dims
  const { minWidth, maxWidth, minHeight, maxHeight } = dims;

  return new Promise((resolve, reject) => {
    // create a new html image element
    const img = new Image();
    // set the image src attribute to our dataUrl
    img.src = dataUrl;

    // listen for onload event
    img.onload = () => {
      // validate the min and max image dimensions
      if (img.width < minWidth || img.height < minHeight) {
        reject(
          new Error(
            `The uploaded image is too small. Must be at least ${minWidth}px by ${minHeight}px.`
          )
        );
      }

      if (img.width > maxWidth || img.height > maxHeight) {
        reject(
          new Error(
            `The uploaded image is too large. Must be no more than ${maxWidth}px by ${maxHeight}px.`
          )
        );
      }

      resolve(true);
    };

    img.onerror = () =>
      reject(new Error('There was an error uploading the image'));
  });
}
