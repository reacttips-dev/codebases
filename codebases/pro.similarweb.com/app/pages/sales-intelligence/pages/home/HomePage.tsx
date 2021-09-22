import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import PrimaryHomePage from "@similarweb/ui-components/dist/homepages/primary/src/PrimaryHomepage";
import { AutocompleteWebsitesRecent } from "components/AutocompleteWebsites/AutocompleteWebsitesRecent";
import { AssetsService } from "services/AssetsService";
import HomePageContent from "./components/HomePageContent/HomePageContent";
import { HomePageContainerProps } from "./HomePageContainer";
import useHomePageTrackingService from "pages/sales-intelligence/hooks/useHomePageTrackingService";

const HomePage: React.FC<HomePageContainerProps> = (props) => {
    const { opportunityLists } = props;
    const translate = useTranslation();
    const homePageTrackingService = useHomePageTrackingService();
    const headerImageUrl = AssetsService.assetUrl("/images/primary-home-page-header.png");

    const handleItemClick = (domain: string, isRecent: boolean) => {
        if (isRecent) {
            return homePageTrackingService.trackRecentDomainClicked(domain);
        }
    };

    return (
        <PrimaryHomePage
            subtitlePosition="left-aligned"
            searchComponents={
                <AutocompleteWebsitesRecent
                    onItemClick={handleItemClick}
                    defaultWebsitePageState="accountreview_website_overview_websiteperformance"
                />
            }
            title={translate("si.pages.home.title")}
            subtitle={translate("si.pages.home.subtitle")}
            usecaseItems={<HomePageContent opportunityLists={opportunityLists} />}
            headerImageUrl={headerImageUrl}
        />
    );
};

export default HomePage;
