'use es6';

import setIn from 'transmute/setIn';
import { FILE, FILE_ID, UPLOAD_PROGRESS } from '../constants/fileUploadKeyPaths';
export var setFile = setIn(FILE);
export var setFileId = setIn(FILE_ID);
export var setUploadProgress = setIn(UPLOAD_PROGRESS);