'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { delayUntilIdle } from './delayUntilIdle';
import { CONTACT, COMPANY, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import * as PropertySourceTypes from 'customer-data-objects/property/PropertySourceTypes';
import emptyFunction from 'react-utils/emptyFunction';

var EmbeddedDialog = function EmbeddedDialog(_ref, dialogRef) {
  var _ref$defaultPropertie = _ref.defaultProperties,
      defaultProperties = _ref$defaultPropertie === void 0 ? {} : _ref$defaultPropertie,
      objectType = _ref.objectType,
      _ref$onCancel = _ref.onCancel,
      onCancel = _ref$onCancel === void 0 ? emptyFunction : _ref$onCancel,
      _ref$onCreate = _ref.onCreate,
      onCreate = _ref$onCreate === void 0 ? emptyFunction : _ref$onCreate,
      _ref$onError = _ref.onError,
      onError = _ref$onError === void 0 ? emptyFunction : _ref$onError,
      _ref$preload = _ref.preload,
      preload = _ref$preload === void 0 ? false : _ref$preload,
      _ref$pipelineId = _ref.pipelineId,
      pipelineId = _ref$pipelineId === void 0 ? null : _ref$pipelineId,
      _ref$showOnMount = _ref.showOnMount,
      showOnMount = _ref$showOnMount === void 0 ? false : _ref$showOnMount,
      sourceApp = _ref.sourceApp,
      via = _ref.via,
      use = _ref.use;

  var _useState = useState({
    CreateObjectEmbeddedDialogIframe: function CreateObjectEmbeddedDialogIframe() {
      return null;
    }
  }),
      _useState2 = _slicedToArray(_useState, 2),
      CreateObjectEmbeddedDialogIframe = _useState2[0].CreateObjectEmbeddedDialogIframe,
      setContent = _useState2[1];

  var _useState3 = useState(showOnMount),
      _useState4 = _slicedToArray(_useState3, 2),
      showDialog = _useState4[0],
      setShowDialog = _useState4[1];

  var show = function show() {
    return setShowDialog(true);
  };

  var hide = function hide() {
    return setShowDialog(false);
  };

  useImperativeHandle(dialogRef, function () {
    return {
      show: show,
      hide: hide
    };
  });
  useEffect(function () {
    var mounted = true;
    delayUntilIdle(function () {
      import(
      /* webpackChunkName: "object-creator-dialog" */
      './CreateObjectEmbeddedDialogIframe').then(function (mod) {
        if (mounted) {
          setContent({
            CreateObjectEmbeddedDialogIframe: mod.default
          });
        }
      }).done();
    });
    return function () {
      mounted = false;
    };
  }, []);

  var handleCreate = function handleCreate(evt) {
    onCreate(evt);

    if (!evt.createAnother) {
      hide();
    }
  };

  var handleCancel = function handleCancel() {
    onCancel();
    hide();
  };

  return /*#__PURE__*/_jsx(CreateObjectEmbeddedDialogIframe, {
    defaultProperties: defaultProperties,
    objectType: objectType,
    onCancel: handleCancel,
    onCreate: handleCreate,
    onError: onError,
    open: showDialog,
    pipelineId: pipelineId,
    preload: preload,
    redirectToRecord: true,
    sourceApp: sourceApp,
    via: via,
    use: use
  });
};

var CreateObjectEmbeddedDialog = /*#__PURE__*/forwardRef(EmbeddedDialog);
CreateObjectEmbeddedDialog.propTypes = {
  defaultProperties: PropTypes.object,
  objectType: PropTypes.oneOf([CONTACT, COMPANY, DEAL, TICKET]).isRequired,
  onCreate: PropTypes.func,
  pipelineId: PropTypes.string,
  showOnMount: PropTypes.bool,
  sourceApp: PropTypes.oneOf(Object.values(PropertySourceTypes)).isRequired
};
export default CreateObjectEmbeddedDialog;