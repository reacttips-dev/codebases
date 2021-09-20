import {
    I18N_CONSTANTS as LOCAL_I18N_CONSTANTS
} from '@udacity/ureact-i18n';
import localI18n from 'services/localization-service/local-i18n';

// as of October 20th 2016, Connect is available in these locations:
const DEFAULT_REGION = 'NA';

let currentLocation = {
    regionName: DEFAULT_REGION
};

const localizationService = {
    setLocation(location) {
        currentLocation = location;
    },
    getCountryCode() {
        return _.get(currentLocation, 'countryCode');
    },
    fetchGeodeData() {
        return localI18n.fetchGeoLocation().then((location) => {
            this.setLocation(location);
        });
    },
    getRegion() {
        return _.get(currentLocation, 'regionName');
    },
    isConnectAvailable() {
        const CONNECT_COUNTRY_CODES = ['US'];
        return _.includes(CONNECT_COUNTRY_CODES, this.getCountryCode());
    },
    shouldShowConnectAd() {
        const CONNECT_REGION_NAMES = ['California', 'New York', DEFAULT_REGION];
        return _.includes(CONNECT_REGION_NAMES, this.getRegion());
    },
};

export const i18n = _.assign(localI18n, localizationService);
export const I18N_CONSTANTS = LOCAL_I18N_CONSTANTS;
export const __ = localI18n.__;