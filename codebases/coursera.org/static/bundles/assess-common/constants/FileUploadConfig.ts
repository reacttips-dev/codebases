export const s3Bucket = 'coursera-assessments';
export const s3UploadDir = 'assessments';

// limit based on usage patterns and  Coursera upload recommendations
// (see https://partner.coursera.help/hc/en-us/articles/115000173663-Add-Peer-Review-Prompts)
export const maxFileSize = 2147483648; // 2 GB

export default {
  s3Bucket,
  s3UploadDir,
  maxFileSize,
};
