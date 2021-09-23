'use es6';

import PropTypes from 'prop-types';
import RecordPropType from './RecordPropType';
export default PropTypes.oneOfType([RecordPropType('CompanyChatHeadingConfig'), RecordPropType('OwnerChatHeadingConfig'), RecordPropType('UsersAndTeamsChatHeadingConfig')]);