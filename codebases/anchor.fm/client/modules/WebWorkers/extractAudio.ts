import { createWorker } from '@ffmpeg/ffmpeg';

export async function extractAudio(videoFiles: File[], convertToAac?: boolean) {
  try {
    if (videoFiles.length === 0) return [];
    const worker = createWorker();
    const audios = videoFiles.map(async videoFile => {
      const {
        writeFilename,
        outputFilename,
        type,
        transcodeOption,
      } = getFileMetadata(videoFile, convertToAac);
      const { name } = videoFile;
      await worker.load();
      await worker.write(writeFilename, URL.createObjectURL(videoFile)!);
      await worker.transcode(
        writeFilename,
        outputFilename,
        `-vn -c:a ${transcodeOption}`
      );
      const output = await worker.read(outputFilename);
      await worker.remove(outputFilename);
      await worker.remove(writeFilename);
      const newFile = new File([new Blob([output.data.buffer])], name, {
        type,
      });
      return newFile;
    });
    const audioFiles = await Promise.all(audios);
    worker.terminate();
    return audioFiles;
  } catch {
    throw new Error('Unable to extract audio');
  }
}

function getFileMetadata(videoFile: File, convertToAac?: boolean) {
  const { lastModified } = videoFile;
  const writeExtension = getFileExtension(videoFile!);
  const outputExtension = convertToAac ? 'mp4' : writeExtension;
  const filenameBase = `${Math.random()
    .toString(36)
    .substring(7)}-${new Date(lastModified).getTime().toString()}`;
  return {
    writeFilename: `${filenameBase}-write.${writeExtension}`,
    outputFilename: `${filenameBase}.${outputExtension}`,
    type: `audio/${outputExtension}`,
    transcodeOption: convertToAac ? 'aac' : 'copy',
  };
}

function getFileExtension(videoFile: File) {
  if (!videoFile) return null;
  const splitName = videoFile.name.split('.');
  return splitName[splitName.length - 1];
}
