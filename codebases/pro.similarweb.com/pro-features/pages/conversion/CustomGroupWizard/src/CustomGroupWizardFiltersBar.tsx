import React, { useEffect, useState } from "react";

import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import * as _ from "lodash";
import {
    IWizardCountries,
    IWizardMarkets,
    IWizardSelectedGroup,
} from "pages/conversion/wizard/CustomGroupWizard";
import styled, { css } from "styled-components";
import "./_customGroupWizard.scss";
import { CheckboxContainer, FiltersBox } from "./StyledComponents";
import { WizardCountriesDropdown } from "./WizardCountriesDropdown";
import { WizardGroupsDropdown } from "./WizardMarketsDropdown";

export interface ICustomGroupWizardFiltersBar {
    initialFilters: IWizardFilters;
    markets: IWizardMarkets;
    countries: IWizardCountries;
    selectedGroup?: IWizardSelectedGroup;
    isEdit: boolean;
    trackingKey: string;
    selectedRecords: Array<{
        id?: string;
        SegmentId?: string;
    }>; // they must have at least one of this properties
    translate: (key: string, params?) => string;
    track: (category?: string, action?: string, name?: string, value?: number) => void;
    onFilterChange: (filters: any) => void;
}

export interface IWizardFilters {
    sort: string;
    asc: boolean;
    orderBy: string;
    webSource: string;
    country: string;
    market: string;
    from: string;
    to: string;
    PageSize: string;
    DomainFilter: string;
    segments: string;
}

/**
 * Wraps wizard filters, to allow controlling the spacing between them
 */
const FilterItemWrapper = styled.div<{ marginRight?: number }>`
    margin-right: ${({ marginRight = 0 }) => marginRight}px;
`;

export const CustomGroupWizardFiltersBar: React.FunctionComponent<ICustomGroupWizardFiltersBar> = ({
    initialFilters,
    markets,
    countries,
    onFilterChange,
    selectedRecords,
    translate,
    track,
    isEdit,
    trackingKey,
    selectedGroup,
}) => {
    const [filters, setFilters] = useState<IWizardFilters>(initialFilters);
    const onSearchInputChange = (text) => {
        track("Search Bar", "Change", `Search Bar/${text}`);
        setFilters((prevFilters) => ({
            ...prevFilters,
            DomainFilter: text,
        }));
    };
    const [availableCountries, setAvailableCountries] = useState<IWizardCountries>(countries);
    const [availableMarkets, setAvailableMarkets] = useState<string[]>(
        countries[initialFilters.country].markets,
    );
    const onSelectedMarketItemChange = (item) => {
        const itemGroupType = item.creationType === "SW" ? "SW Group" : "Custom group";
        const isAllMarkets = item.id === "all";
        track(
            "Dropdown",
            "Click",
            `Group/${!isAllMarkets ? (item.iid ? "Industry" : itemGroupType) : ""}/${item.text}`,
        );
        setFilters((prevFilters) => {
            const newFilters = {
                ...prevFilters,
                market: `${item.id}`,
                gid: "",
                iid: "",
            };

            setAvailableCountries(item.countries);

            if (!item.gid && !item.iid) {
                return newFilters;
            }

            const typedItemId = item.gid ? "gid" : "iid";

            newFilters[typedItemId] = item[typedItemId];

            return newFilters;
        });
    };
    const onSelectedCountryItemChange = (item) => {
        track("Dropdown", "Click", `Country/${item.text}`);
        setAvailableMarkets(item.markets);
        setFilters((prevFilters) => ({
            ...prevFilters,
            country: `${item.id}`,
        }));
    };
    const [isShowOnlySelected, setIsShowOnlySelected] = useState<boolean>(isEdit);
    const onShowOnlySelectedToggle = () => {
        const newIsShowOnlySelected = !isShowOnlySelected;
        track("Checkbox", "Toggle", `Show selected/${newIsShowOnlySelected ? "Check" : "Hide"}`);
        setIsShowOnlySelected(newIsShowOnlySelected);
        setFilters((prevFilters) => {
            return {
                ...prevFilters,
                segments: newIsShowOnlySelected
                    ? selectedRecords.map((item) => `"${item.id || item.SegmentId}"`).join(",")
                    : "",
            };
        });
    };

    useEffect(() => {
        onFilterChange(filters);
    }, [filters]);

    return (
        <FiltersBox>
            <SearchInput
                placeholder={"Search for domain..."}
                debounce={300}
                onChange={onSearchInputChange}
            />
            <PlainTooltip
                text={translate("conversion.wizard.dropdown.countries.tooltip")}
                placement={"top"}
            >
                <FilterItemWrapper marginRight={8}>
                    <WizardCountriesDropdown
                        selectedCountry={filters.country}
                        availableCountries={availableCountries}
                        items={countries}
                        onSelectedItemsChange={onSelectedCountryItemChange}
                    />
                </FilterItemWrapper>
            </PlainTooltip>
            <PlainTooltip
                text={translate("conversion.wizard.dropdown.markets.tooltip")}
                placement={"top"}
            >
                <FilterItemWrapper marginRight={3}>
                    <WizardGroupsDropdown
                        defaultMarketId={"all"}
                        selectedMarketId={filters.market}
                        markets={markets}
                        availabileMarkets={availableMarkets}
                        searchPlaceholder={translate(
                            "conversion.wizard.dropdown.groups.searchPlaceholder",
                        )}
                        buttonPlaceholder={translate(
                            "conversion.wizard.dropdown.groups.button.placeholder",
                        )}
                        onSelectedItemsChange={onSelectedMarketItemChange}
                    />
                </FilterItemWrapper>
            </PlainTooltip>
            <CheckboxContainer>
                <PlainTooltip
                    text={translate("conversion.wizard.showSelected.tooltip")}
                    placement={"top"}
                >
                    <FilterItemWrapper>
                        <Checkbox
                            label={translate("conversion.wizard.showSelected.label")}
                            onClick={onShowOnlySelectedToggle}
                            selected={isShowOnlySelected}
                        />
                    </FilterItemWrapper>
                </PlainTooltip>
            </CheckboxContainer>
        </FiltersBox>
    );
};
