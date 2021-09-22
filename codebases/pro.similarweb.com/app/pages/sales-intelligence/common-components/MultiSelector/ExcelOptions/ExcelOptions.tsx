import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledExcelOptions, StyledTitleExcelOptions } from "../styles";
import SubmitButton from "pages/sales-intelligence/common-components/MultiSelector/Buttons/SubmitButton";
import SelectDomainsDropdown from "pages/sales-intelligence/common-components/MultiSelector/Dropdowns/SelectDomainsDropdown";
import { DropdownListItem, SelectedMode } from "../types";
import { useMultiSelectorContext } from "pages/sales-intelligence/context/MultiSelectorContext";
import useMultiSelectorPanelTrackingService from "pages/sales-intelligence/hooks/useMultiSelectorPanelTrackingService";
import { exportWebsitesTooltipText } from "../helpers/tooltips";
import { isManuallyMode } from "../helpers/helpers";
import TitleOptions from "../components/TitleOptions";
import { SelectorPanelItemConfig } from "pages/sales-intelligence/sub-modules/common/types";

type ExcelOptionsProps = {
    remaining: number;
    selectedDomains: string[];
    excelDownloading: boolean;
    listOfRange: DropdownListItem[];
    handleColumnsToggle(visible: boolean): void;
    handleDownloadExcelOptions(domains: number | string[]): void;
    selectorPanelItemConfig: SelectorPanelItemConfig;
    setSelectPanelItemConfig(config: SelectorPanelItemConfig): void;
};

const ExcelOptions: React.FC<ExcelOptionsProps> = (props) => {
    const {
        handleColumnsToggle,
        selectedDomains,
        remaining,
        handleDownloadExcelOptions,
        excelDownloading,
        listOfRange,
        selectorPanelItemConfig,
        setSelectPanelItemConfig,
    } = props;
    const { selectedMode, selectedItemIndex } = selectorPanelItemConfig;
    const translate = useTranslation();
    const { onCloseRightSideBar } = useMultiSelectorContext();
    const trackingService = useMultiSelectorPanelTrackingService();

    const submitExportOptions = () => {
        onCloseRightSideBar();
        handleDownloadExcelOptions(
            isManuallyMode(selectedMode) ? selectedDomains : listOfRange[selectedItemIndex].value,
        );
        trackingService.trackMultiSelectorExportClick(remaining, listOfRange[selectedItemIndex]);
    };

    const handleClickDomainItem = (amount, index) => {
        setSelectPanelItemConfig({
            selectedMode: SelectedMode.FROM_LIST,
            selectedItemIndex: index,
        });
        if (isManuallyMode(selectedMode)) {
            handleColumnsToggle(false);
        }
    };

    const handleClickManuallyDomainItem = (index: number) => {
        if (isManuallyMode(selectedMode)) {
            return;
        }
        handleColumnsToggle(true);
        setSelectPanelItemConfig({
            selectedMode: SelectedMode.MANUALLY,
            selectedItemIndex: index,
        });
    };

    const isDisabledButton = selectedDomains.length === 0 && isManuallyMode(selectedMode);

    const buttonLabel = isManuallyMode(selectedMode)
        ? `${translate("si.multi_selector.button.manually.label")} (${selectedDomains.length})`
        : `${listOfRange[selectedItemIndex].label} ${translate("si.common.websites")}`;

    return (
        <StyledExcelOptions>
            <StyledTitleExcelOptions>
                <TitleOptions name={"si.multi_selector.excel.title"} iconName={"excel"} />
            </StyledTitleExcelOptions>
            <SelectDomainsDropdown
                selected={selectedItemIndex}
                handleClickDomainItem={handleClickDomainItem}
                handleClickManuallyDomainItem={handleClickManuallyDomainItem}
                buttonLabel={buttonLabel}
                listOfRange={listOfRange}
                total={remaining}
                bottomText={translate("si.multi_selector.excel.dropdown.bottom.label")}
            />
            <SubmitButton
                tooltipContent={exportWebsitesTooltipText(translate)}
                isLoading={excelDownloading}
                isDisabled={isDisabledButton}
                onClick={submitExportOptions}
                label={translate("si.common.button.export")}
            />
        </StyledExcelOptions>
    );
};

export default ExcelOptions;
