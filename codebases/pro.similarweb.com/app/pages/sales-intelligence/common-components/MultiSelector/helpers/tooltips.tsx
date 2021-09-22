import { StyledTitleOverLimitSubscription } from "pages/sales-intelligence/common-components/MultiSelector/styles";
import React, { ReactChild } from "react";

// Account
export const getAccountDisabledTooltipText = (translate: (key: string) => string) => {
    return (
        <>
            <StyledTitleOverLimitSubscription>
                {translate("si.multi_selector.tooltip.account.quota.title")}
            </StyledTitleOverLimitSubscription>
            <div>{translate("si.multi_selector.tooltip.account.quota.sub_title")}</div>
        </>
    );
};

export const getAccountTooltipText = (translate: (key: string) => string) =>
    translate("si.multi_selector.tooltip.account");

// Delete
export const getDeleteTooltipText = (translate: (key: string) => string): string =>
    translate("si.multi_selector.tooltip.remove");

// Excel
export const getExcelUltimatePackageTooltipText = (
    translate: (key: string) => string,
): ReactChild => {
    return (
        <>
            <StyledTitleOverLimitSubscription>
                {translate("si.multi_selector.tooltip.excel.ultimate_package_quota.title")}
            </StyledTitleOverLimitSubscription>
            <div>
                {translate("si.multi_selector.tooltip.excel.ultimate_package_quota.sub_title")}
            </div>
        </>
    );
};

export const getExcelStarterProspectPackageTooltipText = (
    excelQuota: number,
    translate: (key: string, values) => string,
): string =>
    translate("si.multi_selector.tooltip.excel.starter_prospect_package_quota", { excelQuota });

export const excelTooltipText = (translate: (key: string) => string) =>
    translate("si.multi_selector.tooltip.excel");

// Save Button
export const selectListTooltipText = (translate: (key: string) => string) =>
    translate("si.multi_selector.tooltip.account.unselected_list");

// Save Button
export const selectWebsitesTooltipText = (translate: (key: string) => string) =>
    translate("si.multi_selector.tooltip.account.unselected_domains");

// Export Button
export const exportWebsitesTooltipText = (translate: (key: string) => string) =>
    translate("si.multi_selector.tooltip.excel.unselected_domains");

// Remove Button
export const removeWebsitesTooltipText = (translate: (key: string) => string) =>
    translate("si.multi_selector.tooltip.remove.unselected_domains");
