import React from "react";
import { connect } from "react-redux";
import { RootState } from "store/types";
import { selectAllUniqueWebsites } from "../../../sub-modules/opportunities/store/selectors";
import Quota from "./Quota";

/**
 * @param state
 */
const mapStateToProps = (state: RootState) => ({
    allUniqueWebsites: selectAllUniqueWebsites(state),
});

const QuotaContainer: React.FC<QuotaContainerProps> = (props) => {
    const { allUniqueWebsites } = props;

    if (allUniqueWebsites.length === 0) {
        return null;
    }

    return <Quota allUniqueWebsites={allUniqueWebsites} />;
};

const ConnectedQuotaContainer = connect(mapStateToProps, null)(QuotaContainer);

export type QuotaContainerProps = ReturnType<typeof mapStateToProps>;
export default ConnectedQuotaContainer;
