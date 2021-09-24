'use es6';

import { connect } from 'react-redux';
import { logNewRelicPageAction } from 'FileManagerCore/utils/logging';
import FoldersAndFiles from '../../components/browser/FoldersAndFiles';
import { uploadFiles } from '../../actions/Files';
import { selectFile, deselectFile, trackInteraction, maybeFetchFoldersByParentId, browseToFolder } from '../../actions/Actions';
import { getUploadingFiles } from 'FileManagerCore/selectors/UploadingFiles';
import { getIsReadOnly } from 'FileManagerCore/selectors/Permissions';
import { getSelectedFolderInPanel, getSelectedFileId } from '../../selectors/Panel';
import { getIsHostAppContextPrivate } from '../../selectors/Configuration';
import { getIsHublPanelOpenAndUserOverEmbeddableVideoLimit } from '../../selectors/Limits';

var mapStateToProps = function mapStateToProps(state, props) {
  return {
    selectedFolder: getSelectedFolderInPanel(state),
    selectedFileId: getSelectedFileId(state),
    uploadingFiles: getUploadingFiles(state),
    isReadOnly: getIsReadOnly(state),
    disableUpload: props.disableUpload || getIsHublPanelOpenAndUserOverEmbeddableVideoLimit(state, props),
    isHostAppContextPrivate: getIsHostAppContextPrivate(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onSelectFolder: function onSelectFolder(folder) {
      dispatch(maybeFetchFoldersByParentId(folder.get('id')));
      dispatch(browseToFolder(folder.get('id')));
    },
    onSelectFile: function onSelectFile(file, meta) {
      dispatch(file ? selectFile(file, meta) : deselectFile(meta));
    },
    onDropFiles: function onDropFiles(files, folder, type) {
      var options = {
        folderId: folder.get('id'),
        type: type
      };
      dispatch(uploadFiles(files, options));
      dispatch(maybeFetchFoldersByParentId(folder.get('id')));
      dispatch(browseToFolder(folder.get('id')));
      dispatch(trackInteraction('Manage Files', 'drag-and-dropped-file', {
        target: 'folder'
      }));
      logNewRelicPageAction('dropFiles', {
        componentName: 'Drawer',
        target: 'folder-drop-target',
        drawerType: type
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FoldersAndFiles);