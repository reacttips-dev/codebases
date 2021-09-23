import I18n from 'I18n';
import { List } from 'immutable';
import join from '../utils/join';
export default (function () {
  return List([{
    name: I18n.text('timezone_utils.timezones.pacific_time'),
    timezones: ['US/Pacific', 'America/Los_Angeles']
  }, {
    name: I18n.text('timezone_utils.timezones.mountain_time'),
    timezones: ['US/Mountain', 'America/Denver']
  }, {
    name: I18n.text('timezone_utils.timezones.central_time'),
    timezones: ['US/Central', 'America/Chicago']
  }, {
    name: I18n.text('timezone_utils.timezones.central_standard_time'),
    timezones: ['America/Guatemala']
  }, {
    name: I18n.text('timezone_utils.timezones.eastern_time'),
    timezones: ['US/Eastern', 'America/New_York']
  }, {
    name: I18n.text('timezone_utils.timezones.atlantic_time'),
    timezones: ['Canada/Atlantic']
  }, {
    name: I18n.text('timezone_utils.timezones.central_european_time_europe'),
    timezones: ['Europe/Berlin']
  }, {
    name: I18n.text('timezone_utils.timezones.central_european_time_africa'),
    timezones: ['Africa/Lagos']
  }, {
    name: I18n.text('timezone_utils.timezones.eastern_european_time'),
    timezones: ['Europe/Athens']
  }, {
    name: join([I18n.text('timezone_utils.cities.dublin'), I18n.text('timezone_utils.cities.london'), I18n.text('timezone_utils.cities.lisbon')]),
    timezones: ['Europe/Dublin']
  }, {
    name: I18n.text('timezone_utils.timezones.eastern_caribbean_time'),
    timezones: ['America/Barbados']
  }, {
    name: join([I18n.text('timezone_utils.countries.china'), I18n.text('timezone_utils.cities.hong_kong'), I18n.text('timezone_utils.cities.singapore')]),
    timezones: ['Asia/Shanghai']
  }, {
    name: I18n.text('timezone_utils.timezones.greenwich_mean_time'),
    timezones: ['Africa/Timbuktu']
  }, {
    name: join([I18n.text('timezone_utils.cities.argentina'), I18n.text('timezone_utils.regions.brazil')]),
    timezones: ['America/Argentina/Buenos_Aires']
  }, {
    name: I18n.text('timezone_utils.timezones.south_africa_time'),
    timezones: ['Africa/Johannesburg']
  }, {
    name: I18n.text('timezone_utils.timezones.east_africa_time'),
    timezones: ['Africa/Nairobi']
  }, {
    name: join([I18n.text('timezone_utils.cities.jamaica'), I18n.text('timezone_utils.cities.panama'), I18n.text('timezone_utils.cities.colombia')]),
    timezones: ['America/Jamaica']
  }, {
    name: I18n.text('timezone_utils.timezones.indochina_time'),
    timezones: ['Asia/Bangkok']
  }, {
    name: join([I18n.text('timezone_utils.cities.new_delhi'), I18n.text('timezone_utils.cities.mumbai'), I18n.text('timezone_utils.cities.calcutta')]),
    timezones: ['Asia/Calcutta']
  }, {
    name: I18n.text('timezone_utils.timezones.arizona_time'),
    timezones: ['America/Phoenix']
  }, {
    name: I18n.text('timezone_utils.timezones.ae_time'),
    timezones: ['Australia/Canberra']
  }, {
    name: join([I18n.text('timezone_utils.cities.baghdad'), I18n.text('timezone_utils.cities.bahrain'), I18n.text('timezone_utils.cities.istanbul'), I18n.text('timezone_utils.cities.qatar')]),
    timezones: ['Asia/Baghdad']
  }, {
    name: join([I18n.text('timezone_utils.cities.seoul'), I18n.text('timezone_utils.cities.tokyo')]),
    timezones: ['Asia/Seoul']
  }]);
});