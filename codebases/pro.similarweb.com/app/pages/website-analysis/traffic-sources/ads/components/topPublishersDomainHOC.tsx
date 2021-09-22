import React from "react";
import { WebsiteTooltipTopCell } from "components/React/Table/cells";
import { Injector } from "common/ioc/Injector";
const TopPublishersDomainHOC = (props) => {
    const swNavigator = Injector.get("swNavigator") as any;
    const { row } = props;
    const rowWithInternalUrl = {
        ...row,
        url: swNavigator.href(swNavigator.current(), {
            ...swNavigator.getParams(),
            key: row.Domain,
        }),
    };

    return <WebsiteTooltipTopCell {...props} row={rowWithInternalUrl} />;
};
export default TopPublishersDomainHOC;
