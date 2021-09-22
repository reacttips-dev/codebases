import { ICountryObject } from "services/CountryService";
import { checkIsAccessibleMode } from "pages/workspace/sales/sub-modules/site-trends/helpers";
import { WORLDWIDE_COUNTRY_ID } from "pages/workspace/sales/sub-modules/constants";

export const preparedCountryForDropdown = (
    allowedCountries: ICountryObject[],
    mobileWebCountries: Record<number, boolean>,
    currentModule: string,
    translate: (value: string) => string,
) => {
    const accessibleMode = checkIsAccessibleMode(currentModule);
    return allowedCountries.map((country) => {
        return {
            ...country,
            permitted: true,
            mobileWeb: mobileWebCountries[country.id],
            showDeviceIcon: accessibleMode && country.id !== WORLDWIDE_COUNTRY_ID,
            tooltipText: mobileWebCountries[country.id]
                ? translate("countryFilter.mobileWeb")
                : translate("countryFilter.desktopOnly"),
        };
    });
};
