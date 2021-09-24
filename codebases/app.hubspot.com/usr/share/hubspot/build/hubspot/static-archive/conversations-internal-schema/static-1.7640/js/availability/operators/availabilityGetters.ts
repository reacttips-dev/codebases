import get from 'transmute/get';
export var getAvailabilityStrategy = get('availabilityStrategy');
export var getAvailabilityStrategyConfig = get('availabilityStrategyConfig');
export var getInboxIsMissingAvailabilityConfig = function getInboxIsMissingAvailabilityConfig(inbox) {
  return !getAvailabilityStrategyConfig(inbox);
};
export var getOfficeHoursStartTime = get('officeHoursStartTime');
export var getTypicalResponseTime = get('typicalResponseTime');