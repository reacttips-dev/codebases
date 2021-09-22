import React, { ReactChild } from "react";
import { ULTIMATE_LIMIT } from "../constans";
import {
    getDeleteTooltipText,
    excelTooltipText,
    getExcelStarterProspectPackageTooltipText,
    getExcelUltimatePackageTooltipText,
    getAccountDisabledTooltipText,
    getAccountTooltipText,
} from "./tooltips";

export const getMultiSelectorTooltips = (
    isDisabledExcel: boolean,
    excelQuota: number,
    isDisabledAccount: boolean,
    translate: (key: string) => string,
): (string | ReactChild)[] => {
    const accountTooltip = () => {
        return isDisabledAccount
            ? getAccountDisabledTooltipText(translate)
            : getAccountTooltipText(translate);
    };

    const excelTooltip = () => {
        if (excelQuota === 0) {
            return null;
        }

        if (isDisabledExcel) {
            return ULTIMATE_LIMIT > excelQuota
                ? getExcelUltimatePackageTooltipText(translate)
                : getExcelStarterProspectPackageTooltipText(excelQuota, translate);
        }

        return excelTooltipText(translate);
    };

    const deleteTooltip = () => getDeleteTooltipText(translate);

    return [accountTooltip(), excelTooltip(), deleteTooltip()];
};
