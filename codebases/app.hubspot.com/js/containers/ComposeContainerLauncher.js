'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import Loadable from 'UIComponents/decorators/Loadable';
import { getAccountsForDisplay } from '../redux/selectors';
import { getChannelsForComposerPicker } from '../redux/selectors/channels';
import { broadcastGroupProp, listProp, orderedMapProp, uiProp } from '../lib/propTypes';
var AsyncComposeContainer = Loadable({
  loader: function loader() {
    return import('./ComposeContainer'
    /* webpackChunkName: "ComposeContainer" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  }
});

var mapStateToProps = function mapStateToProps(state) {
  return {
    accounts: getAccountsForDisplay(state),
    broadcastGroup: state.broadcastGroup,
    channels: getChannelsForComposerPicker(state),
    ui: state.ui
  };
};

var mapDispatchToProps = {};

var ComposeContainerLauncher = /*#__PURE__*/function (_PureComponent) {
  _inherits(ComposeContainerLauncher, _PureComponent);

  function ComposeContainerLauncher() {
    _classCallCheck(this, ComposeContainerLauncher);

    return _possibleConstructorReturn(this, _getPrototypeOf(ComposeContainerLauncher).apply(this, arguments));
  }

  _createClass(ComposeContainerLauncher, [{
    key: "render",
    value: function render() {
      if (this.props.broadcastGroup && this.props.ui.get('composerSuccessOpen') || this.props.ui.get('composerOpen') && this.props.broadcastGroup && this.props.channels && this.props.accounts) {
        return /*#__PURE__*/_jsx(AsyncComposeContainer, {});
      }

      return null;
    }
  }]);

  return ComposeContainerLauncher;
}(PureComponent);

ComposeContainerLauncher.propTypes = {
  accounts: listProp,
  broadcastGroup: broadcastGroupProp,
  channels: orderedMapProp,
  ui: uiProp
};
export default connect(mapStateToProps, mapDispatchToProps)(ComposeContainerLauncher);