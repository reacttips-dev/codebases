import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, List, fromJS } from 'immutable';
import { USERS_AND_TEAMS } from '../constants/ChatHeadingConfigTypes';

var UsersAndTeamsChatHeadingConfig = /*#__PURE__*/function (_Record) {
  _inherits(UsersAndTeamsChatHeadingConfig, _Record);

  function UsersAndTeamsChatHeadingConfig() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, UsersAndTeamsChatHeadingConfig);

    return _possibleConstructorReturn(this, _getPrototypeOf(UsersAndTeamsChatHeadingConfig).call(this, fromJS(options)));
  }

  return UsersAndTeamsChatHeadingConfig;
}(Record({
  '@type': USERS_AND_TEAMS,
  userIds: List(),
  teamIds: List()
}, 'UsersAndTeamsChatHeadingConfig'));

export default UsersAndTeamsChatHeadingConfig;