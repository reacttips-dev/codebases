import React from "react";
import classNames from "classnames";
import { SWReactIcons } from "@similarweb/icons";
import { CountryChipItem } from "@similarweb/ui-components/dist/chip";
import { ICountryObject } from "services/CountryService";
import { ProModal } from "components/Modals/src/ProModal";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { CountryRadioEnum } from "../../../types/common";
import { objectKeys } from "pages/workspace/sales/helpers";
import CountriesDropdown from "../CountriesDropdown/CountriesDropdown";
import { arraysHaveSamePrimitiveValues } from "pages/sales-intelligence/helpers/helpers";
import { WORLDWIDE_COUNTRY_ID } from "pages/sales-intelligence/constants/common";
import {
    StyledModalContent,
    StyledButtonsContainer,
    StyledHeader,
    StyledTitle,
    StyledSubtitle,
    StyledMainContainer,
    StyledSelectionWrapper,
    StyledDDContainer,
    StyledChipSeparator,
    StyledChipItemsContainer,
    StyledRadioContainer,
    StyledWarningBox,
    StyledWarningText,
    CUSTOM_MODAL_STYLES,
    DROPDOWN_BODY_HEIGHT,
} from "./styles";

type CountriesSelectionModalProps = {
    isOpened: boolean;
    isInitialEdit: boolean;
    hasRadioOptions: boolean;
    countries: readonly ICountryObject[];
    selectedIds: readonly ICountryObject["id"][];
    onApply(selectedIds: readonly ICountryObject["id"][]): void;
    onCancel(): void;
};

const CountriesSelectionModal = (props: CountriesSelectionModalProps) => {
    const translate = useTranslation();
    const { isOpened, countries, selectedIds, hasRadioOptions, onApply, onCancel } = props;
    const [selectedRadio, selectRadio] = React.useState(CountryRadioEnum.specific as string);
    const [selectedCountriesIds, setSelectedCountriesIds] = React.useState(selectedIds);
    /** Whether to show a special warning box if user selects country with desktop data only */
    const isDesktopOnlyWarningShown = selectedCountriesIds.some((id) => {
        return findCountryById(id)?.mobileWeb === false;
    });
    /** Comparing previous with current selection */
    const selectionIsNotChanged = arraysHaveSamePrimitiveValues(selectedIds, selectedCountriesIds);

    const chipItems = selectedCountriesIds.reduce<
        {
            id: number;
            text: string;
            icon: string;
            onCloseItem(): void;
        }[]
    >((items, id) => {
        const countryObject = findCountryById(id);

        if (typeof countryObject !== "undefined") {
            const text = countryObject.mobileWeb
                ? countryObject.text
                : `${countryObject.text} (${translate(
                      "si.components.countries_selection_modal.desktop_only_chip_text",
                  )})`;

            items.push({
                text,
                id: countryObject.id,
                icon: countryObject.icon,
                onCloseItem() {
                    handleSelection(countryObject);
                },
            });
        }

        return items;
    }, []);

    const handleCancel = () => {
        setSelectedCountriesIds(selectedIds);
        onCancel();
    };

    const handleApply = () => {
        if (selectedRadio === CountryRadioEnum.specific && hasRadioOptions) {
            return onApply(selectedCountriesIds.filter((id) => id !== WORLDWIDE_COUNTRY_ID));
        }

        onApply(selectedCountriesIds);
    };

    const handleRadioSelect = (id: string) => {
        if (id === CountryRadioEnum.worldwide) {
            setSelectedCountriesIds([WORLDWIDE_COUNTRY_ID]);
        } else {
            setSelectedCountriesIds([]);
        }

        selectRadio(id);
    };

    const handleSelection = (country: ICountryObject) => {
        if (selectedCountriesIds.includes(country.id)) {
            return setSelectedCountriesIds(selectedCountriesIds.filter((id) => id !== country.id));
        }

        setSelectedCountriesIds(selectedCountriesIds.concat(country.id));
    };

    const renderChipItemsSeparator = (index: number) => {
        return (
            <StyledChipSeparator key={`separator-${index}`}>
                {translate("si.common.or")}
            </StyledChipSeparator>
        );
    };

    React.useEffect(() => {
        setSelectedCountriesIds(selectedIds);
    }, [selectedIds]);

    function findCountryById(id: ICountryObject["id"]) {
        return countries.find((c) => c.id === id);
    }

    return (
        <ProModal
            isOpen={isOpened}
            showCloseIcon={false}
            shouldCloseOnOverlayClick={false}
            customStyles={CUSTOM_MODAL_STYLES}
        >
            <StyledModalContent>
                <StyledHeader>
                    <StyledTitle>
                        {translate("si.components.countries_selection_modal.title")}
                    </StyledTitle>
                    <StyledSubtitle>
                        {translate("si.components.countries_selection_modal.subtitle")}
                    </StyledSubtitle>
                </StyledHeader>
                <StyledMainContainer>
                    {hasRadioOptions && (
                        <StyledRadioContainer
                            selected={selectedRadio}
                            onSelect={handleRadioSelect}
                            items={objectKeys(CountryRadioEnum).map((id) => ({
                                id,
                                text: translate(
                                    `si.components.countries_selection_modal.radio.${id}`,
                                ),
                            }))}
                        />
                    )}
                    <StyledSelectionWrapper
                        className={classNames({
                            hidden: selectedRadio === CountryRadioEnum.worldwide,
                        })}
                        hasBorder={chipItems.length > 0}
                        hasPadding={chipItems.length > 0}
                    >
                        <StyledChipItemsContainer
                            items={chipItems}
                            ChipComponent={CountryChipItem}
                            renderSeparator={renderChipItemsSeparator}
                        />
                        <StyledDDContainer hasMargin={chipItems.length > 0}>
                            <CountriesDropdown
                                items={countries}
                                onSelect={handleSelection}
                                selectedItems={selectedCountriesIds}
                                dropdownPopupHeight={DROPDOWN_BODY_HEIGHT}
                                dropdownPopupPlacement="ontop-left"
                                placeholder={translate(
                                    "si.components.countries_selection_modal.dd_placeholder",
                                )}
                            />
                        </StyledDDContainer>
                    </StyledSelectionWrapper>
                    {isDesktopOnlyWarningShown && (
                        <StyledWarningBox>
                            <SWReactIcons iconName="warning" size="sm" />
                            <StyledWarningText
                                dangerouslySetInnerHTML={{
                                    __html: translate(
                                        "si.components.countries_selection_modal.desktop_only_warning",
                                    ),
                                }}
                            />
                        </StyledWarningBox>
                    )}
                </StyledMainContainer>
                <StyledButtonsContainer>
                    <Button
                        type="flat"
                        onClick={handleCancel}
                        dataAutomation="countries-selection-modal-button-cancel"
                    >
                        {translate("si.common.button.cancel")}
                    </Button>
                    <Button
                        onClick={handleApply}
                        dataAutomation="countries-selection-modal-button-apply"
                        isDisabled={selectedCountriesIds.length === 0 || selectionIsNotChanged}
                    >
                        {translate("si.common.button.apply")}
                    </Button>
                </StyledButtonsContainer>
            </StyledModalContent>
        </ProModal>
    );
};

export default CountriesSelectionModal;
