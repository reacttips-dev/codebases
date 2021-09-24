'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import EmailConfirmBar from '../views/EmailConfirmBar';
import VerificationEmailResentMessage from '../views/VerificationEmailResentMessage';
import VerificationEmailResendError from '../views/VerificationEmailResendError';
import { HUBSPOT_EMAIL_CONFIRM_BAR_ID, EMAIL_CONFIRM_ACTIONS_ID, RESEND_VERIFICATION_EMAIL_BUTTON_ID } from '../constants/DOMSelectors';
import NavSibling from 'nav-helpers/NavSibling';
import NavInjector from 'nav-helpers/NavInjector';
import AlertStyleInjector from 'nav-helpers/AlertStyleInjector';

function createNavSibling(email) {
  var confirmBar = document.createElement('div');
  confirmBar.id = HUBSPOT_EMAIL_CONFIRM_BAR_ID;
  confirmBar.innerHTML = EmailConfirmBar(email);
  return new NavSibling({
    key: HUBSPOT_EMAIL_CONFIRM_BAR_ID,
    element: confirmBar,
    isPriority: true
  });
}

var BaseEmailConfirmBarLoader = /*#__PURE__*/function () {
  function BaseEmailConfirmBarLoader() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, BaseEmailConfirmBarLoader);

    this.email = '';
    this.userId = null;
    this.isVerified = null;
    this.isVisible = false;
    this.hasResent = false;

    if (this.getRequiredData && typeof this.getRequiredData === 'function') {
      this.getRequiredData().then(this.initialize.bind(this)).done();
    } else if (opts && opts.hasOwnProperty('email') && opts.hasOwnProperty('isVerified')) {
      this.initialize(opts);
    }
  }

  _createClass(BaseEmailConfirmBarLoader, [{
    key: "initialize",
    value: function initialize(_ref) {
      var email = _ref.email,
          isVerified = _ref.isVerified,
          userId = _ref.userId;
      this.setEmail(email);
      this.setUserId(userId);
      this.setIsVerified(isVerified);

      if (this.email && this.isVerified === false) {
        this.render();
      }
    }
  }, {
    key: "resendVerificationEmail",
    value: function resendVerificationEmail() {
      // Prevents duplicate requests from clicking the
      // resend link before the request resolves.
      if (this.hasResent) {
        return Promise.resolve();
      }

      this.hasResent = true;
      return this.handleResend(this.userId);
    }
  }, {
    key: "handleResend",
    value: function handleResend() {
      throw new Error('IMPLEMENT handleResend');
    }
  }, {
    key: "bindEventListeners",
    value: function bindEventListeners() {
      var _this = this;

      var actionsContainer = document.getElementById(EMAIL_CONFIRM_ACTIONS_ID);
      var resendButton = document.getElementById(RESEND_VERIFICATION_EMAIL_BUTTON_ID);

      var setEmailSentMessage = function setEmailSentMessage() {
        if (actionsContainer) {
          actionsContainer.innerHTML = VerificationEmailResentMessage();
        }
      };

      var setEmailSentErrorMessage = function setEmailSentErrorMessage() {
        if (actionsContainer) {
          actionsContainer.innerHTML = VerificationEmailResendError();
        }
      };

      if (resendButton) {
        resendButton.addEventListener('click', function () {
          _this.resendVerificationEmail().then(setEmailSentMessage, setEmailSentErrorMessage).catch(setEmailSentErrorMessage).done();
        });
      }
    }
  }, {
    key: "setEmail",
    value: function setEmail(email) {
      this.email = email;
    }
  }, {
    key: "setUserId",
    value: function setUserId(userId) {
      this.userId = userId;
    }
  }, {
    key: "setIsVerified",
    value: function setIsVerified(isVerified) {
      this.isVerified = isVerified;

      if (isVerified && this.isVisible) {
        this.remove();
      }
    }
  }, {
    key: "setIsVisible",
    value: function setIsVisible(isVisible) {
      this.isVisible = isVisible;
    }
  }, {
    key: "render",
    value: function render() {
      if (this.isVisible) return;
      AlertStyleInjector.inject();
      var confirmBar = createNavSibling(this.email);
      NavInjector.insertBefore(confirmBar);
      this.bindEventListeners();
      this.setIsVisible(true);
    }
  }, {
    key: "remove",
    value: function remove() {
      NavInjector.remove(HUBSPOT_EMAIL_CONFIRM_BAR_ID);
      this.setIsVisible(false);
    }
  }]);

  return BaseEmailConfirmBarLoader;
}();

export default BaseEmailConfirmBarLoader;