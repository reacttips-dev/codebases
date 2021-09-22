import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import FiltersPanelContainer from "../FiltersPanel/FiltersPanelContainer";
import { FIND_LEADS_PAGE_ROUTE } from "pages/sales-intelligence/constants/routes";
import AdvancedSearchSidebar from "../AdvancedSearchSidebar/AdvancedSearchSidebar";
import { WithSWNavigatorProps } from "pages/sales-intelligence/hoc/withSWNavigator";
import TransitionedResultsSection from "../TransitionedResultsSection/TransitionedResultsSection";
import AdvancedSearchPageToolbarContainer from "../AdvancedSearchPageToolbar/AdvancedSearchPageToolbarContainer";
import {
    StyledAdvancedSearchPage,
    StyledPageHeader,
    StyledPageContent,
    StyledBackContainer,
    StyledPageInnerContent,
} from "./styles";

type AdvancedSearchPageProps = WithSWNavigatorProps;

const AdvancedSearchPage = (props: AdvancedSearchPageProps) => {
    const { navigator } = props;

    return (
        <StyledAdvancedSearchPage>
            <StyledPageHeader>
                <StyledBackContainer>
                    <IconButton
                        type="flat"
                        iconSize="sm"
                        iconName="arrow-left"
                        onClick={() => navigator.go(FIND_LEADS_PAGE_ROUTE)}
                        dataAutomation="header-back-button"
                    />
                </StyledBackContainer>
                <AdvancedSearchPageToolbarContainer />
            </StyledPageHeader>
            <StyledPageContent>
                <StyledPageInnerContent>
                    <FiltersPanelContainer />
                    <TransitionedResultsSection />
                </StyledPageInnerContent>
            </StyledPageContent>
            <AdvancedSearchSidebar />
        </StyledAdvancedSearchPage>
    );
};

export default AdvancedSearchPage;
