import I18n from 'I18n';
import { List } from 'immutable';
import TimezoneGroups from '../lists/TimezoneGroups';
import TimezoneBlacklist from '../lists/TimezoneBlacklist';
import TimezoneGroup from '../records/TimezoneGroup';
import Timezone from '../records/Timezone';
import join from '../utils/join';
var MAX_CITIES_IN_GROUP_NAME = 4;
export default (function (timezoneAliases) {
  var currentMoment = I18n.moment().valueOf();
  var tzNames = I18n.moment.tz.names();
  var timezonesByZoneRegion = tzNames.filter(function (name) {
    return name.search(/GMT/g) < 0 && name.search(/Etc/g) < 0 && name.search(/\//g) > -1 && !TimezoneBlacklist.includes(name);
  }).reduce(function (byZoneRegion, name) {
    var zoneRegion = name.split('/')[0];
    if (!byZoneRegion[zoneRegion]) byZoneRegion[zoneRegion] = [];
    byZoneRegion[zoneRegion].push(name);
    return byZoneRegion;
  }, {});
  var timezoneGroups = Object.keys(timezonesByZoneRegion).map(function (zoneRegion) {
    var timezonesForZoneRegion = timezonesByZoneRegion[zoneRegion];
    var sortedTimezones = timezonesForZoneRegion.reduce(function (byMatchingZoneType, timezoneName) {
      var momentTimezone = I18n.moment.tz.zone(timezoneName);

      if (!momentTimezone) {
        return byMatchingZoneType;
      }

      var futureUntils = momentTimezone.untils.filter(function (until) {
        return until > currentMoment;
      });
      var futureOffsets = momentTimezone.offsets.slice(-futureUntils.length);
      var key = futureUntils.concat(futureOffsets).join('');
      if (!byMatchingZoneType[key]) byMatchingZoneType[key] = [];
      byMatchingZoneType[key].push(timezoneName);
      return byMatchingZoneType;
    }, {});
    var timezones = Object.values(sortedTimezones).map(function (momentTimezones) {
      var aliasWithTimezoneInGroup = function aliasWithTimezoneInGroup(alias) {
        return alias.timezones.some(function (timezone) {
          return momentTimezones.indexOf(timezone) !== -1;
        });
      };

      var alias = timezoneAliases.find(aliasWithTimezoneInGroup);
      var offset = I18n.moment.tz(momentTimezones[0]).format('Z');

      if (alias) {
        return new Timezone({
          offset: offset,
          momentTimezones: List(momentTimezones),
          name: alias.name
        });
      }

      var cityNames = momentTimezones.map(function (timezone) {
        var cityName = timezone.split('/').pop();

        if (!cityName) {
          return '';
        }

        return cityName.toLowerCase();
      });
      var translatedCityNames = cityNames.map(function (name) {
        return I18n.text("timezone_utils.cities." + name);
      });
      var name = join(translatedCityNames.slice(0, MAX_CITIES_IN_GROUP_NAME));
      return new Timezone({
        offset: offset,
        momentTimezones: List(momentTimezones),
        name: name
      });
    });
    return new TimezoneGroup({
      groupName: I18n.text("timezone_utils.regions." + zoneRegion.toLowerCase()),
      timezones: List(timezones)
    });
  });
  return new TimezoneGroups(timezoneGroups);
});