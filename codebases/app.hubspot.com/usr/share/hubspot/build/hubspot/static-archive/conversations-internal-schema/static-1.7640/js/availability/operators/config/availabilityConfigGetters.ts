import getIn from 'transmute/getIn';
import { AWAY_IN_OFFCE_HOURS_STRATEGY, AWAY_MESSAGE, OFFICE_HOURS, OUTSIDE_OFFICE_HOURS_MESSAGE, OUTSIDE_OFFICE_HOURS_STRATEGY, TEAM_MEMBERS_AVAILABILITY_STRATEGY, TYPICAL_RESPONSE_TIME } from '../../constants/keyPaths'; // FIXME make getIn type match immutable's

export var getAwayInOfficeHoursStrategy = getIn(AWAY_IN_OFFCE_HOURS_STRATEGY);
export var getAwayMessage = function getAwayMessage(config) {
  return getIn(AWAY_MESSAGE, config) || '';
};
export var getOfficeHours = getIn(OFFICE_HOURS);
export var getOutsideOfficeHoursMessage = function getOutsideOfficeHoursMessage(config) {
  return getIn(OUTSIDE_OFFICE_HOURS_MESSAGE, config) || '';
};
export var getOutsideOfficeHoursStrategy = getIn(OUTSIDE_OFFICE_HOURS_STRATEGY);
export var getTeamMembersAvailabilityStrategy = getIn(TEAM_MEMBERS_AVAILABILITY_STRATEGY);
export var getTypicalResponseTime = getIn(TYPICAL_RESPONSE_TIME);