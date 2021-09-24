'use es6';

import once from 'transmute/once';
import configureFileManager from 'FileManagerLib/components/configureFileManager';
import { ConfigureFileManagerFileAccess } from 'FileManagerLib/enums/FileAccess';

var getFileManager = function getFileManager(usageTracker) {
  return configureFileManager({
    usageTracker: usageTracker,
    uploadedFileAccess: ConfigureFileManagerFileAccess.VISIBLE_IN_APP_PUBLIC_TO_ALL_NOT_INDEXABLE
  });
};

export default once(getFileManager);