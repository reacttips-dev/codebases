import * as _ from "lodash";
import React, { useCallback, useMemo, useState } from "react";

import {
    CountryDropdownButton,
    CountryDropdownItem,
    Dropdown,
} from "@similarweb/ui-components/dist/dropdown";
import { IWizardCountries } from "pages/conversion/wizard/CustomGroupWizard";
import { CountryItemWrapper, DropdownContainer } from "./StyledComponents";
import UnlockModalConfig, {
    IUnlockModalConfigTypes,
} from "components/Modals/src/UnlockModal/unlockModalConfig";
import UnlockModal from "components/React/UnlockModalProvider/UnlockModalProvider";
import { ConversionSegmentsUtils } from "pages/conversion/ConversionSegmentsUtils";

export interface IWizardCountriesDropdownProps {
    items: {
        [id: string]: { id: string; text: string };
    };
    onSelectedItemsChange: (items: object[]) => void;
    selectedCountry: string;
    availableCountries: IWizardCountries;
}

export const WizardCountriesDropdown: React.FunctionComponent<IWizardCountriesDropdownProps> = ({
    items,
    onSelectedItemsChange,
    selectedCountry,
    availableCountries,
}) => {
    const sortedCountriesList = useMemo(
        () =>
            _.sortBy(
                Object.keys(items).map((id) => items[id]),
                "text",
            ),
        [items],
    );
    const availableCountriesCodes = useMemo(
        () => Object.keys(availableCountries).map((id) => availableCountries[id].id),
        [availableCountries],
    );
    const userCountries = useMemo(() => ConversionSegmentsUtils.getUserCountries(), []);
    const [isCountryHookOpen, setIsCountryHookOpen] = useState(false);
    const openCountryHook = useCallback(
        (evt) => {
            evt.stopPropagation();
            setIsCountryHookOpen(true);
        },
        [setIsCountryHookOpen],
    );
    const closeCountryHook = useCallback(() => setIsCountryHookOpen(false), [setIsCountryHookOpen]);
    const onItemClick = (item) => {
        onSelectedItemsChange({
            ...item,
            ...items[item.id],
        });
    };
    const selectedCountryKey = Object.keys(items).find((id) => {
        return id === selectedCountry;
    });
    const selectedId = items[selectedCountryKey];

    return (
        <DropdownContainer>
            <Dropdown
                selectedIds={{ [selectedCountryKey]: selectedId }}
                shouldScrollToSelected={true}
                onClick={onItemClick}
                itemsComponent={CountryDropdownItem}
            >
                {[
                    <CountryDropdownButton key={selectedId.text} countryId={selectedId.id}>
                        {selectedId.text}
                    </CountryDropdownButton>,
                    ...sortedCountriesList.map(({ id, text }) => {
                        const isAvailable = availableCountriesCodes.includes(id);
                        const isPermitted = userCountries.includes(+id);
                        const itemParams = {
                            id: +id,
                            code: `${id}`,
                            permitted: isPermitted,
                            text,
                        };
                        return (
                            <div key={`${id}_${text}`} id={id}>
                                <CountryItemWrapper
                                    isAvailable={isAvailable}
                                    {...(!isPermitted && { onClick: openCountryHook })}
                                >
                                    <CountryDropdownItem {...itemParams}>
                                        {text}
                                    </CountryDropdownItem>
                                </CountryItemWrapper>
                            </div>
                        );
                    }),
                ]}
            </Dropdown>
            <UnlockModal
                isOpen={isCountryHookOpen}
                onCloseClick={closeCountryHook}
                activeSlide={"Countries" as IUnlockModalConfigTypes["CountryFilters"]}
                location="Hook PRO/Funnel Analysis/Country Filter"
                {...UnlockModalConfig().CountryFilters}
            />
        </DropdownContainer>
    );
};
