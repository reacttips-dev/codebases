import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { selectWebsiteData } from "../sub-modules/common/store/selectors";
import {
    fetchSimilarWebsitesThunk,
    fetchWebsiteInfoThunk,
} from "../sub-modules/common/store/effects";

type WithDomain = {
    domain: string;
};

type WrapperProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = <OWN_PROPS extends WithDomain>(state: RootState, props: OWN_PROPS) => ({
    websiteData: selectWebsiteData(state, props),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchWebsiteInfo: fetchWebsiteInfoThunk,
            fetchSimilarWebsites: fetchSimilarWebsitesThunk,
        },
        dispatch,
    );
};

const withWebsiteInfo = (numberOfSimilarSites = 5) => <PROPS extends WrapperProps & WithDomain>(
    Component: React.ComponentType<PROPS>,
) => {
    const WrappedWithWebsiteInfo = (props: WrapperProps & WithDomain) => {
        const { fetchWebsiteInfo, fetchSimilarWebsites, ...rest } = props;

        React.useEffect(() => {
            if (!rest.websiteData) {
                fetchWebsiteInfo(rest.domain);
                fetchSimilarWebsites(rest.domain, numberOfSimilarSites);
            }
        }, [rest.domain]);

        return <Component {...(rest as PROPS)} />;
    };

    return connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WrappedWithWebsiteInfo) as React.ComponentType<
        Omit<PROPS, "fetchWebsiteInfo" | "fetchSimilarWebsites" | "websiteData">
    >;
};

export default withWebsiteInfo;
