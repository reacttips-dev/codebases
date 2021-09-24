import I18n from 'I18n';
export default (function (_ref) {
  var groups = _ref.groups;
  return groups.map(function (tzg) {
    return {
      text: tzg.groupName,
      value: tzg.groupName,
      options: tzg.timezones.sort(function (x, y) {
        return parseInt(x.offset, 10) - parseInt(y.offset, 10);
      }).map(function (tz) {
        return {
          text: I18n.text('timezone_utils.utc_plus_minus', {
            offset: tz.offset,
            timezone: I18n.SafeString(tz.name)
          }),
          value: tz.identifier()
        };
      }).toJS()
    };
  }).sort(function (x, y) {
    var mainCountries = ['US', 'Europe', 'Canada'];

    for (var i in mainCountries) {
      if (x.text === mainCountries[i]) {
        return -1;
      }

      if (y.text === mainCountries[i]) {
        return 1;
      }
    }

    return 0;
  }).toArray();
});