'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { Map as ImmutableMap } from 'immutable';
import { Provider } from 'react-redux';
import { setAuth } from 'FileManagerCore/actions/Auth';
import { libComponentDidMount } from '../actions/Actions';
import configureStore from '../utils/redux/configureStore';
import { getCurrentApp, logNewRelicError, logNewRelicPageAction } from 'FileManagerCore/utils/logging';
import { getIsConfigureFileManagerFileAccessValid } from '../utils/validateFileAccess';
var configureCalled = false;
export default function configureFileManager(_ref) {
  var usageTracker = _ref.usageTracker,
      _ref$specificCanvaTem = _ref.specificCanvaTemplates,
      specificCanvaTemplates = _ref$specificCanvaTem === void 0 ? null : _ref$specificCanvaTem,
      _ref$withCanva = _ref.withCanva,
      withCanva = _ref$withCanva === void 0 ? false : _ref$withCanva,
      _ref$withShutterstock = _ref.withShutterstock,
      withShutterstock = _ref$withShutterstock === void 0 ? false : _ref$withShutterstock,
      uploadedFileAccess = _ref.uploadedFileAccess;

  if (!getIsConfigureFileManagerFileAccessValid(uploadedFileAccess)) {
    throw new Error('[FileManagerLib/configureFileManager] Specify file visibility in your configureFileManager function. Visit https://product.hubteam.com/docs/file-manager-manual/Frontend/index.html for details.');
  }

  if (configureCalled) {
    console.warn('[FileManagerLib/configureFileManager] should only be called once and was already called.');
    logNewRelicPageAction('warn-multiple-configureFileManager-calls');
  }

  var store = configureStore({
    configuration: ImmutableMap({
      specificCanvaTemplates: specificCanvaTemplates,
      withCanva: withCanva,
      withShutterstock: withShutterstock,
      hostApp: getCurrentApp(),
      uploadedFileAccess: uploadedFileAccess
    })
  }, {
    usageTracker: usageTracker
  });
  configureCalled = true;

  var FileManager = /*#__PURE__*/function (_Component) {
    _inherits(FileManager, _Component);

    function FileManager(props) {
      var _this;

      _classCallCheck(this, FileManager);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(FileManager).call(this, props));
      FileManager.dispatch(setAuth(props.auth));
      return _this;
    }

    _createClass(FileManager, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        FileManager.dispatch(libComponentDidMount());
      }
    }, {
      key: "componentDidCatch",
      value: function componentDidCatch(error) {
        logNewRelicError(error, {
          errorBoundary: true
        });
        console.error('[FileManagerLib] hit error boundary', error);
      }
    }, {
      key: "render",
      value: function render() {
        var children = this.props.children;
        return /*#__PURE__*/_jsx(Provider, {
          store: store,
          children: children
        });
      }
    }]);

    return FileManager;
  }(Component);

  FileManager.propTypes = {
    auth: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  };
  FileManager.dispatch = store.dispatch;
  FileManager.getState = store.getState;
  return FileManager;
}