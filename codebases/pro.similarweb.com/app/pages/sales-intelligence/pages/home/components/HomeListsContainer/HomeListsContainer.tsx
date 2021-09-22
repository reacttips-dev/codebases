import React from "react";
import * as styles from "./styles";
import * as common from "../styles";
import { SWReactIcons } from "@similarweb/icons";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { OpportunityListType } from "../../../../sub-modules/opportunities/types";
import useHomePageTrackingService from "../../../../hooks/useHomePageTrackingService";
import withSWNavigator, { WithSWNavigatorProps } from "../../../../hoc/withSWNavigator";
import OpportunityListItem from "../../../../sub-modules/opportunities/components/OpportunityListItem/OpportunityListItem";
import { MY_LISTS_PAGE_ROUTE, STATIC_LIST_PAGE_ROUTE } from "../../../../constants/routes";

type HomeListsContainerProps = WithSWNavigatorProps & {
    lists: OpportunityListType[];
};

const HomeListsContainer: React.FC<HomeListsContainerProps> = (props) => {
    const { lists, navigator } = props;
    const translate = useTranslation();
    const trackingService = useHomePageTrackingService();

    const handleListClick = (list: OpportunityListType) => {
        trackingService.trackStaticListClicked(list.opportunities.length);
        navigator.go(STATIC_LIST_PAGE_ROUTE, { id: list.opportunityListId });
    };

    const navigateToListsPage = () => {
        trackingService.trackViewAllClicked();
        navigator.go(MY_LISTS_PAGE_ROUTE);
    };

    return (
        <styles.StyledListsContainer>
            <common.StyledSectionTitleContainer>
                <common.StyledSectionTitle>
                    {translate("si.pages.home.lists.title")}
                </common.StyledSectionTitle>
                <styles.StyledListsPageLink type="flat" onClick={navigateToListsPage}>
                    <span>{translate("si.pages.home.lists.page_link")}</span>
                    <SWReactIcons iconName="arrow-right" size="xs" />
                </styles.StyledListsPageLink>
            </common.StyledSectionTitleContainer>
            {lists.slice(0, 3).map((list) => (
                <styles.StyledListsItem key={list.opportunityListId}>
                    <OpportunityListItem item={list} onClick={handleListClick} />
                </styles.StyledListsItem>
            ))}
        </styles.StyledListsContainer>
    );
};

export default withSWNavigator(HomeListsContainer);
