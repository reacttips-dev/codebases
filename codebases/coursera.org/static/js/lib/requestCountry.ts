import { JsAppConfig } from 'js/app/config';

const DEFAULT_COUNTRY_CODE = 'US';

declare const coursera: { config: JsAppConfig } | undefined;

export default {
  get(): string {
    let countryCode: string;
    if (typeof coursera === 'object' && typeof coursera.config === 'object') {
      const { requestCountryCode } = coursera.config;
      const isValidCode = typeof requestCountryCode === 'string' && requestCountryCode.length === 2;
      countryCode = isValidCode ? requestCountryCode.toUpperCase() : DEFAULT_COUNTRY_CODE;
    } else {
      countryCode = DEFAULT_COUNTRY_CODE;
    }

    return countryCode;
  },
};
