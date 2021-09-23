'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import I18n from 'I18n';
import { openDocument } from '../zorse/zorseControls';
import UILink from 'UIComponents/link/UILink';
import PropTypes from 'prop-types';
var errorMap = {
  '400': {
    illustration: 'errors/general',
    actionLink: {
      label: 'errorPage.links.refresh',
      handler: function handler() {
        return window.location.reload();
      }
    }
  },
  '403': {
    illustration: 'keys',
    actionLink: {
      label: 'errorPage.links.learnMore',
      handler: function handler() {
        return openDocument('https://knowledge.hubspot.com/getting-started-with-hubspot-sales/an-overview-of-team-management#4-set-the-user-s-permissions');
      },
      external: true
    }
  },
  '404': {
    illustration: 'errors/map',
    actionLink: {
      label: 'errorPage.links.goBack',
      handler: function handler() {
        return window.history.go(-1);
      }
    }
  },
  '410': {
    illustration: 'errors/map',
    actionLink: {
      label: 'errorPage.links.goBack',
      handler: function handler() {
        return window.history.go(-1);
      }
    }
  },
  '500': {
    illustration: 'errors/general',
    actionLink: {
      label: 'errorPage.links.refresh',
      handler: function handler() {
        return window.location.reload();
      }
    }
  }
};

var ErrorPage = /*#__PURE__*/function (_PureComponent) {
  _inherits(ErrorPage, _PureComponent);

  function ErrorPage() {
    var _this;

    _classCallCheck(this, ErrorPage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ErrorPage).call(this)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.partial = memoize(partial);
    return _this;
  }

  _createClass(ErrorPage, [{
    key: "getActionLink",
    value: function getActionLink() {
      var actionLink = errorMap[this.props.errorCode].actionLink; // if no link is supplied, don't show a link

      if (!actionLink) {
        return null;
      }

      return /*#__PURE__*/_jsx(UILink, {
        className: "p-left-1",
        external: actionLink.external,
        onClick: actionLink.handler,
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: actionLink.label
        })
      });
    }
  }, {
    key: "getErrorTitle",
    value: function getErrorTitle(errorCode) {
      switch (errorCode) {
        case '400':
          return 'errorPage.400.title';

        case '403':
          return 'errorPage.403.title';

        case '404':
          return 'errorPage.404.title';

        case '410':
          return 'errorPage.410.title';

        case '500':
          return 'errorPage.500.title';

        default:
          return 'errorPage.generic.error';
      }
    }
  }, {
    key: "getErrorBody",
    value: function getErrorBody(errorCode) {
      switch (errorCode) {
        case '400':
          return 'errorPage.400.body';

        case '403':
          return 'errorPage.403.body';

        case '404':
          return 'errorPage.404.body';

        case '410':
          return 'errorPage.410.body';

        case '500':
          return 'errorPage.500.body';

        default:
          return null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          errorCode = _this$props.errorCode,
          RhumbMarker = _this$props.RhumbMarker;
      var errorTitle = this.getErrorTitle(errorCode);
      var errorBody = this.getErrorBody(errorCode);
      return /*#__PURE__*/_jsx(UIErrorMessage, {
        illustration: errorMap[errorCode].illustration,
        illustrationProps: {
          width: 200
        },
        title: I18n.text(errorTitle) // used for backwards-compatability with ErrorPageMixer
        ,
        className: "error-message",
        "data-error": errorCode,
        children: /*#__PURE__*/_jsxs("p", {
          children: [errorBody && /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            "data-selenium-test": "error-message",
            message: errorBody
          }), this.getActionLink(), RhumbMarker]
        })
      });
    }
  }]);

  return ErrorPage;
}(PureComponent);

export { ErrorPage as default };
ErrorPage.propTypes = {
  errorCode: PropTypes.oneOf(['400', '403', '404', '410', '500']).isRequired,
  RhumbMarker: PropTypes.node
};
ErrorPage.defaultProps = {
  errorCode: '404',
  RhumbMarker: null
};