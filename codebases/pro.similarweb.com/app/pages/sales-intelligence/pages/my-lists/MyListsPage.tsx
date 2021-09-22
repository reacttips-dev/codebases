import React from "react";
import * as styles from "./styles";
import ListNotFoundModalContainer from "../../common-components/modals/ListNotFoundModal/ListNotFoundModalContainer";
import MyListsPageHeader from "./components/MyListsPageHeader/MyListsPageHeader";
import SavedSearchesListContainer from "../../sub-modules/saved-searches/components/SavedSearchesList/SavedSearchesListContainer";
import OpportunitiesListContainer from "../../sub-modules/opportunities/components/OpportunitiesList/OpportunitiesListContainer";

const MyListsPage = () => {
    return (
        <styles.StyledMyListsPageContainer>
            <styles.MyListsPageInnerContainer>
                <ListNotFoundModalContainer />
                <MyListsPageHeader />
                <styles.StyledMyListsSection>
                    <OpportunitiesListContainer />
                    <SavedSearchesListContainer />
                </styles.StyledMyListsSection>
            </styles.MyListsPageInnerContainer>
        </styles.StyledMyListsPageContainer>
    );
};

export default MyListsPage;
