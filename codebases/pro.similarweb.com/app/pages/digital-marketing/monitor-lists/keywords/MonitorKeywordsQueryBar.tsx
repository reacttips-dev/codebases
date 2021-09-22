import { KeywordsQueryBar } from "components/compare/KeywordsQueryBar/KeywordsQueryBar";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import React from "react";

const MonitorKeywordsQueryBar = (props) => {
    const { showKeywords, queryBarProps, showButtons } = props;
    const queryBarProp = { showKeywords, ...queryBarProps, showButtons };
    return <KeywordsQueryBar {...queryBarProp} />;
};

export default SWReactRootComponent(MonitorKeywordsQueryBar, "MonitorKeywordsQueryBar");
