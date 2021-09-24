'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { pick } from '../../../../utils';
import validateUpgradeData from 'ui-addon-upgrades/_core/common/data/upgradeData/validateUpgradeData';
import { upgradeDataPropsInterface } from 'ui-addon-upgrades/_core/common/data/upgradeData/interfaces/upgradeDataPropsInterface';
import { createRenderBlockingUpgradeData, createLazyLoadedUpgradeData } from 'ui-addon-upgrades/_core/common/data/upgradeData/createUpgradeData';
import { prefetchMeetingData } from 'ui-addon-upgrades/_core/common/api/meetingHelpers';
import didUpgradeDataChange from 'ui-addon-upgrades/_core/common/data/upgradeData/didUpgradeDataChange';
import Raven from 'Raven';
import { GENERAL } from 'self-service-api/constants/UpgradeProducts';

var connectUpgradeData = function connectUpgradeData(Component, upgradeSource) {
  var UpgradeDataHOC = /*#__PURE__*/function (_React$Component) {
    _inherits(UpgradeDataHOC, _React$Component);

    function UpgradeDataHOC(props) {
      var _this;

      _classCallCheck(this, UpgradeDataHOC);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(UpgradeDataHOC).call(this, props));
      _this.state = {
        renderBlockingUpgradeData: {},
        lazyLoadedUpgradeData: {}
      };
      return _this;
    }

    _createClass(UpgradeDataHOC, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.mounted = true;
        var _this$props = this.props,
            upgradeData = _this$props.upgradeData,
            allowModal = _this$props.allowModal;

        if (allowModal) {
          prefetchMeetingData();
        }

        if (!upgradeData || !upgradeSource) {
          return Promise.resolve();
        }

        return this.wrapUpgradeData().done();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        // Re-wrap upgrade data if the upgrade data has changed
        // Note that we dont gate this in shouldComponentUpdate because
        // we'd have to do checks for the state changing as well which might
        // get a bit messy
        if (didUpgradeDataChange(prevProps.upgradeData, this.props.upgradeData)) {
          this.wrapUpgradeData().done();
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.mounted = false;
      }
    }, {
      key: "wrapUpgradeData",
      value: function wrapUpgradeData() {
        var _this2 = this;

        var upgradeData = this.props.upgradeData;
        return createRenderBlockingUpgradeData(upgradeData, upgradeSource, this.props).then(function (renderBlockingUpgradeData) {
          // Since this is in a promise handler, it's possible the component has unmounted in that time
          // Will cause a warning if we setState on the unmounted component
          // See: https://github.com/facebook/react/issues/3417
          if (_this2.mounted) {
            _this2.setState({
              renderBlockingUpgradeData: renderBlockingUpgradeData
            });
          }

          return renderBlockingUpgradeData;
        }).then(function (renderBlockingUpgradeData) {
          return createLazyLoadedUpgradeData(renderBlockingUpgradeData, upgradeSource, _this2.props).then(function (lazyLoadedUpgradeData) {
            if (_this2.mounted) {
              _this2.setState({
                lazyLoadedUpgradeData: lazyLoadedUpgradeData
              });
            }

            return lazyLoadedUpgradeData;
          });
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this$state = this.state,
            renderBlockingUpgradeData = _this$state.renderBlockingUpgradeData,
            lazyLoadedUpgradeData = _this$state.lazyLoadedUpgradeData;

        if (Object.keys(renderBlockingUpgradeData).length > 0) {
          var isValid = validateUpgradeData(renderBlockingUpgradeData);
          var newProps = Object.assign({}, this.props, {
            upgradeData: Object.assign({}, renderBlockingUpgradeData, {}, lazyLoadedUpgradeData)
          });

          if (!isValid) {
            Raven.captureMessage('Upgrade data is not valid', Object.assign({}, newProps.upgradeData));
            newProps.upgradeData.upgradeProduct = GENERAL;
            newProps.upgradeData.repInfo = null;
          }

          return /*#__PURE__*/_jsx(Component, Object.assign({}, newProps));
        }

        return null;
      }
    }]);

    return UpgradeDataHOC;
  }(React.Component);

  UpgradeDataHOC.defaultProps = {
    allowModal: true
  }; // mostly for decorators like promptable that complain

  var requiredComponentPropTypes = Component.propTypes ? pick(Component.propTypes, ['onConfirm', 'onReject']) : {};
  UpgradeDataHOC.propTypes = Object.assign({}, requiredComponentPropTypes, {}, upgradeDataPropsInterface);
  return UpgradeDataHOC;
};

export default connectUpgradeData;