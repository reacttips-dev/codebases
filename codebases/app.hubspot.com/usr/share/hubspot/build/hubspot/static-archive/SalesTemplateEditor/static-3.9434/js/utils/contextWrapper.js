'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { Provider } from 'react-redux';
import { unpackContext } from './unpackContext';
import createStore from './createStore';
import { fetchDecks } from 'SalesTemplateEditor/actions/DeckActions';
import { fetchFolders } from 'SalesTemplateEditor/actions/FolderActions';
import { fetchProperties } from 'SalesTemplateEditor/actions/PropertyActions';
import { fetchTemplateUsage } from 'SalesTemplateEditor/actions/TemplateUsageActions';
import { openEditor, clearEditor } from 'SalesTemplateEditor/actions/TemplateActions';

var convertArrayToValueMap = function convertArrayToValueMap(arr) {
  return arr.reduce(function (valueMap, v) {
    valueMap[v] = true;
    return valueMap;
  }, {});
};

export default (function (InitialComponent) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      isTemplatePreview = _ref.isTemplatePreview;

  var WrappedComponent = /*#__PURE__*/function (_Component) {
    _inherits(WrappedComponent, _Component);

    function WrappedComponent() {
      var _this;

      _classCallCheck(this, WrappedComponent);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(WrappedComponent).call(this));
      _this.state = {};
      _this.store = createStore();
      return _this;
    }

    _createClass(WrappedComponent, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        if (Array.isArray(this.context.gates)) {
          this.context.gates = convertArrayToValueMap(this.context.gates);
        }

        if (Array.isArray(this.context.scopes)) {
          this.context.scopes = convertArrayToValueMap(this.context.scopes);
        }

        if (!isTemplatePreview) {
          unpackContext(this.context);
        }

        this.initReduxStore();
        this.openEditorIfTemplateDefined();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        this.openEditorIfTemplateDefined(prevProps);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.store.dispatch(clearEditor());
      }
    }, {
      key: "initReduxStore",
      value: function initReduxStore() {
        if (!isTemplatePreview) {
          this.store.dispatch(fetchDecks());
          this.store.dispatch(fetchFolders());
          this.store.dispatch(fetchTemplateUsage());
        }

        this.store.dispatch(fetchProperties());
      }
    }, {
      key: "openEditorIfTemplateDefined",
      value: function openEditorIfTemplateDefined() {
        var prevProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        // For template previews in the template library (TemplatesUI),
        // there's no way to edit the template; so no need to store it in redux.
        // The parent component dynamically passes different `template`s based
        // on the user's selection, so the editor should update whenever the prop does
        if (isTemplatePreview) {
          return;
        }

        var template = this.props.template;

        if (template && !prevProps.template) {
          this.store.dispatch(openEditor({
            template: template
          }));
        }
      }
    }, {
      key: "render",
      value: function render() {
        return /*#__PURE__*/_jsx(Provider, {
          store: this.store,
          children: /*#__PURE__*/_jsx(InitialComponent, Object.assign({}, this.props))
        });
      }
    }]);

    return WrappedComponent;
  }(Component);

  WrappedComponent.contextTypes = {
    hubSpotAuth: PropTypes.object,
    userProfile: PropTypes.object,
    messageModal: PropTypes.object,
    gates: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    tracker: PropTypes.func,
    scopes: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  };
  WrappedComponent.propTypes = InitialComponent.propTypes;
  return WrappedComponent;
});