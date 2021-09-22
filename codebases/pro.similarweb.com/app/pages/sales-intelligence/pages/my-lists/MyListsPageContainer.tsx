import { compose } from "redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import withLegacyWorkspacesFetch from "../../hoc/withLegacyWorkspacesFetch";
import MyListsPage from "./MyListsPage";
import withSecondaryBarSet from "../../hoc/withSecondaryBarSet";

const MyListsPageContainer = compose(
    withLegacyWorkspacesFetch,
    withSecondaryBarSet("SalesIntelligenceLists"),
)(MyListsPage);

SWReactRootComponent(MyListsPageContainer, "MyListsPageContainer");

export default MyListsPageContainer;
