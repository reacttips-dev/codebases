'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { getProperty, getId } from 'customer-data-objects/model/ImmutableModel';
import links from 'crm-legacy-links/links';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import { canView } from '../../../utils/SubjectPermissions';
import UITile from 'UIComponents/tile/UITile';
import UITileSection from 'UIComponents/tile/UITileSection';
import UIMedia from 'UIComponents/layout/UIMedia';
import UIMediaLeft from 'UIComponents/layout/UIMediaLeft';
import UIMediaBody from 'UIComponents/layout/UIMediaBody';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
import PermissionTooltip from 'customer-data-objects-ui-components/permissions/PermissionTooltip';
import UIButton from 'UIComponents/button/UIButton';
import { COMPANY } from 'customer-data-objects/constants/ObjectTypes';
import { inIframe } from 'crm_schema/creator/ObjectEmbedMessage';

function getCompanyLink(isInIframe, companyId) {
  if (!isInIframe) {
    return links.company(companyId);
  } // base url for iframe does not include /contacts/ so it must be added manually here


  return "" + links.getRootPath() + links.company(companyId, false);
}

var MatchingCompanies = /*#__PURE__*/function (_PureComponent) {
  _inherits(MatchingCompanies, _PureComponent);

  function MatchingCompanies() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, MatchingCompanies);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MatchingCompanies)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleRenderMatchingCompany = function (match) {
      var domain = getProperty(match, 'domain');
      var name = getProperty(match, 'name') || domain;
      var companyId = getId(match);
      var canViewCompany = canView(match);
      var isInIframe = inIframe();
      return /*#__PURE__*/_jsx(UITile, {
        className: "tile-width m-x-auto m-top-4",
        compact: true,
        children: /*#__PURE__*/_jsx(UITileSection, {
          children: /*#__PURE__*/_jsxs(UIMedia, {
            align: "center",
            children: [/*#__PURE__*/_jsx(UIMediaLeft, {
              children: /*#__PURE__*/_jsx(UIAvatar, {
                domain: domain,
                companyId: companyId,
                type: COMPANY,
                size: "lg"
              })
            }), /*#__PURE__*/_jsxs(UIMediaBody, {
              children: [/*#__PURE__*/_jsx(PermissionTooltip, {
                disabled: canViewCompany,
                tooltipKey: "createCompanyModal",
                children: /*#__PURE__*/_jsx(UIButton, {
                  use: "link",
                  onClick: _this.props.onReject,
                  disabled: !canViewCompany,
                  href: canViewCompany ? getCompanyLink(isInIframe, companyId) : null,
                  external: isInIframe,
                  children: /*#__PURE__*/_jsx("strong", {
                    children: name
                  })
                })
              }), /*#__PURE__*/_jsx("div", {
                children: domain
              })]
            })]
          })
        })
      }, companyId);
    };

    return _this;
  }

  _createClass(MatchingCompanies, [{
    key: "render",
    value: function render() {
      var suggestions = this.props.suggestions;

      if (!suggestions || !suggestions.has('results') || !suggestions.get('results').size) {
        return null;
      }

      return /*#__PURE__*/_jsxs("div", {
        className: "m-y-4 p-x-3",
        "data-selenium-test": "matching-companies-card",
        children: [/*#__PURE__*/_jsx("div", {
          className: "text-center",
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "createCompanyModal.companyMatch"
          })
        }), suggestions.get('results').map(this.handleRenderMatchingCompany).toArray()]
      });
    }
  }]);

  return MatchingCompanies;
}(PureComponent);

export default MatchingCompanies;