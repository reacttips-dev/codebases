import { TranslateFunction } from "app/@types/I18nInterfaces";
import { SupportedFilterKey } from "../../types/filters";
import { AdvancedSearchSettingsService } from "../../types/services";
import VisitsFromFilter from "./VisitsFromFilter";
import { CommonVisitFromFilter } from "./types";

export default function createVisitsFromFilter(
    translate: TranslateFunction,
    key: SupportedFilterKey,
    settingsService: AdvancedSearchSettingsService,
): CommonVisitFromFilter {
    const currentComponentCountries = settingsService.getCurrentComponentCountries();
    const currentDesktopCountries = settingsService.getCurrentComponentDesktopCountries();
    const initialValue = [settingsService.getWorldwideOrFirstCountryCode()];
    const countries = currentComponentCountries.map((country) => {
        const foundInDesktop = currentDesktopCountries.find((c) => c.id === country.id);

        return {
            ...country,
            showDeviceIcon: true,
            mobileWeb: typeof foundInDesktop === "undefined",
        };
    });

    return new VisitsFromFilter({
        key,
        translate,
        countries,
        initialValue,
    });
}
