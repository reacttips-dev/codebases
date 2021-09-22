import React from "react";
import { colorsPalettes } from "@similarweb/styles";
import { EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown/src/items/EllipsisDropdownItem";
import {
    ContactsDepartments,
    ContactsFilterBase,
    ContactsFilterResponse,
    ContactsFiltersParams,
    ContactsFiltersType,
    ContactsSearchParams,
    ContactsSearchType,
    PhoneNumber,
} from "../../contacts/store/types";
import { ContactsSearch, ContactsSelectedFilters } from "../types/contacts";
import { IBooleanSearchChipItem } from "@similarweb/ui-components/dist/boolean-search/src/BooleanSearch";

export const clipBoard = (value: string) => {
    const el = document.createElement("input");
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
};

/**
 * Generate color for background of departments label
 */
export const getContactsDepartmentsBackground = (name: ContactsDepartments): string => {
    switch (name) {
        case "ACCOUNTING":
            return colorsPalettes.brown[100];
        case "BUSINESS":
            return colorsPalettes.teal[100];
        case "CLIENT SUCCESS":
            return colorsPalettes.pink[100];
        case "HR":
            return colorsPalettes.green[100];
        case "LEADERSHIP":
            return colorsPalettes.indigo[100];
        case "LEGAL":
            return colorsPalettes.bluegrey[300];
        case "MARKETING":
            return colorsPalettes.orange[100];
        case "OPERATIONS":
            return colorsPalettes.yellow[100];
        case "OVERSIGHT":
            return colorsPalettes.brown[100];
        case "PRODUCTION":
            return colorsPalettes.purple[100];
        case "SALES":
            return colorsPalettes.red[100];
        case "TECHNOLOGY":
            return colorsPalettes.blue[100];
        default:
            return colorsPalettes.teal[100];
    }
};

/**
 * Generate color for text of departments label
 */
export const getContactsDepartmentsColor = (name: ContactsDepartments): string => {
    switch (name) {
        case "ACCOUNTING":
            return colorsPalettes.brown[400];
        case "BUSINESS":
            return colorsPalettes.teal[500];
        case "CLIENT SUCCESS":
            return colorsPalettes.pink[400];
        case "HR":
            return colorsPalettes.green["s100"];
        case "LEADERSHIP":
            return colorsPalettes.indigo[400];
        case "LEGAL":
            return colorsPalettes.bluegrey[600];
        case "MARKETING":
            return colorsPalettes.orange[400];
        case "OPERATIONS":
            return colorsPalettes.yellow[500];
        case "OVERSIGHT":
            return colorsPalettes.brown[500];
        case "PRODUCTION":
            return colorsPalettes.purple[400];
        case "SALES":
            return colorsPalettes.red[400];
        case "TECHNOLOGY":
            return colorsPalettes.blue[400];
        default:
            return colorsPalettes.teal[500];
    }
};

/**
 * Set up color for details button's icon
 */
export const getIconColor = (loading: boolean, hasItem: boolean): string => {
    if (loading) {
        return colorsPalettes.carbon[50];
    }
    if (hasItem) {
        return colorsPalettes.carbon[0];
    }
    return colorsPalettes.carbon[200];
};

/**
 * Set up color for details button's icon
 */
export const concatContactsPhone = (number: string, type: string): string =>
    number + (type ? ` (${type})` : "");

/**
 * Contacts filter config
 */
export const contactsFiltersConfig = (translate: (key: string) => string, tracking) => {
    return {
        countriesFilter: {
            filterOptions: {
                hasSearch: true,
                dropdownWidth: 300,
                searchPlaceHolder: translate(
                    "si.sidebar.contacts.filter.countries.search.placeholder",
                ),
                appendTo: ".contacts-filter-countries",
                labelFooterButton: translate("si.sidebar.contacts.button.apply"),
                renderChipTitleText: (
                    selectedItems: string[],
                    setChipTitle: (title: string) => void,
                ) => {
                    const countSelectedItems = selectedItems.length;
                    const firstSelected = selectedItems[0] ? selectedItems[0] : "";
                    const selectedText = firstSelected
                        ? `${firstSelected} ${
                              countSelectedItems > 1 ? `+${countSelectedItems - 1}` : ""
                          }`
                        : "";
                    setChipTitle(selectedText);
                },
                onToggleDropdown: (isOpen: boolean) => {
                    if (isOpen) {
                        tracking.trackOpenContactsFilter(ContactsFiltersType.COUNTRIES);
                    }
                },
            },
            buttonLabel: translate("si.sidebar.contacts.filter.countries.title"),
            // eslint-disable-next-line react/display-name
            renderDropDownItem: (option: { id: string; text: string }) => (
                <EllipsisDropdownItem
                    showCheckBox
                    key={option.id}
                    id={option.id}
                    countryCode={option.id}
                >
                    {option.text}
                </EllipsisDropdownItem>
            ),
        },
        departmentsFilter: {
            filterOptions: {
                dropdownWidth: 300,
                appendTo: ".contacts-filter-departments",
                labelFooterButton: translate("si.sidebar.contacts.button.apply"),
                renderChipTitleText: (
                    selectedItems: string[],
                    setChipTitle: (title: string) => void,
                ) => {
                    const countSelectedItems = selectedItems.length;
                    const firstSelected = selectedItems[0] ? selectedItems[0] : "";
                    const selectedText = firstSelected
                        ? `${firstSelected} ${
                              countSelectedItems > 1 ? `+${countSelectedItems - 1}` : ""
                          }`
                        : "";
                    setChipTitle(selectedText);
                },
                onToggleDropdown: (isOpen: boolean) => {
                    if (isOpen) {
                        tracking.trackOpenContactsFilter(ContactsFiltersType.DEPARTMENTS);
                    }
                },
            },
            buttonLabel: translate("si.sidebar.contacts.filter.departments.title"),
            // eslint-disable-next-line react/display-name
            renderDropDownItem: (option: { id: string; text: string }) => (
                <EllipsisDropdownItem showCheckBox key={option.id} id={option.id}>
                    {option.text}
                </EllipsisDropdownItem>
            ),
        },
        seniorityLevelsFilter: {
            filterOptions: {
                dropdownWidth: 300,
                appendTo: ".contacts-filter-seniorityLevels",
                labelFooterButton: translate("si.sidebar.contacts.button.apply"),
                renderChipTitleText: (
                    selectedItems: string[],
                    setChipTitle: (title: string) => void,
                ) => {
                    const countSelectedItems = selectedItems.length;
                    const firstSelected = selectedItems[0] ? selectedItems[0] : "";
                    const selectedText = firstSelected
                        ? `${firstSelected} ${
                              countSelectedItems > 1 ? `+${countSelectedItems - 1}` : ""
                          }`
                        : "";
                    setChipTitle(selectedText);
                },
                onToggleDropdown: (isOpen: boolean) => {
                    if (isOpen) {
                        tracking.trackOpenContactsFilter(ContactsFiltersType.SENIORITY_LEVELS);
                    }
                },
            },
            buttonLabel: translate("si.sidebar.contacts.filter.seniority.title"),
            // eslint-disable-next-line react/display-name
            renderDropDownItem: (option: { id: string; text: string }) => (
                <EllipsisDropdownItem showCheckBox key={option.id} id={option.id}>
                    {option.text}
                </EllipsisDropdownItem>
            ),
        },
    };
};

export const extractFilterValues = (items: ContactsFilterBase[]): string[] =>
    items.map((item) => item.text);

export const convertFilterIdToString = (filter: ContactsFilterResponse[]): ContactsFilterBase[] =>
    filter.map((item) => ({ ...item, id: `${item.id}` }));

export const generateContactsFiltersParams = ({
    seniorityFilters,
    departmentsFilters,
    countiesFilters,
}: ContactsSelectedFilters): ContactsFiltersParams => {
    const params: ContactsFiltersParams = {};

    if (seniorityFilters?.length) {
        params[ContactsFiltersType.SENIORITY_LEVELS] = extractFilterValues(seniorityFilters);
    }
    if (departmentsFilters?.length) {
        params[ContactsFiltersType.DEPARTMENTS] = extractFilterValues(
            departmentsFilters,
        ) as ContactsDepartments[];
    }
    if (countiesFilters?.length) {
        params[ContactsFiltersType.COUNTRIES] = extractFilterValues(countiesFilters);
    }

    return params;
};

const extendsContactsSearchParams = (
    params: ContactsSearchParams,
    key: ContactsSearchType,
    value: string,
): ContactsSearchParams => {
    if (params[key]) {
        params[key].push(value);
    } else {
        params[key] = [value];
    }
    return params;
};

export const generateContactsSearchParams = (
    searchItems: IBooleanSearchChipItem[],
): ContactsSearchParams => {
    return searchItems.reduce((params, item) => {
        if (item.action === ContactsSearch.INCLUDE) {
            return extendsContactsSearchParams(params, ContactsSearchType.TITLES, item.text);
        }
        if (item.action === ContactsSearch.EXCLUDE) {
            return extendsContactsSearchParams(
                params,
                ContactsSearchType.EXCLUDE_TITLES,
                item.text,
            );
        }
    }, {});
};

export const matchContactsFilter = (
    name: ContactsFiltersType,
    selectedItems: ContactsFilterBase[],
): Partial<ContactsSelectedFilters> => {
    if (name === ContactsFiltersType.DEPARTMENTS) {
        return { departmentsFilters: selectedItems };
    }

    if (name === ContactsFiltersType.SENIORITY_LEVELS) {
        return { seniorityFilters: selectedItems };
    }

    return { countiesFilters: selectedItems };
};

export const splitPhoneNumbers = (
    phoneNumbers: PhoneNumber[],
): { mobiles: PhoneNumber[]; phones: PhoneNumber[] } => {
    return phoneNumbers.reduce<{ mobiles: PhoneNumber[]; phones: PhoneNumber[] }>(
        (acc, number) => {
            if (number.numberType === "MOBILE") {
                acc["mobiles"].push(number);
            } else {
                acc["phones"].push(number);
            }
            return acc;
        },
        {
            phones: [],
            mobiles: [],
        },
    );
};
