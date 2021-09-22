import React from "react";
import { WithSWNavigatorProps } from "pages/sales-intelligence/hoc/withSWNavigator";
import {
    IndustryTables,
    mapIndustryTables,
} from "pages/sales-intelligence/pages/find-leads/components/IndustryLeads/IndustyResult/configs/allConfigs";

export const withMatchIndustryTables = <PROPS extends WithSWNavigatorProps>(
    Component: React.ComponentType<PROPS & WithMatchIndustryTablesProps>,
) => {
    return function WrappedWithIndustryResultTable(props: WithSWNavigatorProps) {
        const { navigator } = props;
        const { url } = navigator.current();
        const tableName =
            mapIndustryTables[(url as string).split("/")[1]] || IndustryTables.TopWebsites;

        return <Component {...(props as PROPS)} table={tableName} />;
    };
};

export type WithMatchIndustryTablesProps = {
    table: string;
};

export default withMatchIndustryTables;
