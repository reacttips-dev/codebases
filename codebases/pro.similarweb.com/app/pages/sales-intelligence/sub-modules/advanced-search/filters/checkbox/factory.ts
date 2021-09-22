import { TranslateFunction } from "app/@types/I18nInterfaces";
import { SupportedFilterKey } from "../../types/filters";
import CheckboxFilter from "./CheckboxFilter";
import { CommonCheckboxFilter } from "./types";

export default function createCheckboxFilter(
    translate: TranslateFunction,
    key: SupportedFilterKey,
): CommonCheckboxFilter {
    const name = translate(`si.lead_gen_filters.${key}.name`);
    const tooltip = translate(`si.lead_gen_filters.${key}.tooltip`);
    const initialValue = false;

    return new CheckboxFilter({
        key,
        name,
        tooltip,
        translate,
        initialValue,
    });
}
