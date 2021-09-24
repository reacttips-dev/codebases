import once from './once';
import computeTimezoneGroups from '../helpers/computeTimezoneGroups';
import TimezoneAliases from '../lists/TimezoneAliases';
export default once(function () {
  var timezoneAliases = TimezoneAliases();
  return computeTimezoneGroups(timezoneAliases);
});