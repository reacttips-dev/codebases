import React from "react";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import { ExcelQuota } from "pages/sales-intelligence/sub-modules/common/types";

const useGetLeadsLimitQuotaLimit = (
    activePanel: TypeOfSelectors,
    usedLeadsLimit: number,
    excelQuota: ExcelQuota,
): [number, number] => {
    const leadsLimit = useSalesSettingsHelper().getQuotaLimit();

    const quotaLimit = React.useMemo(() => {
        return activePanel === TypeOfSelectors.ACCOUNT
            ? leadsLimit - usedLeadsLimit
            : excelQuota.remaining;
    }, [leadsLimit, usedLeadsLimit, excelQuota.remaining]);

    return [leadsLimit, quotaLimit];
};

export default useGetLeadsLimitQuotaLimit;
