'use es6';

import PropTypes from 'prop-types';
import { ACCESS_LEVELS } from '../constants/AccessLevels';
export var UserOptionType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string
});
export var TeamOptionType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  childTeams: PropTypes.array,
  parentTeamId: PropTypes.number,
  userIds: PropTypes.arrayOf(PropTypes.number),
  secondaryUserIds: PropTypes.arrayOf(PropTypes.number)
});
export var AccessLevelType = PropTypes.oneOf(Object.values(ACCESS_LEVELS));