import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { UseCaseHomepage } from "@similarweb/ui-components/dist/homepages";
import { FIND_LEADS_PAGE_ROUTE } from "pages/sales-intelligence/constants/routes";
import { WithSWNavigatorProps } from "pages/sales-intelligence/hoc/withSWNavigator";
import FindCompetitorsSearchSection from "../../../../pages/find-leads/components/FindCompetitorsSearchSection/FindCompetitorsSearchSection";
import FindLeadsByCriteriaPageHeader from "pages/sales-intelligence/common-components/header/FindLeadsByCriteriaPageHeader/FindLeadsByCriteriaPageHeader";

type CompetitorCustomersStartPageProps = {
    navigator: WithSWNavigatorProps["navigator"];
};

const CompetitorCustomersStartPage = (props: CompetitorCustomersStartPageProps) => {
    const { navigator } = props;
    const translate = useTranslation();

    const handleClickBack = () => {
        navigator.go(FIND_LEADS_PAGE_ROUTE);
    };

    const handleSubmit = React.useCallback(
        (domain: string, trafficType: string) => {
            navigator.go(`salesIntelligence-findLeads-competitors-result-${trafficType}`, {
                // TODO
                key: domain,
                country: 999,
                duration: "3m",
            });
        },
        [navigator],
    );

    const searchComponent = React.useMemo(() => {
        return <FindCompetitorsSearchSection onSubmit={handleSubmit} />;
    }, [handleSubmit]);

    return (
        <div>
            <FindLeadsByCriteriaPageHeader step={0} onBackClick={handleClickBack} />
            <UseCaseHomepage
                titlePosition="left-aligned"
                searchComponents={searchComponent}
                title={translate("si.pages.find_leads.competitors.title")}
                subtitle={translate("si.pages.find_leads.competitors.subtitle")}
                headerImageUrl={SecondaryHomePageHeaderImageUrl}
            />
        </div>
    );
};

export default CompetitorCustomersStartPage;
