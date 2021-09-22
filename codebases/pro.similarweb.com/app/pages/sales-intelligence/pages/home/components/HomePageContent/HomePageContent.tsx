import React from "react";
import HomeListsContainer from "../HomeListsContainer/HomeListsContainer";
import { OpportunityListType } from "../../../../sub-modules/opportunities/types";
import HomeLinksSectionContainer from "../HomeLinksSection/HomeLinksSectionContainer";

type HomePageContentProps = {
    opportunityLists: OpportunityListType[];
};

const HomePageContent: React.FC<HomePageContentProps> = (props) => {
    const { opportunityLists } = props;

    return (
        <div>
            {opportunityLists.length > 0 && <HomeListsContainer lists={opportunityLists} />}
            <HomeLinksSectionContainer />
        </div>
    );
};

export default React.memo(HomePageContent);
