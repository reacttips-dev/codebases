import React from "react";
import { RootState } from "store/types";
import { connect } from "react-redux";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import { selectAllUniqueWebsites } from "pages/sales-intelligence/sub-modules/opportunities/store/selectors";
import {
    selectExcelQuota,
    selectIsExcelQuotaLoading,
} from "pages/sales-intelligence/sub-modules/common/store/selectors";

export type QuotaLimitProps = {
    quotaLimit: number;
};

const mapStateToProps = (state: RootState) => ({
    isExcelQuotaLoading: selectIsExcelQuotaLoading(state),
    usedLeadsLimit: selectAllUniqueWebsites(state).length,
    excelQuota: selectExcelQuota(state),
});

const withUserLeadsQuota = <PROPS extends {}>(Component: React.ComponentType<PROPS>) => {
    function WrappedWithUserQuota(props: PROPS & WithUserQuotaProps) {
        const quotaLimit = useSalesSettingsHelper().getQuotaLimit();

        return <Component {...(props as PROPS)} quotaLimit={quotaLimit} />;
    }

    return connect(mapStateToProps)(WrappedWithUserQuota);
};

export type WithUserQuotaProps = ReturnType<typeof mapStateToProps>;

export type UserLeadsLimitType = WithUserQuotaProps & QuotaLimitProps;

export default withUserLeadsQuota;
