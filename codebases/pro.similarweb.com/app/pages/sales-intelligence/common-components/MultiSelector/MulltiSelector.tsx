import React from "react";
import ActiveStateMultiSelector from "./MultiSelectorStates/ActiveStateMultiSelector";
import InitialStateMultiSelector from "./MultiSelectorStates/InitialStateMultiSelector";
import { OpportunityListType } from "pages/sales-intelligence/sub-modules/opportunities/types";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import withMultiSelectorRightSideBarContainer, {
    MultiSelectorContainerProps,
} from "pages/sales-intelligence/hoc/withMultiSelectorRightSideBarContainer";
import { useMultiSelectorContext } from "pages/sales-intelligence/context/MultiSelectorContext";

type MultiSelectorProps = {
    handleColumnsToggle(visible: boolean): void;
    tableSelectionKey: string;
    tableSelectionProperty: string;
    totalCount?: number;
    excelDownloading?: boolean;
    disableButtonExcel?: boolean;
    disableButtonAccount?: boolean;
    handleDownloadExcel(domains: number | string[], search?: string): void;
    handleSubmitAccount?: (
        opportunitiesList: OpportunityListType,
        domains: string[] | number,
        search?: string,
    ) => void;
    initialState: TypeOfSelectors[];
};

const MultiSelector: React.FC<MultiSelectorProps & MultiSelectorContainerProps> = (props) => {
    const {
        handleColumnsToggle,
        tableSelectionKey,
        tableSelectionProperty,
        totalCount,
        handleSubmitAccount,
        handleDownloadExcel,
        excelDownloading,
        disableButtonExcel,
        disableButtonAccount,
        initialState,
        toggleMultiSelectorPanel,
        activePanel,
        excelQuota,
        fetchExcelQuota,
    } = props;
    const { onCloseRightSideBar } = useMultiSelectorContext();

    React.useEffect(() => {
        if (excelQuota.total === 0 && excelQuota.used === 0) {
            fetchExcelQuota();
        }
        return () => {
            onCloseRightSideBar();
        };
    }, []);

    const renderContent = () => {
        if (activePanel) {
            return (
                <ActiveStateMultiSelector
                    excelDownloading={excelDownloading}
                    handleDownloadExcel={handleDownloadExcel}
                    handleSubmitAccount={handleSubmitAccount}
                    totalCount={totalCount}
                    active={activePanel}
                    toggleStatus={toggleMultiSelectorPanel}
                    handleColumnsToggle={handleColumnsToggle}
                    tableSelectionKey={tableSelectionKey}
                    tableSelectionProperty={tableSelectionProperty}
                />
            );
        }

        return (
            <InitialStateMultiSelector
                initialState={initialState}
                handleClick={toggleMultiSelectorPanel}
                disableButtonExcel={disableButtonExcel}
                disableButtonAccount={disableButtonAccount}
            />
        );
    };

    return <>{renderContent()}</>;
};

export default withMultiSelectorRightSideBarContainer(MultiSelector);
