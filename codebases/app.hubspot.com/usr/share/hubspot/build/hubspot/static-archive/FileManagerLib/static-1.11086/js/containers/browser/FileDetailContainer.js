'use es6';

import { connect } from 'react-redux';
import FileDetail from '../../components/browser/FileDetail';
import { getFoldersCount } from 'FileManagerCore/selectors/Folders';
import { acquireFileFromCanva } from 'FileManagerCore/actions/Canva';
import { getIsCanvaFile } from 'FileManagerCore/selectors/Canva';
import { getIsReadOnly } from 'FileManagerCore/selectors/Permissions';
import { moveFile, removeFile, renameFile } from '../../actions/Files';
import { deselectFile as _deselectFile, trackInteraction as _trackInteraction } from '../../actions/Actions';
import { getIsHostAppContextPrivate, getUploadedFileAccess } from '../../selectors/Configuration';
import { getParentFolderForSelectFile } from '../../selectors/Panel';
import { getIsSelectedSingleFileFetched } from '../../selectors/Files';
import { getIsUngatedForRecycleBin } from 'FileManagerCore/selectors/Auth';

var mapStateToProps = function mapStateToProps(state, props) {
  return {
    parentFolder: getParentFolderForSelectFile(state),
    folderCount: getFoldersCount(state),
    isHostAppContextPrivate: getIsHostAppContextPrivate(state),
    isCanvaFile: getIsCanvaFile(state, {
      file: props.tile.get('file')
    }),
    isReadOnly: getIsReadOnly(state),
    uploadedFileAccess: getUploadedFileAccess(state),
    isSingleFileFetched: getIsSelectedSingleFileFetched(state),
    isUngatedForRecycleBin: getIsUngatedForRecycleBin(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    trackInteraction: function trackInteraction() {
      return dispatch(_trackInteraction.apply(void 0, arguments));
    },
    onAcquireFromCanva: function onAcquireFromCanva(_ref) {
      var canvaDesignId = _ref.canvaDesignId,
          fileUrl = _ref.fileUrl,
          originalFileId = _ref.originalFileId,
          fileName = _ref.fileName,
          uploadedFileAccess = _ref.uploadedFileAccess;
      dispatch(acquireFileFromCanva({
        canvaDesignId: canvaDesignId,
        fileUrl: fileUrl,
        originalFileId: originalFileId,
        fileName: fileName,
        uploadedFileAccess: uploadedFileAccess
      }));
    },
    onDelete: function onDelete(file) {
      dispatch(removeFile(file));
    },
    onMove: function onMove(file, folder) {
      dispatch(moveFile(file, folder.get('id')));
    },
    onRename: function onRename(file, newName) {
      return dispatch(renameFile(file, newName));
    },
    deselectFile: function deselectFile() {
      return dispatch(_deselectFile());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileDetail);