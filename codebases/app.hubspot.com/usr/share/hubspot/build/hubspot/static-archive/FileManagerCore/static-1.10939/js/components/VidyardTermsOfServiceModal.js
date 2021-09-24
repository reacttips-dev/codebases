'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { staticDomainPrefix } from 'hubspot.bender';
import PortalIdParser from 'PortalIdParser';
import { VidyardTosStatus, UserInferredRoles, MODAL_WIDTH } from '../Constants';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UICloseButton from 'UIComponents/button/UICloseButton';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UILink from 'UIComponents/link/UILink';
import UIList from 'UIComponents/list/UIList';
import UIImage from 'UIComponents/image/UIImage';
import UIIcon from 'UIComponents/icon/UIIcon';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIMediaRight from 'UIComponents/layout/UIMediaRight';
import UIMedia from 'UIComponents/layout/UIMedia';
import UIMediaBody from 'UIComponents/layout/UIMediaBody';
import H2 from 'UIComponents/elements/headings/H2';

function getI18nKey(suffix) {
  return "FileManagerCore.video.termsOfServiceModal." + suffix;
}

function getI18nBodyKey(suffix) {
  return getI18nKey('body') + "." + suffix;
}

var salesItemsI18nKeys = ['sales.item1', 'sales.item2', 'sales.item3'];
var marketingItemsI18nKeys = ['marketing.item1', 'marketing.item2', 'marketing.item3', 'marketing.item4'];

var VidyardTermsOfServiceModal = /*#__PURE__*/function (_Component) {
  _inherits(VidyardTermsOfServiceModal, _Component);

  function VidyardTermsOfServiceModal(props) {
    var _this;

    _classCallCheck(this, VidyardTermsOfServiceModal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VidyardTermsOfServiceModal).call(this, props));
    _this.state = {
      hideIntegrationChecked: false,
      termsOfServiceStatus: null
    };
    _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
    _this.handleConfirm = _this.handleConfirm.bind(_assertThisInitialized(_this));
    _this.handleHideModal = _this.handleHideModal.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(VidyardTermsOfServiceModal, [{
    key: "handleHideModal",
    value: function handleHideModal(_ref) {
      var checked = _ref.target.checked;
      this.setState({
        hideIntegrationChecked: checked
      });
    }
  }, {
    key: "handleCancel",
    value: function handleCancel() {
      var _this$props = this.props,
          trackInteraction = _this$props.trackInteraction,
          updateVidyardTosStatus = _this$props.updateVidyardTosStatus,
          onClose = _this$props.onClose;
      var hideIntegrationChecked = this.state.hideIntegrationChecked;
      trackInteraction(false);

      if (hideIntegrationChecked) {
        this.setState({
          termsOfServiceStatus: VidyardTosStatus.HIDDEN
        });
        updateVidyardTosStatus(VidyardTosStatus.HIDDEN);
      } else {
        onClose();
      }
    }
  }, {
    key: "handleConfirm",
    value: function handleConfirm() {
      var _this$props2 = this.props,
          trackInteraction = _this$props2.trackInteraction,
          updateVidyardTosStatus = _this$props2.updateVidyardTosStatus;
      this.setState({
        termsOfServiceStatus: VidyardTosStatus.ACCEPTED
      });
      trackInteraction(true);
      updateVidyardTosStatus(VidyardTosStatus.ACCEPTED);
    }
  }, {
    key: "getIsSalesUser",
    value: function getIsSalesUser(inferredUserRole) {
      return inferredUserRole === UserInferredRoles.get('CRM') || inferredUserRole === UserInferredRoles.get('CRM_AND_SALES');
    }
  }, {
    key: "renderHeader",
    value: function renderHeader() {
      return /*#__PURE__*/_jsxs("div", {
        className: "m-y-6 text-center",
        children: [/*#__PURE__*/_jsx(UIImage, {
          className: "m-right-5",
          responsive: false,
          src: staticDomainPrefix + "/salesImages/static-1.423/logos/hubspot-standard.png",
          width: "150"
        }), /*#__PURE__*/_jsx(UIIcon, {
          name: "add"
        }), /*#__PURE__*/_jsx(UIImage, {
          className: "m-left-1",
          responsive: false,
          src: staticDomainPrefix + "/FileManagerImages/static-1.8582/images/vidyardLogo.png",
          width: "200"
        })]
      });
    }
  }, {
    key: "renderBulletList",
    value: function renderBulletList(itemsI18nKeys) {
      return /*#__PURE__*/_jsx(UIList, {
        styled: true,
        childClassName: "m-bottom-3 m-top-3",
        children: itemsI18nKeys.map(function (bullet) {
          return /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nBodyKey("part2." + bullet)
          }, bullet);
        })
      });
    }
  }, {
    key: "renderIntegrationsPageMessage",
    value: function renderIntegrationsPageMessage() {
      return /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: getI18nBodyKey('part5'),
        options: {
          integrationsPageLink: /*#__PURE__*/_jsx(UILink, {
            href: "/integrations-settings/" + PortalIdParser.get() + "/installed/vidyard",
            external: true,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: getI18nKey('integrationsPage')
            })
          })
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          onClose = _this$props3.onClose,
          isLoading = _this$props3.isLoading,
          inferredUserRole = _this$props3.inferredUserRole;
      var _this$state = this.state,
          hideIntegrationChecked = _this$state.hideIntegrationChecked,
          termsOfServiceStatus = _this$state.termsOfServiceStatus;
      return /*#__PURE__*/_jsxs(UIModal, {
        width: MODAL_WIDTH,
        children: [/*#__PURE__*/_jsx(UICloseButton, {
          onClick: onClose,
          "data-test-id": "close-video-modal"
        }), /*#__PURE__*/_jsx(UIDialogHeader, {
          children: /*#__PURE__*/_jsx(H2, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: getI18nKey('title')
            })
          })
        }), /*#__PURE__*/_jsxs(UIDialogBody, {
          children: [this.renderHeader(), /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nBodyKey('part1')
          }), this.getIsSalesUser(inferredUserRole) ? this.renderBulletList(salesItemsI18nKeys) : this.renderBulletList(marketingItemsI18nKeys), /*#__PURE__*/_jsx("div", {
            className: "m-all-1",
            children: /*#__PURE__*/_jsx(FormattedReactMessage, {
              message: getI18nBodyKey('part3'),
              options: {
                eulaLink: /*#__PURE__*/_jsx(UILink, {
                  href: "https://www.vidyard.com/eula-hubspot/",
                  external: true,
                  children: /*#__PURE__*/_jsx(FormattedMessage, {
                    message: getI18nKey('eula')
                  })
                })
              }
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "m-all-1",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: getI18nBodyKey('part4')
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "m-all-1",
            children: this.renderIntegrationsPageMessage()
          })]
        }), /*#__PURE__*/_jsx(UIDialogFooter, {
          className: "p-bottom-9",
          children: /*#__PURE__*/_jsxs(UIMedia, {
            children: [/*#__PURE__*/_jsxs(UIMediaBody, {
              children: [/*#__PURE__*/_jsx(UILoadingButton, {
                loading: termsOfServiceStatus === VidyardTosStatus.ACCEPTED ? isLoading : false,
                disabled: termsOfServiceStatus !== VidyardTosStatus.ACCEPTED && isLoading,
                use: "primary",
                onClick: this.handleConfirm,
                "data-test-id": "video-accept-tos",
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: getI18nKey('confirm')
                })
              }), /*#__PURE__*/_jsx(UILoadingButton, {
                loading: termsOfServiceStatus !== VidyardTosStatus.ACCEPTED ? isLoading : false,
                onClick: this.handleCancel,
                disabled: termsOfServiceStatus === VidyardTosStatus.ACCEPTED && isLoading,
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: getI18nKey('decline')
                })
              })]
            }), /*#__PURE__*/_jsx(UIMediaRight, {
              children: /*#__PURE__*/_jsx(UICheckbox, {
                size: "small",
                checked: hideIntegrationChecked,
                onChange: this.handleHideModal,
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: getI18nKey('dontShowMeAgain')
                })
              })
            })]
          })
        })]
      });
    }
  }]);

  return VidyardTermsOfServiceModal;
}(Component);

export { VidyardTermsOfServiceModal as default };
VidyardTermsOfServiceModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  updateVidyardTosStatus: PropTypes.func.isRequired,
  inferredUserRole: PropTypes.string.isRequired,
  trackInteraction: PropTypes.func.isRequired
};