import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import SubmitButton from "../Buttons/SubmitButton";
import SelectDomainsDropdown from "../Dropdowns/SelectDomainsDropdown";
import { DropdownListItem, SelectedMode } from "../types";
import { OpportunityListType } from "pages/sales-intelligence/sub-modules/opportunities/types";
import useMultiSelectorPanelTrackingService from "pages/sales-intelligence/hooks/useMultiSelectorPanelTrackingService";
import { selectWebsitesTooltipText } from "../helpers/tooltips";
import { isManuallyMode } from "../helpers/helpers";
import TitleOptions from "pages/sales-intelligence/common-components/MultiSelector/components/TitleOptions";
import AddToListDropdownContainer from "pages/sales-intelligence/sub-modules/opportunities/components/AddToListDropdown/AddToListDropdownContainer";
import {
    StyledAccountOptions,
    StyledOpportunitiesList,
    StyledTitleAccountOptions,
} from "../styles";
import { SelectorPanelItemConfig } from "pages/sales-intelligence/sub-modules/common/types";

type AccountOptionsProps = {
    handleColumnsToggle(visible: boolean): void;
    selectedDomains: string[];
    listUpdating: boolean;
    remaining: number;
    listOfRange: DropdownListItem[];
    handleSubmitAccountOptions(list: OpportunityListType, domains: number | string[]): void;
    setIsOpen: (status: boolean) => void;
    selectorPanelItemConfig: SelectorPanelItemConfig;
    setSelectPanelItemConfig(config: SelectorPanelItemConfig): void;
};

const AccountOptions = (props: AccountOptionsProps) => {
    const {
        selectedDomains,
        handleSubmitAccountOptions,
        handleColumnsToggle,
        remaining,
        listUpdating,
        listOfRange,
        setIsOpen,
        setSelectPanelItemConfig,
        selectorPanelItemConfig,
    } = props;
    const { selectedMode, selectedItemIndex } = selectorPanelItemConfig;
    const translate = useTranslation();
    const trackingService = useMultiSelectorPanelTrackingService();

    const submitAccountOptions = (list: OpportunityListType) => {
        handleSubmitAccountOptions(
            list,
            isManuallyMode(selectedMode) ? selectedDomains : listOfRange[selectedItemIndex].value,
        );

        trackingService.trackMultiSelectorSaveToListClick(
            remaining,
            listOfRange[selectedItemIndex],
        );
    };

    const handleClickDomainItem = (amount: number, index: number) => {
        if (isManuallyMode(selectedMode)) {
            handleColumnsToggle(false);
        }
        setSelectPanelItemConfig({
            selectedMode: SelectedMode.FROM_LIST,
            selectedItemIndex: index,
        });
    };

    const handleClickManuallyDomainItem = (index: number) => {
        if (isManuallyMode(selectedMode)) {
            return;
        }
        handleColumnsToggle(true);
        setSelectPanelItemConfig({ selectedMode: SelectedMode.MANUALLY, selectedItemIndex: index });
    };

    const buttonLabel = isManuallyMode(selectedMode)
        ? `${translate("si.multi_selector.button.manually.label")} (${selectedDomains.length})`
        : `${listOfRange[selectedItemIndex].label} ${translate("si.common.websites")}`;

    return (
        <StyledAccountOptions>
            <StyledTitleAccountOptions>
                <TitleOptions name="si.multi_selector.account.title" iconName="star-full" />
            </StyledTitleAccountOptions>
            <SelectDomainsDropdown
                selected={selectedItemIndex}
                handleClickDomainItem={handleClickDomainItem}
                handleClickManuallyDomainItem={handleClickManuallyDomainItem}
                buttonLabel={buttonLabel}
                listOfRange={listOfRange}
                total={remaining}
                bottomText={translate("si.multi_selector.account.dropdown.bottom.label")}
            />
            <StyledOpportunitiesList>
                <AddToListDropdownContainer
                    domains={[]}
                    onDone={(list) => {
                        submitAccountOptions(list);
                    }}
                    renderDropdownButton={() => null}
                    dropdownItemClick={submitAccountOptions}
                    labelCreateBtn={translate("si.common.button.create")}
                />
            </StyledOpportunitiesList>
            <SubmitButton
                tooltipContent={selectWebsitesTooltipText(translate)}
                isLoading={listUpdating}
                onClick={() => setIsOpen(true)}
                label={translate("si.multi_selector.button.select_list.label")}
            />
        </StyledAccountOptions>
    );
};

export default AccountOptions;
