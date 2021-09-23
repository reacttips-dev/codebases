'use es6';

import getIn from 'transmute/getIn';
import { FILE, LOCAL_ID, FILE_ID, UPLOAD_PROGRESS } from '../constants/fileUploadKeyPaths';
export var getFile = getIn(FILE);
export var getLocalId = getIn(LOCAL_ID);
export var getFileId = getIn(FILE_ID);
export var getUploadProgress = getIn(UPLOAD_PROGRESS);