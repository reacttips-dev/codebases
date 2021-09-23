import { List, Record } from 'immutable';
import { FILES } from '../constants/attachmentTypes';
var FileAttachment = Record({
  '@type': FILES,
  fileIds: List(),
  strippedAttachmentCount: 0
}, 'FileAttachment');
export default FileAttachment;