import React from "react";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { CategoryCell } from "components/React/Table/cells/CategoryCell";
import { connect } from "react-redux";

const CategoryCellContainerInner = (props) => {
    const { routingParams } = props;
    const { value, row } = props.params;
    const linkParams = { referralsCategory: value, ...routingParams };
    const link = (state, params) => Injector.get<SwNavigator>("swNavigator").href(state, params);
    row.href = link("websites-trafficReferrals", linkParams).replace("///", "");
    return <CategoryCell {...props.params} />;
};

const mapStateToProps = ({ routing: { params } }, ownProps) => {
    return {
        routingParams: {
            ...params,
        },
        params: ownProps,
    };
};

export const CategoryCellContainer = connect(mapStateToProps)(CategoryCellContainerInner);
