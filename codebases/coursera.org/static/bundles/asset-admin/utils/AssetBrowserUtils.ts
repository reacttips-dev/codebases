export const getFileExtension = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf('.');
  const lastQuestionMarkIndex = fileName.lastIndexOf('?');
  if (lastDotIndex > -1) {
    const stringEnd = lastQuestionMarkIndex > lastDotIndex ? lastQuestionMarkIndex : fileName.length;
    return fileName.substring(lastDotIndex + 1, stringEnd);
  }

  return '';
};
