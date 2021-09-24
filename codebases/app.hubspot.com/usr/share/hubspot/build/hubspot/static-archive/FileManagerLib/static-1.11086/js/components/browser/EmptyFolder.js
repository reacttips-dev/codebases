'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import UIImage from 'UIComponents/image/UIImage';
import emptyFolderUrl from 'bender-url!FileManagerImages/images/empty-folder.svg';
import AddFolderButton from './AddFolderButton';
import { DrawerTypes } from '../../Constants';
import FormattedMessage from 'I18n/components/FormattedMessage';

var getI18nKey = function getI18nKey(suffix) {
  return "FileManagerLib.emptyFolder." + suffix;
};

export default function EmptyFolder(props) {
  var onCreateFolder = props.onCreateFolder,
      folders = props.folders,
      selectedFolder = props.selectedFolder,
      isReadOnly = props.isReadOnly,
      type = props.type;

  if (type !== DrawerTypes.FILE) {
    return /*#__PURE__*/_jsxs("div", {
      className: "text-center m-top-2",
      "data-test-id": "empty-folder",
      children: [/*#__PURE__*/_jsx("h5", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: getI18nKey('message') + "_" + type
        })
      }), /*#__PURE__*/_jsx("p", {
        children: !isReadOnly && /*#__PURE__*/_jsx(FormattedReactMessage, {
          message: "FileManagerLib.emptyFolder.hint",
          options: {
            button: /*#__PURE__*/_jsx(AddFolderButton, {
              folders: folders,
              selectedFolder: selectedFolder,
              onCreate: onCreateFolder,
              isReadOnly: isReadOnly,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "FileManagerLib.emptyFolder.inlineButtonText"
              })
            })
          }
        })
      })]
    });
  }

  return /*#__PURE__*/_jsxs("div", {
    className: "text-center",
    "data-test-id": "empty-folder",
    children: [/*#__PURE__*/_jsx(UIImage, {
      className: "m-y-10",
      width: 100,
      src: emptyFolderUrl,
      responsive: false
    }), /*#__PURE__*/_jsx("h5", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: getI18nKey('message')
      })
    }), /*#__PURE__*/_jsx("p", {
      children: !isReadOnly && /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: "FileManagerLib.emptyFolder.hint",
        options: {
          button: /*#__PURE__*/_jsx(AddFolderButton, {
            folders: folders,
            selectedFolder: selectedFolder,
            onCreate: onCreateFolder,
            isReadOnly: isReadOnly,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "FileManagerLib.emptyFolder.inlineButtonText"
            })
          })
        }
      })
    })]
  });
}
EmptyFolder.propTypes = {
  folders: PropTypes.instanceOf(Immutable.List).isRequired,
  selectedFolder: PropTypes.instanceOf(Immutable.Map),
  onCreateFolder: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(Object.keys(DrawerTypes))
};
EmptyFolder.defaultProps = {
  isReadOnly: false
};