export default function loadFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = loadedFIle => resolve(loadedFIle.target.result);

    reader.onerror = () =>
      reject(new Error('There was an error uploading the file'));
  });
}
