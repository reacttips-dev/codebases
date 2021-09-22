import React from "react";
import { connect } from "react-redux";
import { RootState } from "store/types";
import { NotSavedSearchType } from "../types";
import { selectReportResult } from "../store/selectors";
import { WithSWNavigatorProps } from "../../../hoc/withSWNavigator";
import { WithFallbackRouteProps } from "../../../hoc/withFallbackRoute";
import { createNotSavedSearch, isReportResultValid } from "../helpers";

const mapStateToProps = (state: RootState) => ({
    reportResult: selectReportResult(state),
});

const withReportResultGuard = (
    Component: React.ComponentType<{ searchObject: NotSavedSearchType }>,
) => {
    const WrappedWithReportResultGuard = (
        props: WithSWNavigatorProps & WithFallbackRouteProps & ReturnType<typeof mapStateToProps>,
    ) => {
        const { fallbackRoute, reportResult, navigator } = props;
        const reportValid = isReportResultValid(reportResult);

        React.useEffect(() => {
            if (!reportValid) {
                navigator.go(fallbackRoute, {}, { location: "replace" });
            }
        }, []);

        if (!reportValid) {
            return null;
        }

        return <Component searchObject={createNotSavedSearch(reportResult)} />;
    };

    return connect(mapStateToProps, null)(WrappedWithReportResultGuard);
};

export default withReportResultGuard;
