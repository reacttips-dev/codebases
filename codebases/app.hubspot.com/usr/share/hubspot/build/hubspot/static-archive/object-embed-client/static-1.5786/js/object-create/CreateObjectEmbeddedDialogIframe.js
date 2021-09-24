'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import Raven from 'Raven';
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { TYPE, getIframeUrl, toMessage } from 'crm_schema/creator/ObjectEmbedMessage';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import DealRecord from 'customer-data-objects/deal/DealRecord';
import TicketRecord from 'customer-data-objects/ticket/TicketRecord';
import { UpgradeEventListener } from './UpgradeEventListener';
import UIModalIFrame from 'ui-addon-iframeable/host/UIModalIFrame';
import emptyFunction from 'react-utils/emptyFunction';
import devLogger from 'react-utils/devLogger';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import I18n from 'I18n';
import { addError } from 'customer-data-ui-utilities/alerts/Alerts';
import { setFrom } from 'crm_data/settings/LocalSettings';
import { markActionComplete } from 'user-context/onboarding';
import PortalIdParser from 'PortalIdParser';
import { getId } from 'customer-data-objects/model/ImmutableModel';
import { addRecordAssociationErrorAlert } from 'customer-data-objects-ui-components/associations/associationErrorAlerts';
var CREATE_PANEL_MESSAGE_TYPE = TYPE.create;
var WIDTH = 600;

var navigate = function navigate(url) {
  return window.location.href = url;
};

var propTypes = {
  defaultProperties: PropTypes.object.isRequired,
  navigate: PropTypes.func,
  objectType: PropTypes.oneOf([CONTACT, COMPANY, DEAL, TICKET]).isRequired,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  onError: PropTypes.func,
  open: PropTypes.bool,
  preload: PropTypes.bool,
  redirectToRecord: PropTypes.bool,
  shouldDefaultOwnerId: PropTypes.bool,
  sourceApp: PropTypes.string.isRequired,
  use: PropTypes.oneOf(['sidebar', 'panel']),
  via: PropTypes.string
};
var defaultProps = {
  defaultProperties: {},
  onCancel: emptyFunction,
  onCreate: emptyFunction,
  onError: emptyFunction,
  open: false,
  preload: false,
  redirectToRecord: false,
  shouldDefaultOwnerId: true,
  use: 'panel',
  via: null,
  navigate: navigate
};

var getRedirectUrl = function getRedirectUrl(objectType, objectId) {
  var _rootUrl;

  var rootUrl = (_rootUrl = {}, _defineProperty(_rootUrl, CONTACT, 'contact'), _defineProperty(_rootUrl, COMPANY, 'company'), _defineProperty(_rootUrl, DEAL, 'deal'), _defineProperty(_rootUrl, TICKET, 'ticket'), _rootUrl);
  return "/contacts/" + PortalIdParser.get() + "/" + rootUrl[objectType] + "/" + objectId;
};

