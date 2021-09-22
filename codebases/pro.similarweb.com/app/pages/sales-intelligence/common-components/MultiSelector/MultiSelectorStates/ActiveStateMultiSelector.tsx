import React from "react";
import { compose } from "redux";
import {
    StyledActiveMultiSelector,
    StyledCloseButton,
} from "pages/sales-intelligence/common-components/MultiSelector/styles";
import AccountOptions from "pages/sales-intelligence/common-components/MultiSelector/AccountOptions/AccountOptions";
import ExcelOptions from "pages/sales-intelligence/common-components/MultiSelector/ExcelOptions/ExcelOptions";
import { SWReactIcons } from "@similarweb/icons";
import { withSelectTableOptions } from "pages/sales-intelligence/hoc/withSelectionTableOptions";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { usePrevious } from "components/hooks/usePrevious";
import { SWReactTableWrapperContext } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { OpportunityListType } from "pages/sales-intelligence/sub-modules/opportunities/types";
import { WithSelectionTableOptionsProps } from "../../../hoc/withSelectionTableOptions";
import DeleteOptions from "pages/sales-intelligence/common-components/MultiSelector/DeleteOptions/DeleteOptions";
import withUserLeadsQuota, { UserLeadsLimitType } from "../../../hoc/withUserLeadsQuota";
import { generateListItemsMultiSelectorStates } from "../helpers/helpers";
import useMultiSelectorPanelTrackingService from "pages/sales-intelligence/hooks/useMultiSelectorPanelTrackingService";

type ActiveMultiSelectorProps = {
    active: TypeOfSelectors;
    toggleStatus(status: null | TypeOfSelectors): void;
    selectedDomains: string[];
    clearAllSelectedRows(): void;
    listUpdating: boolean;
    excelDownloading: boolean;
    totalCount: number;
    handleColumnsToggle(visible: boolean): void;
    handleDownloadExcel(domains: number | string[], search?: string): void;
    handleSubmitAccount(
        opportunitiesList: OpportunityListType,
        domains: string[] | number,
        search?: string,
    ): void;
};

const ActiveStateMultiSelector: React.FC<
    ActiveMultiSelectorProps & WithSelectionTableOptionsProps & UserLeadsLimitType
> = ({
    toggleStatus,
    active,
    handleColumnsToggle,
    selectedDomains,
    clearAllSelectedRows,
    listUpdating,
    totalCount,
    handleSubmitAccount,
    handleDownloadExcel,
    excelDownloading,
    usedLeadsLimit,
    quotaLimit,
    removeOpportunitiesFromList,
    setSelectPanelItemByDefaultConfig,
    selectorPanelItemConfig,
    setSelectPanelItemConfig,
    excelQuota,
    setIsOpen,
}) => {
    const translate = useTranslation();
    const prevExcelDownloading = usePrevious(excelDownloading);
    /**
     * textFilter is used for lead generation table;
     */
    const { totalRecord, textFilter } = React.useContext(SWReactTableWrapperContext);
    const trackingService = useMultiSelectorPanelTrackingService();
    const accountRemaining = quotaLimit - usedLeadsLimit;

    const closeActivePanel = () => {
        toggleStatus(null);
        setSelectPanelItemByDefaultConfig();
        handleColumnsToggle(false);
        clearAllSelectedRows();
    };
    /**
     * close panel after excel file is downloaded
     */
    React.useEffect(() => {
        if (
            typeof prevExcelDownloading !== "undefined" &&
            prevExcelDownloading &&
            !excelDownloading
        ) {
            closeActivePanel();
        }
    }, [excelDownloading]);
    /**
     * track active panel
     */
    React.useEffect(() => {
        trackingService.trackMultiSelectorOpen(active);
    }, []);
    /**
     * totalCount: get from outside;
     * totalRecord: get from table api from hoc withSelection;
     */
    const [listExcel, listDelete, listAccount] = generateListItemsMultiSelectorStates(
        totalCount || totalRecord,
        accountRemaining,
        excelQuota.remaining,
        selectedDomains.length,
        translate,
    );

    const handleSubmitAccountOptions = (selectedOpportunitiesList, domains: number | string[]) => {
        handleSubmitAccount(selectedOpportunitiesList, domains, textFilter);
        closeActivePanel();
    };

    const handleSubmitExcelOptions = (domains: number | string[]) => {
        handleDownloadExcel(domains, textFilter);
    };

    const handleRemoveDomains = (list: OpportunityListType, domains: number | string[]) => {
        removeOpportunitiesFromList(list, domains);
        closeActivePanel();
    };

    const renderActiveOptions = () => {
        if (active === TypeOfSelectors.ACCOUNT) {
            return (
                <AccountOptions
                    handleColumnsToggle={handleColumnsToggle}
                    selectedDomains={selectedDomains}
                    handleSubmitAccountOptions={handleSubmitAccountOptions}
                    listUpdating={listUpdating}
                    remaining={accountRemaining}
                    listOfRange={listAccount}
                    setIsOpen={setIsOpen}
                    selectorPanelItemConfig={selectorPanelItemConfig}
                    setSelectPanelItemConfig={setSelectPanelItemConfig}
                />
            );
        }

        if (active === TypeOfSelectors.EXCEL) {
            return (
                <ExcelOptions
                    excelDownloading={excelDownloading}
                    handleColumnsToggle={handleColumnsToggle}
                    selectedDomains={selectedDomains}
                    handleDownloadExcelOptions={handleSubmitExcelOptions}
                    remaining={excelQuota.remaining}
                    listOfRange={listExcel}
                    selectorPanelItemConfig={selectorPanelItemConfig}
                    setSelectPanelItemConfig={setSelectPanelItemConfig}
                />
            );
        }

        return (
            <DeleteOptions
                handleColumnsToggle={handleColumnsToggle}
                selectedDomains={selectedDomains}
                handleRemoveDomains={handleRemoveDomains}
                listUpdating={listUpdating}
                totalDomains={totalCount}
                listOfRange={listDelete}
                selectorPanelItemConfig={selectorPanelItemConfig}
                setSelectPanelItemConfig={setSelectPanelItemConfig}
            />
        );
    };

    const onClickCloseButton = () => {
        trackingService.trackMultiSelectorClose(active);
        closeActivePanel();
    };

    return (
        <StyledActiveMultiSelector>
            {renderActiveOptions()}
            <StyledCloseButton onClick={onClickCloseButton}>
                <SWReactIcons iconName="close" iconSize="xs" />
            </StyledCloseButton>
        </StyledActiveMultiSelector>
    );
};

export default compose(withSelectTableOptions, withUserLeadsQuota)(ActiveStateMultiSelector);
