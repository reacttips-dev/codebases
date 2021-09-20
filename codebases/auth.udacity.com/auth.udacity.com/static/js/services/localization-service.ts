import { I18n } from '@udacity/ureact-i18n';

/**
 * Require all the localization files (by convention, we keep these files in `./src/locales`)
 */
const locales = {
  ar: require('./locales/ar').default,
  'pt-br': require('./locales/pt-br').default,
  'zh-cn': require('./locales/zh-cn').default
};

const options = {
  /**
   * debug mode allows for helpful development features.
   * To see pseudolocalization, uncomment debug: true and pass the query param
   * locale=__test__
   *
   * optional instance of `moment.js`, will be used to set the correct locale
   * for dates/times via the `moment.locale()` API.
   */
  // debug: true
  // moment: <moment instance>
};

export const i18n = new I18n(locales, options);
export const __ = i18n.__;

let _geoLocation: string = '';

export const MANAGED_REGIONS: Array<string> = [
  'AE', // MENA
  'AT', // EU - DACH
  'BH', // MENA
  'BR', // Brazil
  'CH', // EU - DACH
  'CN', // China
  'DE', // EU - DACH
  'EG', // MENA
  'GB', // EU - EU
  'IE', // EU - EU
  'IN', // India
  'JO', // MENA
  'KW', // MENA
  'LB', // MENA
  'MA', // MENA
  'OM', // MENA
  'QA', // MENA
  'SA', // MENA
  'TN' // MENA
];

export default {
  getGeoLocation: function(): string {
    return _geoLocation;
  },

  setGeoLocation: function(location: string): void {
    _geoLocation = location;
  }
};
