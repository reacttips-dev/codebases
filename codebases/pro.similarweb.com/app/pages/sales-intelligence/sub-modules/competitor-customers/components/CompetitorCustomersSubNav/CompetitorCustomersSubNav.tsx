import React from "react";
import { WebsiteData } from "pages/sales-intelligence/sub-modules/common/types";
import WebsiteAnalysisFilters from "pages/website-analysis/WebsiteAnalysisFilters";
import FindLeadsSubNavBase from "../../../../common-components/sub-nav/FindLeadsSubNavBase/FindLeadsSubNavBase";
import CompetitorCustomersWebsiteSelector from "../CompetitorCustomersWebsiteSelector/CompetitorCustomersWebsiteSelector";

type CompetitorCustomersSubNavProps = {
    domain: string;
    websiteData: WebsiteData;
    onWebsiteSelect(domain: string): void;
};

const CompetitorCustomersSubNav = (props: CompetitorCustomersSubNavProps) => {
    const { domain, websiteData, onWebsiteSelect } = props;
    const websiteSelector = React.useMemo(() => {
        return (
            <CompetitorCustomersWebsiteSelector
                domain={domain}
                websiteData={websiteData}
                onWebsiteSelect={onWebsiteSelect}
            />
        );
    }, [domain, websiteData, onWebsiteSelect]);
    const filters = React.useMemo(() => {
        return <WebsiteAnalysisFilters />;
    }, []);

    return <FindLeadsSubNavBase leftComponent={websiteSelector} rightComponent={filters} />;
};

export default CompetitorCustomersSubNav;
