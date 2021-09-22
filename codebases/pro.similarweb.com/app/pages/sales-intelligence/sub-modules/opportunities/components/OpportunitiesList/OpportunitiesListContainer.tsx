import React, { useEffect } from "react";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";
import { OpportunityListType } from "../../types";
import { STATIC_LIST_PAGE_ROUTE } from "../../../../constants/routes";
import useTargetAccountsTrackingService from "../../../../hooks/useTargetAccountsTrackingService";
import AddListButton from "pages/sales-intelligence/pages/my-lists/components/AddListButton/AddListButton";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { selectAllUniqueWebsites, selectSortedOpportunityLists } from "../../store/selectors";
import {
    setSelectedOpportunityListNameAndIdAction,
    toggleOpportunityListModal,
} from "../../store/action-creators";
import { selectLegacyWorkspacesFetching } from "../../../common/store/selectors";
import ListsSectionLoader from "pages/sales-intelligence/pages/my-lists/components/ListsSection/ListsSectionLoader";
import OpportunitiesList from "./OpportunitiesList";
import OpportunitiesListEmpty from "../OpportunitiesListEmpty/OpportunitiesListEmpty";

type OpportunitiesListContainerProps = WithSWNavigatorProps &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

const OpportunitiesListContainer = (props: OpportunitiesListContainerProps) => {
    const translate = useTranslation();
    const trackingService = useTargetAccountsTrackingService();
    const {
        navigator,
        isLoading,
        opportunityLists,
        allUniqueOpportunities,
        toggleOpportunityListModal,
        setSelectedListNameAndId,
    } = props;

    const handleItemClick = (item: OpportunityListType) => {
        setSelectedListNameAndId({
            opportunityListId: item.opportunityListId,
            opportunityListName: item.friendlyName,
        });
        trackingService.trackStaticListClicked(item.opportunities.length);
        navigator.go(STATIC_LIST_PAGE_ROUTE, { id: item.opportunityListId });
    };

    const handleAddButtonClick = () => {
        trackingService.trackAddListClicked(allUniqueOpportunities.length);
        toggleOpportunityListModal(true);
    };

    const renderAddListButton = () => {
        return <AddListButton onClick={handleAddButtonClick} />;
    };

    if (isLoading && opportunityLists.length === 0) {
        return <ListsSectionLoader />;
    }

    if (opportunityLists.length === 0) {
        return (
            <OpportunitiesListEmpty
                name={translate("si.pages.my_lists.section.opportunity_lists.title")}
                renderAddListButton={renderAddListButton}
            />
        );
    }

    return (
        <OpportunitiesList
            sectionName={translate("si.pages.my_lists.section.opportunity_lists.title")}
            onItemClick={handleItemClick}
            opportunityLists={opportunityLists}
            renderAddButton={renderAddListButton}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    allUniqueOpportunities: selectAllUniqueWebsites(state),
    opportunityLists: selectSortedOpportunityLists(state),
    isLoading: selectLegacyWorkspacesFetching(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            toggleOpportunityListModal,
            setSelectedListNameAndId: setSelectedOpportunityListNameAndIdAction,
        },
        dispatch,
    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withSWNavigator,
)(OpportunitiesListContainer) as React.FC;
