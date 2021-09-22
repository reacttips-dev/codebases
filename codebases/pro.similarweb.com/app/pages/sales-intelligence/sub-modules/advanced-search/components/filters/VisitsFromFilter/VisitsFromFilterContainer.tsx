import React from "react";
import { compose } from "redux";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useUnlockModal from "custom-hooks/useUnlockModal";
import { openUnlockModalV2 } from "services/ModalService";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import { WORLDWIDE_COUNTRY_ID } from "pages/sales-intelligence/constants/common";
import { FilterContainerProps } from "../../../types/common";
import useFilterState from "../../../hooks/useFilterState";
import withFilterUpdate from "../../../hoc/withFilterUpdate";
import withFilterInstance from "../../../hoc/withFilterInstance";
import withFilterAutoRegister from "../../../hoc/withFilterAutoRegister";
import CountriesSelectionModal from "../../common/CountriesSelectionModal/CountriesSelectionModal";
import { StyledBaseFilterContainer } from "../../styles";
import {
    CommonVisitFromFilter,
    VisitFromFilterValueType,
} from "../../../filters/visits-from/types";
import {
    StyledInnerContainer,
    StyledValueContainer,
    StyledEditButtonContainer,
    StyledCountryWithSeparator,
    StyledCountriesSeparator,
    StyledCountryName,
} from "./styles";

const VisitsFromFilterContainer = (props: FilterContainerProps<CommonVisitFromFilter>) => {
    const translate = useTranslation();
    const settingsHelper = useSalesSettingsHelper();
    const { filter, onUpdate } = props;
    const [isModalOpened, setIsModalOpened] = React.useState(false);
    const { value, updateFilterAndLocalState } = useFilterState(filter, onUpdate);
    const openUnlockCountries = useUnlockModal(
        "CountryFilters",
        "Countries",
        "Country Filter/get in touch",
    );

    const openUnlockModal = () => {
        if (settingsHelper.hasSolution2()) {
            openUnlockModalV2("WebCountry");
        } else {
            openUnlockCountries();
        }
    };

    const handleEditButtonClick = () => {
        if (filter.countries.length > 1) {
            return setIsModalOpened(true);
        }

        openUnlockModal();
    };

    const handleSelectionCancel = () => {
        setIsModalOpened(false);
    };

    const handleSelectionApply = (selectedIds: VisitFromFilterValueType) => {
        updateFilterAndLocalState(selectedIds);
        setIsModalOpened(false);
    };

    const renderValueWithSeparator = () => {
        return filter.getCurrentCountriesNames().map((name, index, array) => {
            if (array.length - 1 === index) {
                return <StyledCountryName key={`country-item-${index}`}>{name}</StyledCountryName>;
            }

            return (
                <StyledCountryWithSeparator key={`separator-country-item-${index}`}>
                    <StyledCountryName>{name}</StyledCountryName>
                    <StyledCountriesSeparator>
                        &nbsp;{translate("si.common.or")}&nbsp;
                    </StyledCountriesSeparator>
                </StyledCountryWithSeparator>
            );
        });
    };

    return (
        <StyledBaseFilterContainer>
            <StyledInnerContainer>
                <StyledValueContainer>{renderValueWithSeparator()}</StyledValueContainer>
                <StyledEditButtonContainer>
                    <PlainTooltip tooltipContent={translate("si.common.edit")}>
                        <div>
                            <IconButton
                                type="flat"
                                iconSize="xs"
                                onClick={handleEditButtonClick}
                                iconName={filter.countries.length > 1 ? "edit-icon" : "locked"}
                            />
                        </div>
                    </PlainTooltip>
                </StyledEditButtonContainer>
            </StyledInnerContainer>
            <CountriesSelectionModal
                selectedIds={value}
                isOpened={isModalOpened}
                onApply={handleSelectionApply}
                onCancel={handleSelectionCancel}
                isInitialEdit={filter.inInitialState()}
                hasRadioOptions={filter.isWorldwideAvailable()}
                countries={filter.countries.filter((c) => c.id !== WORLDWIDE_COUNTRY_ID)}
            />
        </StyledBaseFilterContainer>
    );
};

export default compose(
    withFilterInstance,
    withFilterUpdate,
    withFilterAutoRegister,
)(VisitsFromFilterContainer);
