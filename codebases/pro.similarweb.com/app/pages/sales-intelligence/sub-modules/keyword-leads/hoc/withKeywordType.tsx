import React from "react";
import { WithSWNavigatorProps } from "pages/sales-intelligence/hoc/withSWNavigator";

const keywordTables: string[] = ["total", "paid", "organic", "mobile"];

type keywordsType = keyof typeof keywordTables;

export const withKeywordTypeFromUrl = <
    PROPS extends WithSWNavigatorProps & { trafficType: keywordsType }
>(
    Component: typeof React.Component,
) => {
    return function WrappedWithKeywordTypeFromUrl(props: WithSWNavigatorProps) {
        const { navigator } = props;
        const { url } = navigator.current();
        const trafficType = (url as string).split("/")[1];

        return <Component {...(props as PROPS)} keywordType={trafficType} />;
    };
};
