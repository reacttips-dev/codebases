import { View } from "./View";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { compose } from "redux";
import withSWNavigator from "pages/sales-intelligence/hoc/withSWNavigator";
import withSecondaryBarSet from "pages/sales-intelligence/hoc/withSecondaryBarSet";

const KeywordLeads = compose(withSWNavigator, withSecondaryBarSet("SalesIntelligenceFind"))(View);

SWReactRootComponent(KeywordLeads, "KeywordLeads");

export default KeywordLeads;
