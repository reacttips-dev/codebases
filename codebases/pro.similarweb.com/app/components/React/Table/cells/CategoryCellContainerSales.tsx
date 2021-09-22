import React from "react";
import { compose } from "redux";
import { CategoryCell } from "components/React/Table/cells/CategoryCell";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";
import { connect } from "react-redux";
import { ITableCellProps } from "components/React/Table/interfaces/ITableCellProps";

type ParamsType = {
    key: string;
    isWWW: string;
    country: string;
    duration: string;
    webSource: string;
};

const CategoryCellContainerInner: React.FC<CategoryCellContainerSalesProps> = ({
    routingParams,
    navigator,
    params,
}) => {
    const { value, row } = params;
    const linkParams = { referralsCategory: value, ...routingParams };

    const link = (state, params) => navigator.href(state, params);

    row.href = link("accountreview_website_referrals_incomingtraffic", linkParams).replace(
        "///",
        "",
    );
    return <CategoryCell {...params} />;
};

const mapStateToProps = (
    { routing: { params } }: { routing: { params: ParamsType } },
    ownProps: ITableCellProps,
) => {
    return {
        routingParams: {
            ...params,
        },
        params: ownProps,
    };
};

export const CategoryCellContainerSales = compose(
    connect(mapStateToProps),
    withSWNavigator,
)(CategoryCellContainerInner);

export type CategoryCellContainerSalesProps = ReturnType<typeof mapStateToProps> &
    WithSWNavigatorProps;
