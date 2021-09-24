'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import ImportImageCopyrightConfirm from '../modals/ImportImageCopyrightConfirm';
import PortalMetaCategoryIds from 'FileManagerCore/enums/PortalMetaCategoryIds';
import { ImportImageCopyrightNoticeValues } from 'FileManagerCore/Constants';
import { updatePortalMeta } from 'FileManagerCore/actions/PortalMeta';
import { trackInteraction } from 'FileManagerCore/actions/tracking';
import { getHasAcceptedImportCopyrightNotice } from 'FileManagerCore/selectors/PortalMeta';

var noop = function noop() {
  return undefined;
};

var CopyrightModalButton = function CopyrightModalButton(_ref) {
  var children = _ref.children,
      disabled = _ref.disabled,
      _ref$onConfirm = _ref.onConfirm,
      _onConfirm = _ref$onConfirm === void 0 ? noop : _ref$onConfirm;

  var dispatch = useDispatch();
  var hasAcceptedImportCopyrightNotice = useSelector(getHasAcceptedImportCopyrightNotice);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      open = _useState2[0],
      setOpen = _useState2[1];

  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(UIButton, {
      disabled: disabled,
      use: "primary",
      className: "m-bottom-2",
      onClick: function onClick() {
        if (!hasAcceptedImportCopyrightNotice) {
          setOpen(true);
        } else {
          _onConfirm();
        }
      },
      children: children
    }), open && /*#__PURE__*/_jsx(ImportImageCopyrightConfirm, {
      onConfirm: function onConfirm() {
        setOpen(false);
        dispatch(updatePortalMeta(PortalMetaCategoryIds.IMPORT_IMAGE_COPYRIGHT_NOTICE, ImportImageCopyrightNoticeValues.ACCEPTED));

        _onConfirm();

        dispatch(trackInteraction('fileManagerManageFiles', 'accept-copyright-notice'));
      },
      onReject: function onReject() {
        setOpen(false);
        dispatch(trackInteraction('fileManagerManageFiles', 'reject-copyright-notice'));
      }
    })]
  });
};

CopyrightModalButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  disabled: PropTypes.bool,
  onConfirm: PropTypes.func
};
export default CopyrightModalButton;