import { ULTIMATE_LIMIT } from "pages/sales-intelligence/common-components/MultiSelector/constans";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import React from "react";

export const getAccountQuotaModalInfo = (
    quota: number,
    translate: (key: string, value?: Record<string, any>) => string,
) => {
    return {
        title: translate("si.multi_selector.quota_limit.account.title"),
        contentText: translate("si.multi_selector.quota_limit.account.content", { quota }),
    };
};

export const getExcelStarterProspectPackageQuotaModalInfo = (
    quota: number,
    translate: (key: string, value?: Record<string, any>) => string,
) => {
    return {
        title: translate("si.multi_selector.quota_limit.excel.starter_prospect_packages.title"),
        contentText: (
            <>
                {translate(
                    "si.multi_selector.quota_limit.excel.starter_prospect_packages.content.title",
                    { quota },
                )}
                <div>
                    {translate(
                        "si.multi_selector.quota_limit.excel.starter_prospect_packages.content.sub_title",
                        { quota: ULTIMATE_LIMIT },
                    )}
                </div>
            </>
        ),
    };
};

export const getExcelUltimatePackageQuotaModalInfo = (
    quota: number,
    translate: (key: string, values?: Record<string, any>) => string,
) => {
    return {
        title: translate("si.multi_selector.quota_limit.excel.ultimate_packages.title"),
        contentText: translate("si.multi_selector.quota_limit.excel.ultimate_packages.content", {
            quota,
        }),
    };
};

export const getQuotaModalInfo = (
    activePanel: TypeOfSelectors,
    excelQuota: number,
    accountQuota: number,
    translate: (key: string) => string,
): { title: string; contentText: string | React.ReactChild } => {
    const getExcelInfoQuotaModal = () =>
        excelQuota < ULTIMATE_LIMIT
            ? getExcelStarterProspectPackageQuotaModalInfo(excelQuota, translate)
            : getExcelUltimatePackageQuotaModalInfo(excelQuota, translate);

    return activePanel === TypeOfSelectors.ACCOUNT
        ? getAccountQuotaModalInfo(accountQuota, translate)
        : getExcelInfoQuotaModal();
};
