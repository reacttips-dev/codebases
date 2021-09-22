import React from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";

import { connect } from "react-redux";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { AmazonKeywordGeneratorTables } from "pages/keyword-analysis/amazon-keyword-generator/AmazonKeywordGeneratorTables";

enum ETabs {
    PHRASE_MATCH,
    RELATED_KEYWORDS,
}

const AmazonKeywordGeneratorResultsPage = (props) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const onTabSelect = (index: ETabs): void => {
        swNavigator.updateParams({ selectedTab: index });
    };

    return (
        <AmazonKeywordGeneratorTables
            {...props}
            selectedTab={props.params.selectedTab}
            onTabSelect={onTabSelect}
        ></AmazonKeywordGeneratorTables>
    );
};

const mapStateToProps = ({ routing }) => {
    const { params } = routing;
    return {
        params,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {};
};
const connected = connect(mapStateToProps, mapDispatchToProps)(AmazonKeywordGeneratorResultsPage);

export default SWReactRootComponent(connected, "AmazonKeywordGeneratorResultsPage");
