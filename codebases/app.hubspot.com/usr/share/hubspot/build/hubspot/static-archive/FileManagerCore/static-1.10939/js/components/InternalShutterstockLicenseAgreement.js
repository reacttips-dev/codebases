'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Component } from 'react';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIButton from 'UIComponents/button/UIButton';
import UICloseButton from 'UIComponents/button/UICloseButton';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UILink from 'UIComponents/link/UILink';
import H2 from 'UIComponents/elements/headings/H2';
import * as portalMetaActions from '../actions/PortalMeta';
import { getFileManagerPortalDataUpdateRequestStatus } from '../selectors/PortalMeta';
import { RequestStatus } from '../Constants';

function getI18nKey(suffix) {
  return "FileManagerCore.shutterstock." + suffix;
}

var InternalShutterstockLicenseAgreement = /*#__PURE__*/function (_Component) {
  _inherits(InternalShutterstockLicenseAgreement, _Component);

  function InternalShutterstockLicenseAgreement() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, InternalShutterstockLicenseAgreement);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(InternalShutterstockLicenseAgreement)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleConfirm = function () {
      var _this$props = _this.props,
          onAgreeCallback = _this$props.onAgreeCallback,
          acceptShutterstockTos = _this$props.acceptShutterstockTos;

      if (onAgreeCallback) {
        var tosAgreementPromise = new Promise(function (resolve) {
          acceptShutterstockTos();
          resolve();
        });
        tosAgreementPromise.then(onAgreeCallback);
      } else {
        acceptShutterstockTos();
      }
    };

    return _this;
  }

  _createClass(InternalShutterstockLicenseAgreement, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          onClose = _this$props2.onClose,
          onCancel = _this$props2.onCancel,
          updateTosRequestStatus = _this$props2.updateTosRequestStatus;
      var isRequestPending = updateTosRequestStatus === RequestStatus.PENDING;
      return /*#__PURE__*/_jsxs(UIModal, {
        width: 498,
        children: [/*#__PURE__*/_jsx(UICloseButton, {
          className: "shutterstock-preview-modal__close-button",
          onClick: onClose,
          disabled: isRequestPending
        }), /*#__PURE__*/_jsx(UIDialogHeader, {
          children: /*#__PURE__*/_jsx(H2, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: getI18nKey('license.header')
            })
          })
        }), /*#__PURE__*/_jsx(UIDialogBody, {
          children: /*#__PURE__*/_jsx("p", {
            children: /*#__PURE__*/_jsx(FormattedReactMessage, {
              message: getI18nKey('license.termsOfUse'),
              options: {
                websiteTermsLink: /*#__PURE__*/_jsx(UILink, {
                  href: "https://www.shutterstock.com/terms",
                  external: true,
                  children: /*#__PURE__*/_jsx(FormattedMessage, {
                    message: getI18nKey('websiteTerms')
                  })
                }),
                privacyPolicyLink: /*#__PURE__*/_jsx(UILink, {
                  href: "https://www.shutterstock.com/privacy",
                  external: true,
                  children: /*#__PURE__*/_jsx(FormattedMessage, {
                    message: getI18nKey('privacyPolicy')
                  })
                }),
                licensingTermsLink: /*#__PURE__*/_jsx(UILink, {
                  href: "https://www.shutterstock.com/license",
                  external: true,
                  children: /*#__PURE__*/_jsx(FormattedMessage, {
                    message: getI18nKey('licensingTerms')
                  })
                })
              }
            })
          })
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(UILoadingButton, {
            use: "primary",
            onClick: this.handleConfirm,
            "data-test-id": "shutterstock-tos-accept-button",
            loading: isRequestPending,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: getI18nKey('license.acceptButton')
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            onClick: onCancel,
            disabled: isRequestPending,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "FileManagerCore.actions.cancel"
            })
          })]
        })]
      });
    }
  }]);

  return InternalShutterstockLicenseAgreement;
}(Component);

var reduxPropTypes = {
  acceptShutterstockTos: PropTypes.func.isRequired,
  updateTosRequestStatus: PropTypes.oneOf(Object.keys(RequestStatus))
};
InternalShutterstockLicenseAgreement.propTypes = Object.assign({
  onCancel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onAgreeCallback: PropTypes.func
}, reduxPropTypes);
var mapDispatchToProps = {
  acceptShutterstockTos: portalMetaActions.acceptShutterstockTos
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    updateTosRequestStatus: getFileManagerPortalDataUpdateRequestStatus(state)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InternalShutterstockLicenseAgreement);