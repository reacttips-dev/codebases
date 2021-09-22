import React, { FunctionComponent } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { FindAffiliateByIndustryTableContainer } from "./Components/FindAffiliateByIndustryTable/FindAffiliateByIndustryTable";
import { ReferralVisits } from "pages/digital-marketing/find-affiliate/by-industry/Components/ReferralVisits";
import { ReferralLeaders } from "pages/digital-marketing/find-affiliate/by-industry/Components/ReferralLeaders";
import { ReferralCategories } from "pages/digital-marketing/find-affiliate/by-industry/Components/ReferralCategories";
import { TopPageWrapper } from "pages/digital-marketing/find-affiliate/by-industry/StyledComponents";

const FindAffiliateByIndustryOverview: FunctionComponent<any> = () => {
    return (
        <>
            <TopPageWrapper>
                <ReferralVisits />
                <ReferralLeaders />
                <ReferralCategories />
            </TopPageWrapper>
            <FindAffiliateByIndustryTableContainer />
        </>
    );
};

export default SWReactRootComponent(
    FindAffiliateByIndustryOverview,
    "FindAffiliateByIndustryOverview",
);
