import { i18nFilter } from "filters/ngFilters";

declare const window: any;

const MOBILE_WEB_BETA_COUNTRIES = [392];

export interface ICountryObject {
    code: string;
    id: number;
    icon?: string;
    text: string;
    states?: ICountryObject[];
    children?: ICountryObject[];
    parent?: any;
    mobileWeb?: boolean;
    showDeviceIcon?: boolean;
}

export interface ICountryService {
    countries: ICountryObject[];
    countriesById: { [key: number]: ICountryObject };
    isUSState: (code: number) => boolean;
    isMobileWebBetaCountry: (code: number) => boolean;
    getCountryById: (id: number) => ICountryObject;
    getGoogleCountryCodeById: (id: number | string) => string;
}

class CountryService implements ICountryService {
    public countries;
    public countriesById;
    private WORLDWIDE_COUNTRY_ID = 999;

    constructor(
        countries,
        countriesById = {},
        private mobileWebBetaCountries = MOBILE_WEB_BETA_COUNTRIES,
    ) {
        this.countries = countries;
        this.countriesById = countriesById;

        if (this.countries) {
            if (!this.countries.some(({ id }) => id === this.WORLDWIDE_COUNTRY_ID)) {
                this.countries.unshift({ id: this.WORLDWIDE_COUNTRY_ID, code: "ww" });
            }
            if (!this.countries.some(({ id }) => id === 0)) {
                this.countries.unshift({ id: 0, code: "xx" });
            }
            this.countries.forEach((country) => {
                country.children = [];
                country.icon = "flag flag-" + country.code;
                country.text =
                    country.id === 0
                        ? i18nFilter()("global.unknown")
                        : i18nFilter()("common.country." + country.id);
                this.countriesById[country.id] = country;
                if (country.states && country.states.length) {
                    country.states.forEach((state) => {
                        state.text = i18nFilter()("common.country." + state.id);
                        country.children.push(state);
                        this.countriesById[state.id] = state;
                    });
                }
            });
        }
    }

    public getCountryById(id) {
        return this.countriesById[id];
    }

    public getGoogleCountryCodeById(id) {
        // the Google code for the worldwide is '', the rest of the codes are the upper case of the country code
        return Number(id) === this.WORLDWIDE_COUNTRY_ID
            ? String()
            : this.getCountryById(id)?.code?.toUpperCase();
    }

    public isUSState = (id) => {
        return this.countriesById[id] ? !!this.countriesById[id].parent : false;
    };

    public isMobileWebBetaCountry = (id) => {
        return this.mobileWebBetaCountries.includes(parseInt(id));
    };
}

export const CountryServiceFactory = (
    countries,
    countriesById = {},
    mobileWebBetaCountries = MOBILE_WEB_BETA_COUNTRIES,
) => {
    return new CountryService(countries, countriesById);
};

export default new CountryService(
    window.similarweb.config.countries,
    window.similarweb.config.countriesById,
);
