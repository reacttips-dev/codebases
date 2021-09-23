'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { SHARING } from 'customer-data-objects/view/ViewTypes';
import { connect } from 'general-store';
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { Fragment, PureComponent } from 'react';
import ScopesContainer from '../../../containers/ScopesContainer';
import TeamsStore from 'crm_data/teams/TeamsStore';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import UISelect from 'UIComponents/input/UISelect';
import UIToggleGroup from 'UIComponents/input/UIToggleGroup';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UserStore from 'crm_data/user/UserStore';
import indexBy from 'transmute/indexBy';
import get from 'transmute/get';
import unescapedText from 'I18n/utils/unescapedText';
import getIn from 'transmute/getIn';
import translate from 'transmute/translate';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { isScoped } from '../../../containers/ScopeOperators';

var ViewSharingOptionsField = /*#__PURE__*/function (_PureComponent) {
  _inherits(ViewSharingOptionsField, _PureComponent);

  function ViewSharingOptionsField(props) {
    var _this;

    _classCallCheck(this, ViewSharingOptionsField);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ViewSharingOptionsField).call(this, props));
    _this.state = {
      initialValue: Number(props.value)
    };
    return _this;
  }

  _createClass(ViewSharingOptionsField, [{
    key: "getOptionsArrayFromTeamMap",
    value: function getOptionsArrayFromTeamMap(userTeams) {
      return userTeams.valueSeq().map(translate({
        text: 'name',
        value: 'id'
      })).toJS();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          userTeams = _this$props.userTeams,
          teams = _this$props.teams,
          onChange = _this$props.onChange,
          value = _this$props.value;
      var initialValue = this.state.initialValue;
      var isValueTeamShare = ![SHARING.PUBLIC, SHARING.PRIVATE].includes(value);
      var isPublicShareDisabled = isScoped(ScopesContainer.get(), 'bet-views-public-share-restricted') && !isScoped(ScopesContainer.get(), 'bet-views-public-share');
      var options = initialValue && !userTeams.has(initialValue) ? this.getOptionsArrayFromTeamMap(userTeams).concat({
        help: unescapedText('filterSidebar.userNotOnThisTeam'),
        text: getIn(["" + initialValue, 'name'], teams),
        value: initialValue
      }) : this.getOptionsArrayFromTeamMap(userTeams);
      var selectedOption = isValueTeamShare ? value : getIn([0, 'value'], options);
      return /*#__PURE__*/_jsx(UIFormControl, {
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "filterSidebar.viewVisibility"
        }),
        required: true,
        children: /*#__PURE__*/_jsxs(UIToggleGroup, {
          name: "sharing-options",
          children: [/*#__PURE__*/_jsx(UIRadioInput, {
            checked: value === SHARING.PRIVATE,
            name: SHARING.PRIVATE,
            onChange: onChange,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "filterSidebar.shareViewPrivate"
            })
          }), /*#__PURE__*/_jsxs(Fragment, {
            children: [/*#__PURE__*/_jsx(UITooltip, {
              disabled: options.length > 0,
              placement: "left",
              title: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "filterSidebar.userHasNoTeams"
              }),
              children: /*#__PURE__*/_jsx(UIRadioInput, {
                checked: isValueTeamShare,
                disabled: options.length === 0,
                name: SHARING.TEAM,
                onChange: onChange,
                value: selectedOption,
                children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
                  message: options.length === 1 ? 'filterSidebar.shareViewOneTeam' : 'filterSidebar.shareViewTeam',
                  options: {
                    name: getIn([0, 'text'], options) || ''
                  }
                })
              })
            }), options.length > 1 && /*#__PURE__*/_jsx(UISelect, {
              disabled: !isValueTeamShare,
              minimumSearchCount: 0,
              onChange: onChange,
              options: options,
              value: selectedOption
            })]
          }), /*#__PURE__*/_jsx(UITooltip, {
            disabled: !isPublicShareDisabled,
            title: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "filterSidebar.shareViewEveryoneDisabledTooltip"
            }),
            children: /*#__PURE__*/_jsx(UIRadioInput, {
              checked: value === SHARING.PUBLIC,
              disabled: isPublicShareDisabled,
              name: SHARING.PUBLIC,
              onChange: onChange,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "filterSidebar.shareViewEveryone"
              })
            })
          })]
        })
      });
    }
  }]);

  return ViewSharingOptionsField;
}(PureComponent);

ViewSharingOptionsField.propTypes = {
  onChange: PropTypes.func.isRequired,
  teams: ImmutablePropTypes.mapOf(ImmutablePropTypes.contains({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired),
  userTeams: ImmutablePropTypes.mapOf(ImmutablePropTypes.contains({
    id: PropTypes.number.isRequired,
    my_team: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    teammates: ImmutablePropTypes.listOf(PropTypes.number).isRequired
  })),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([SHARING.PRIVATE, SHARING.PUBLIC])]).isRequired
};
var deps = {
  teams: TeamsStore,
  userTeams: {
    stores: [UserStore],
    deref: function deref() {
      var userTeamsArr = UserStore.get('teams') || List();
      return ImmutableMap(indexBy(get('id'), fromJS(userTeamsArr)));
    }
  }
};
export default connect(deps)(ViewSharingOptionsField);