import { connect } from "react-redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { YoutubeKeywordGeneratorTables } from "./YoutubeKeywordGeneratorTables";
import YoutubeKeywordGeneratorChart from "./YoutubeKeywordGeneratorChart";
import { ETabs } from "./constants";

const YoutubeKeywordGeneratorResultsPage = ({ params }) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const onTabSelect = (index: ETabs): void => {
        swNavigator.updateParams({ selectedTab: index });
    };

    return (
        <>
            <YoutubeKeywordGeneratorChart />
            <YoutubeKeywordGeneratorTables
                {...params}
                selectedTab={params.selectedTab}
                onTabSelect={onTabSelect}
            ></YoutubeKeywordGeneratorTables>
        </>
    );
};

const mapStateToProps = ({ routing }) => {
    const { params } = routing;
    return {
        params,
    };
};

const connected = connect(mapStateToProps)(YoutubeKeywordGeneratorResultsPage);

export default SWReactRootComponent(connected, "YoutubeKeywordGeneratorResultsPage");
