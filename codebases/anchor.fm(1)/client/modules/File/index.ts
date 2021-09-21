function getUnixSaveFilePathName(filename: string) {
  return filename.replace(/[^a-zA-Z0-9-\.]/g, '-'); // unix-safe file path name
}

export { getUnixSaveFilePathName };
