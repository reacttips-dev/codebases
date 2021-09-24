'use es6';

import { PrivateFileAccess } from 'FileManagerCore/enums/InternalFileManagerFileAccess';
import { getIsDrawerFileAccessValid } from '../../utils/validateFileAccess';
import { DrawerTypes } from '../../Constants'; // The drawer fires global events on open and close in order to help apps work around a Chrome bug
// that prevents drag and drop events to the file manager drawer if it is on top of an iframe.
// More info in https://git.hubteam.com/HubSpot/FileManagerUI/pull/1272

export function fireEvent(type) {
  var event;

  try {
    event = new CustomEvent(type);
  } catch (e) {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(type, false, false, null);
  }

  document.dispatchEvent(event);
}
export function validateFileAccess(type, uploadedFileAccess) {
  if (!getIsDrawerFileAccessValid(uploadedFileAccess)) {
    throw new Error('[FileManagerLib/FilePickerPanel] Missing uploadedFileAccess prop in configureFileManager. Visit https://product.hubteam.com/docs/file-manager-manual/Frontend/index.html for details.');
  }

  if (PrivateFileAccess.includes(uploadedFileAccess) && type === DrawerTypes.HUBL_VIDEO) {
    throw new Error("[FileManagerLib/FilePickerPanel] Invalid uploadedFileAccess: " + uploadedFileAccess + ". HUBL_VIDEO cannot be associated with a PRIVATE setting. Use DrawerTypes.VIDEO instead.");
  }
}