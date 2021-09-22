import React from "react";
import { StylesInitialMultiSelector } from "pages/sales-intelligence/common-components/MultiSelector/styles";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { getMultiSelectorTooltips } from "../helpers/helpersTooltips";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import withUserLeadsQuota, { UserLeadsLimitType } from "../../../hoc/withUserLeadsQuota";
import ExcelButton from "../Buttons/ExcelButtons";
import RemoveButton from "pages/sales-intelligence/common-components/MultiSelector/Buttons/RemoveButton";
import AccountButton from "../Buttons/AccountButton";

type InitialMultiSelectorResultProps = {
    handleClick(value: TypeOfSelectors): void;
    disableButtonAccount: boolean;
    disableButtonExcel: boolean;
    initialState: TypeOfSelectors[];
};

const InitialStateMultiSelector: React.FC<InitialMultiSelectorResultProps & UserLeadsLimitType> = ({
    handleClick,
    disableButtonAccount,
    disableButtonExcel,
    usedLeadsLimit,
    quotaLimit,
    initialState,
    excelQuota,
    isExcelQuotaLoading,
}) => {
    const translate = useTranslation();
    const isDisabledAccount = quotaLimit - usedLeadsLimit === 0 ? true : false;
    const isDisabledExcel = excelQuota.remaining === 0 || isExcelQuotaLoading;

    const [accountTooltip, excelTooltip, deleteTooltip] = getMultiSelectorTooltips(
        isDisabledExcel,
        excelQuota.total,
        isDisabledAccount,
        translate,
    );

    const listOfButtons = initialState.map((name) => {
        switch (name) {
            case TypeOfSelectors.ACCOUNT:
                return (
                    <AccountButton
                        key={"account"}
                        tooltip={accountTooltip}
                        isDisabled={isDisabledAccount || disableButtonAccount}
                        onClick={() => handleClick(TypeOfSelectors.ACCOUNT)}
                    />
                );
            case TypeOfSelectors.EXCEL:
                return (
                    <ExcelButton
                        key={"excel"}
                        tooltip={excelTooltip}
                        isDisabled={isDisabledExcel || disableButtonExcel}
                        onClick={() => handleClick(TypeOfSelectors.EXCEL)}
                    />
                );

            case TypeOfSelectors.DELETE:
                return (
                    <RemoveButton
                        key={"remove"}
                        tooltip={deleteTooltip}
                        onClick={() => handleClick(TypeOfSelectors.DELETE)}
                    />
                );
        }
    });

    return <StylesInitialMultiSelector>{listOfButtons}</StylesInitialMultiSelector>;
};

export default withUserLeadsQuota(InitialStateMultiSelector);
