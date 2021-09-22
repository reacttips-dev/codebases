import { compose } from "redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import withSecondaryBarSet from "../../hoc/withSecondaryBarSet";
import withSWNavigator, { WithSWNavigatorProps } from "../../hoc/withSWNavigator";
import FindLeadsPage from "./FindLeadsPage";

const FindLeadsPageContainer = compose(
    withSecondaryBarSet("SalesIntelligenceFind"),
    withSWNavigator,
)(FindLeadsPage);

SWReactRootComponent(FindLeadsPageContainer, "FindLeadsPageContainer");

export type FindLeadsPageContainerProps = WithSWNavigatorProps;
export default FindLeadsPageContainer;
