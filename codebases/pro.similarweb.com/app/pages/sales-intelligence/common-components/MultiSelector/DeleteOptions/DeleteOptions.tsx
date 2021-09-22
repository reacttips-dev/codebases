import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import SubmitButton from "../Buttons/SubmitButton";
import SelectDomainsDropdown from "../Dropdowns/SelectDomainsDropdown";
import {
    isFromListMode,
    isManuallyMode,
    makePrefixItemLabelWithParentheses,
} from "../helpers/helpers";
import { DropdownListItem, SelectedMode } from "../types";
import { OpportunityListType } from "pages/sales-intelligence/sub-modules/opportunities/types";
import OpportunityListPageContext from "pages/sales-intelligence/pages/opportunity-list/context/OpportunityListPageContext";
import { useMultiSelectorContext } from "pages/sales-intelligence/context/MultiSelectorContext";
import useMultiSelectorPanelTrackingService from "pages/sales-intelligence/hooks/useMultiSelectorPanelTrackingService";
import { removeWebsitesTooltipText } from "pages/sales-intelligence/common-components/MultiSelector/helpers/tooltips";
import { StyledAccountOptions, StyledTitleDeleteOptions } from "../styles";
import TitleOptions from "pages/sales-intelligence/common-components/MultiSelector/components/TitleOptions";
import { SelectorPanelItemConfig } from "pages/sales-intelligence/sub-modules/common/types";

type DeleteOptionsProps = {
    handleColumnsToggle(visible: boolean): void;
    selectedDomains: string[];
    listUpdating: boolean;
    totalDomains: number;
    listOfRange: DropdownListItem[];
    handleRemoveDomains(list: OpportunityListType, domains: string[] | number): void;
    selectorPanelItemConfig: SelectorPanelItemConfig;
    setSelectPanelItemConfig(config: SelectorPanelItemConfig): void;
};

const DeleteOptions = (props: DeleteOptionsProps) => {
    const {
        selectedDomains,
        handleColumnsToggle,
        totalDomains,
        handleRemoveDomains,
        listOfRange,
        listUpdating,
        setSelectPanelItemConfig,
        selectorPanelItemConfig,
    } = props;
    const translate = useTranslation();
    const { list } = React.useContext(OpportunityListPageContext);
    const { onCloseRightSideBar } = useMultiSelectorContext();
    const trackingService = useMultiSelectorPanelTrackingService();
    const { selectedMode, selectedItemIndex } = selectorPanelItemConfig;

    React.useEffect(() => {
        handleColumnsToggle(true);
    }, []);

    const submitDeleteOptions = () => {
        onCloseRightSideBar();
        const domains = isManuallyMode(selectedMode)
            ? selectedDomains
            : listOfRange[selectedItemIndex].value;

        handleRemoveDomains(list, domains);
        /**
         * track event delete
         */
        trackingService.trackMultiSelectorRemoveClick(
            totalDomains,
            Array.isArray(domains) ? domains.length : domains,
        );
    };

    const onClickDomainItem = (amount: number, index: number) => {
        setSelectPanelItemConfig({
            selectedMode: SelectedMode.FROM_LIST,
            selectedItemIndex: index,
        });
        if (isManuallyMode(selectedMode)) {
            handleColumnsToggle(false);
        }
    };

    const onClickManuallyDomainItem = (index: number) => {
        if (isManuallyMode(selectedMode)) {
            return;
        }
        setSelectPanelItemConfig({
            selectedMode: SelectedMode.MANUALLY,
            selectedItemIndex: index,
        });
        handleColumnsToggle(true);
    };

    const isDisabledButton = selectedDomains.length === 0 && isManuallyMode(selectedMode);

    const buttonLabel = isFromListMode(selectedMode)
        ? makePrefixItemLabelWithParentheses(translate("si.multi_selector.button.all_leads.label"))(
              totalDomains,
          )
        : makePrefixItemLabelWithParentheses(translate("si.multi_selector.button.manually.label"))(
              selectedDomains.length,
          );

    return (
        <StyledAccountOptions>
            <StyledTitleDeleteOptions>
                <TitleOptions name={"si.multi_selector.remove.title"} iconName={"delete"} />
            </StyledTitleDeleteOptions>
            <SelectDomainsDropdown
                selected={selectedItemIndex}
                handleClickDomainItem={onClickDomainItem}
                handleClickManuallyDomainItem={onClickManuallyDomainItem}
                buttonLabel={buttonLabel}
                listOfRange={listOfRange}
                hideDropdownBottom={true}
                total={totalDomains}
            />
            <SubmitButton
                tooltipContent={removeWebsitesTooltipText(translate)}
                isLoading={listUpdating}
                isDisabled={isDisabledButton}
                onClick={submitDeleteOptions}
                label={translate("si.multi_selector.button.remove.label")}
            />
        </StyledAccountOptions>
    );
};

export default DeleteOptions;
