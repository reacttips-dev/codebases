import { IBooleanSearchChipItem } from "@similarweb/ui-components/dist/boolean-search/src/BooleanSearch";
import {
    ContactsFilterBase,
    ContactsFiltersType,
} from "pages/sales-intelligence/sub-modules/contacts/store/types";
import { ContactsSearch } from "pages/sales-intelligence/sub-modules/right-sidebar/types/contacts";

const createContactsTrackingService = (
    track: (category: string, action: string, name: string) => void,
) => {
    const prepareTrackingFilters = (items: ContactsFilterBase[]): string =>
        items.reduce((acc, item) => (acc += `${item.text}; `), "");

    const matchFilterName = (filter: ContactsFiltersType): string => {
        if (filter === ContactsFiltersType.SENIORITY_LEVELS) {
            return "seniority";
        }
        if (filter === ContactsFiltersType.COUNTRIES) {
            return "employee location";
        }
        if (filter === ContactsFiltersType.DEPARTMENTS) {
            return "department";
        }
    };

    const prepareTrackingSearch = (items: IBooleanSearchChipItem[]): string =>
        items.reduce<string>((acc, item) => {
            if (item.action === ContactsSearch.INCLUDE) {
                acc += `+${item.text}; `;
                return acc;
            }
            if (item.action === ContactsSearch.EXCLUDE) {
                acc += `-${item.text}; `;
                return acc;
            }
        }, "");

    return {
        trackSearchRoles(values: IBooleanSearchChipItem[]) {
            track("sidebar contacts", "text search role", prepareTrackingSearch(values));
        },
        trackChangeFilter(
            filter: ContactsFiltersType,
            values: ContactsFilterBase[],
            total: number,
        ) {
            track(
                "sidebar contacts",
                `change ${matchFilterName(filter)}`,
                `${prepareTrackingFilters(values)}/${total}`,
            );
        },
        trackResetFilter(filter: ContactsFiltersType) {
            track("sidebar contacts", `reset ${matchFilterName(filter)}`, "");
        },
        trackExpandContact(type: "Revealed" | "New", seniority: string, role = "") {
            track("sidebar contacts", "expand a contact", `${type}/${seniority}/${role}`);
        },
        trackCopyDetailsContact(isRevealed: boolean, name: string, role = "") {
            const type = isRevealed === true ? "Revealed" : "New";
            track("sidebar contacts", "copy details", `${type}/${name}/${role}`);
        },
        trackOpenContactsFilter(filter: ContactsFiltersType) {
            track("sidebar contacts", `open ${matchFilterName(filter)} DD`, "");
        },
    };
};

export default createContactsTrackingService;
