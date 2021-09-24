'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Component } from 'react';
import PortalIdParser from 'PortalIdParser';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import { connect } from 'react-redux';
import { fetchLSNIntegration } from 'SequencesUI/actions/LSNIntegrationActions';
import InsertCardPanelAlertStore from '../InsertCardPanelAlertStore';
import H2 from 'UIComponents/elements/headings/H2';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIFloatingAlertList from 'UIComponents/alert/UIFloatingAlertList';
import UIPanel from 'UIComponents/panel/UIPanel';
import UIPanelBody from 'UIComponents/panel/UIPanelBody';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import UIPanelFooter from 'UIComponents/panel/UIPanelFooter';
import Big from 'UIComponents/elements/Big';
import H4 from 'UIComponents/elements/headings/H4';
import KnowledgeBaseButton from 'ui-addon-i18n/components/KnowledgeBaseButton';
import UIIntegrationsConnectButton from 'ui-addon-integrations-directory-panel/UIIntegrationsConnectButton';
import { LINKED_IN_SALES_NAVIGATOR_APP_ID_PROD } from 'SequencesUI/actions/LSNIntegrationActions';

var ConnectLinkedIn = /*#__PURE__*/function (_Component) {
  _inherits(ConnectLinkedIn, _Component);

  function ConnectLinkedIn(props) {
    var _this;

    _classCallCheck(this, ConnectLinkedIn);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ConnectLinkedIn).call(this, props));
    _this.handleConnectionComplete = _this.handleConnectionComplete.bind(_assertThisInitialized(_this));
    _this.handleConnectionFailed = _this.handleConnectionFailed.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ConnectLinkedIn, [{
    key: "handleConnectionComplete",
    value: function handleConnectionComplete() {
      InsertCardPanelAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "alerts.connectLinkedIn.success.title"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "alerts.connectLinkedIn.success.message"
        }),
        type: 'success'
      });
      this.props.fetchLSNIntegration().then(this.props.goBack).done();
    }
  }, {
    key: "handleConnectionFailed",
    value: function handleConnectionFailed() {
      InsertCardPanelAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "alerts.connectLinkedIn.error.title"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "alerts.connectLinkedIn.error.message"
        }),
        type: 'danger'
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          closeModal = _this$props.closeModal,
          panelKey = _this$props.panelKey,
          width = _this$props.width,
          __goBack = _this$props.goBack,
          __fetchLSNIntegration = _this$props.fetchLSNIntegration,
          rest = _objectWithoutProperties(_this$props, ["closeModal", "panelKey", "width", "goBack", "fetchLSNIntegration"]);

      return /*#__PURE__*/_jsxs(UIPanel, Object.assign({
        width: width,
        panelKey: panelKey
      }, rest, {
        children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
          onClick: closeModal
        }), /*#__PURE__*/_jsx(UIPanelHeader, {
          children: /*#__PURE__*/_jsx(H2, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "edit.insertCardPanel.title.CONNECT_LINKEDIN"
            })
          })
        }), /*#__PURE__*/_jsxs(UIPanelBody, {
          children: [/*#__PURE__*/_jsx(UIFloatingAlertList, {
            alertStore: InsertCardPanelAlertStore,
            use: "contextual"
          }), /*#__PURE__*/_jsxs(UIPanelSection, {
            children: [/*#__PURE__*/_jsx(H4, {
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "edit.connectLinkedIn.primaryInstruction"
              })
            }), /*#__PURE__*/_jsx(Big, {
              use: "help",
              children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
                message: "edit.connectLinkedIn.secondaryInstruction_jsx",
                options: {
                  url: 'https://knowledge.hubspot.com/integrations/how-to-connect-hubspot-and-linkedin-sales-navigator',
                  external: true
                },
                elements: {
                  Link: KnowledgeBaseButton
                }
              })
            })]
          }), /*#__PURE__*/_jsx(UIPanelSection, {
            children: /*#__PURE__*/_jsx(UIAlert, {
              type: "tip",
              use: "inline",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "edit.connectLinkedIn.alert"
              })
            })
          }), /*#__PURE__*/_jsx(UIPanelSection, {
            children: /*#__PURE__*/_jsx(UIFlex, {
              direction: "column",
              align: "center",
              children: /*#__PURE__*/_jsx(UIIntegrationsConnectButton, {
                portalId: PortalIdParser.get(),
                appId: LINKED_IN_SALES_NAVIGATOR_APP_ID_PROD,
                sourceAppId: "sequences",
                use: "primary",
                text: I18n.text('edit.connectLinkedIn.connectButton'),
                onConnectionComplete: this.handleConnectionComplete,
                onConnectionFailed: this.handleConnectionFailed
              })
            })
          })]
        }), /*#__PURE__*/_jsx(UIPanelFooter, {
          children: /*#__PURE__*/_jsx(UIButton, {
            use: "secondary",
            onClick: closeModal,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "edit.insertCardPanel.footer.cancel"
            })
          })
        })]
      }));
    }
  }]);

  return ConnectLinkedIn;
}(Component);

ConnectLinkedIn.propTypes = {
  closeModal: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  panelKey: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  fetchLSNIntegration: PropTypes.func.isRequired
};
export default connect(null, {
  fetchLSNIntegration: fetchLSNIntegration
})(ConnectLinkedIn);