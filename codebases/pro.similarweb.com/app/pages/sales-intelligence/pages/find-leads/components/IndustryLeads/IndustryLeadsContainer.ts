import { IndustryLeadsComponent } from "./IndustryLeadsComponent";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { compose } from "redux";
import withSecondaryBarSet from "../../../../hoc/withSecondaryBarSet";
import withSWNavigator from "../../../../hoc/withSWNavigator";

const IndustryLeads = compose(
    withSWNavigator,
    withSecondaryBarSet("SalesIntelligenceFind"),
)(IndustryLeadsComponent);

SWReactRootComponent(IndustryLeads, "IndustryLeads");

export default IndustryLeads;
