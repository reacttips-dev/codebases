import { compose } from "redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import withSecondaryBarSet from "../../../../hoc/withSecondaryBarSet";
import withSWNavigator from "../../../../hoc/withSWNavigator";
import CompetitorCustomersStartPage from "./CompetitorCustomersStartPage";

const CompetitorCustomersStartPageContainer = compose(
    withSecondaryBarSet("SalesIntelligenceFind"),
    withSWNavigator,
)(CompetitorCustomersStartPage);

SWReactRootComponent(
    CompetitorCustomersStartPageContainer,
    "CompetitorCustomersStartPageContainer",
);

export default CompetitorCustomersStartPageContainer;