var CreateObjectEmbeddedDialogIframe = /*#__PURE__*/function (_PureComponent) {
  _inherits(CreateObjectEmbeddedDialogIframe, _PureComponent);

  function CreateObjectEmbeddedDialogIframe(props) {
    var _this;

    _classCallCheck(this, CreateObjectEmbeddedDialogIframe);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CreateObjectEmbeddedDialogIframe).call(this, props));

    _this.createMessage = function () {
      var _this$props = _this.props,
          objectType = _this$props.objectType,
          defaultProperties = _this$props.defaultProperties,
          shouldDefaultOwnerId = _this$props.shouldDefaultOwnerId,
          sourceApp = _this$props.sourceApp,
          via = _this$props.via;
      return toMessage({
        association: {},
        objectType: objectType,
        properties: defaultProperties,
        shouldDefaultOwnerId: shouldDefaultOwnerId,
        sourceApp: sourceApp,
        via: via
      }, 'create');
    };

    _this.state = {
      iframeReady: false,
      iframeInitError: false,
      hostContext: null
    };
    _this.onIframeMessage = _this.onIframeMessage.bind(_assertThisInitialized(_this));
    _this.handleIframeReady = _this.handleIframeReady.bind(_assertThisInitialized(_this));
    _this.handleIframeInitError = _this.handleIframeInitError.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(CreateObjectEmbeddedDialogIframe, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.props.open && this.state.iframeInitError) {
        FloatingAlertStore.addAlert({
          message: I18n.text('object-embed-client.iframe.error.body'),
          titleText: I18n.text('object-embed-client.iframe.error.title'),
          type: 'danger'
        });
        this.props.onError();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false;
    }
  }, {
    key: "logError",
    value: function logError(err) {
      var objectType = this.props.objectType;
      devLogger.warn({
        message: "create/perf iframe init error: " + err,
        key: 'iframeInit'
      });
      Raven.captureMessage("Create/Perf Iframe: init error", {
        extra: {
          error: err,
          objectType: objectType
        }
      });

      if (window.newrelic && window.newrelic.addPageAction) {
        window.newrelic.addPageAction('iframe-error', {
          error: err,
          objectType: objectType,
          type: 'create/perf'
        });
      }
    }
  }, {
    key: "handleReadyError",
    value: function handleReadyError(err) {
      this.logError(err);
    }
  }, {
    key: "handleIframeReady",
    value: function handleIframeReady(hostContext) {
      this.setState({
        iframeReady: true,
        hostContext: hostContext
      });
      hostContext.sendMessage('create', this.createMessage());
    }
  }, {
    key: "handleIframeInitError",
    value: function handleIframeInitError(err) {
      this.setState({
        iframeInitError: true,
        hostContext: null
      });
      this.logError(err);
    }
  }, {
    key: "handleOnCreate",
    value: function handleOnCreate(_ref) {
      var object = _ref.object,
          createAnother = _ref.createAnother;
      var record;

      switch (this.props.objectType) {
        case CONTACT:
          record = ContactRecord.fromJS(object);
          break;

        case COMPANY:
          record = CompanyRecord.fromJS(object);
          break;

        case DEAL:
          record = DealRecord.fromJS(object);
          break;

        case TICKET:
          record = TicketRecord.fromJS(object);
          break;

        default:
          this.props.onError({
            error: 'UNSUPPORTED_CREATE_TYPE'
          });
          return null;
      }

      var objectId = getId(record);
      this.props.onCreate({
        object: record,
        objectId: objectId,
        createAnother: createAnother,
        objectType: this.props.objectType
      });
      return record;
    }
  }, {
    key: "onIframeMessage",
    value: function onIframeMessage(_ref2) {
      var payload = _ref2.payload;

      if (payload.type !== CREATE_PANEL_MESSAGE_TYPE) {
        return;
      }

      if (payload.alerts !== undefined) {
        payload.alerts.map(function (alert) {
          return FloatingAlertStore.addAlert(Object.assign({}, alert));
        });
        return;
      }

      if (payload.errorJSON) {
        addRecordAssociationErrorAlert({
          errorJSON: payload.errorJSON
        });
      }

      if (payload.close) {
        this.props.onCancel();
        return;
      }

      if (payload.error && !payload.object) {
        if (payload.error.message === 'saveLineItemsError') {
          addError('createDealModal.lineItemsField.saveLineItemsError', {}, {
            timeout: 6000
          });
        }

        this.props.onError(payload.error);
        return;
      } // We return the record for convenience. These could be handled further down the tree.


      var object = this.handleOnCreate(payload); // This sets the 'create-first-contact' onboarding step as complete. We dedupe on our side.
      // Chat to #growth-onboarding with questions.

      if (object instanceof ContactRecord) {
        markActionComplete('create-first-contact');
      }

      if (payload.isFirstContact === true) {
        setFrom(localStorage, CONTACT + ":isFirstContact", true);
      }

      if (this.props.redirectToRecord && !payload.createAnother) {
        this.props.navigate(getRedirectUrl(this.props.objectType, getId(object)));
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(UpgradeEventListener, {}), /*#__PURE__*/_jsx(UIModalIFrame, {
          preload: this.props.preload,
          height: "100%",
          use: this.props.use,
          width: WIDTH,
          src: getIframeUrl('create/perf'),
          onMessage: this.onIframeMessage,
          appName: this.props.sourceApp,
          show: this.props.open && !this.state.iframeInitError,
          iframePassthruProps: {
            'data-iframe-ready': this.state.iframeReady,
            'data-host-create-panel-type': this.props.objectType,
            'data-selenium-info-show': this.props.open,
            'data-selenium-test': 'object-creator-dialog'
          },
          onReady: this.handleIframeReady,
          onReadyError: this.handleReadyError,
          onInitError: this.handleIframeInitError,
          initTimeout: 15000,
          readyTimeout: 15000
          /*
           * onClose is not needed as the close message is sent from the panel header (since it's rendered outside of the iframe)
           * into the iframe'd component that component then calls its onReject callback which is handled in handleAsCreatorssage
           */
          ,
          onClose: emptyFunction
        })]
      });
    }
  }]);

  return CreateObjectEmbeddedDialogIframe;
}(PureComponent);

CreateObjectEmbeddedDialogIframe.propTypes = propTypes;
CreateObjectEmbeddedDialogIframe.defaultProps = defaultProps;
export default CreateObjectEmbeddedDialogIframe;