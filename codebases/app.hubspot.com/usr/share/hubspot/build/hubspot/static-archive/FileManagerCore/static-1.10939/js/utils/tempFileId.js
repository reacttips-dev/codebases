'use es6';

var tempId = 0;
export default function tempFileId() {
  tempId = tempId - 1;
  return tempId;
}