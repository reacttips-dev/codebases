import RightBarSales from "pages/workspace/sales/components/RightBar/RightBarSales";
import React, { useEffect, useState } from "react";
import RightSidebarContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/RightSidebarContext";
import AboutTabContainer from "pages/workspace/sales/sub-modules/feed/components/AboutTab/AboutTabContainer";
import SiteTrendsContainer from "pages/workspace/sales/sub-modules/site-trends/SiteTrendsContainer";
import BenchmarksTabContainer from "pages/workspace/sales/sub-modules/benchmarks/components/BenchmarksTab/BenchmarksTabContainer";
import { AuthorizedPageWrapper } from "../style";
import { SfCardLoader } from "./SfCardLoader";
import { SFEmptyState } from "pages/website-analysis/sfconvert/sfCards/SFEmptyState";
import { BaseWebsiteType } from "pages/workspace/sales/sub-modules/benchmarks/types/common";
import About from "pages/workspace/sales/components/RightBar/Tabs/About";
import SiteTrends from "pages/workspace/sales/components/RightBar/Tabs/SiteTrends";
import Benchmarks from "pages/workspace/sales/components/RightBar/Tabs/Benchmarks";
import Contacts from "pages/workspace/sales/components/RightBar/Tabs/Contacts";
import ContactsTab from "pages/sales-intelligence/sub-modules/right-sidebar/components/contacts/ContactsTab/ContactsTab";
import useRightBarTabs from "pages/workspace/sales/components/RightBar/hooks/useRightBarTabs";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";

const LOADER_HEIGHT = "288px";
const CUSTOM_STYLES_RIGHT_BAR = { width: "600px", overflowY: "auto" };

type AuthorizedPageProps = {
    isLoading: boolean;
    hasNoData: () => boolean;
    domain: string;
    favIcon: string;
    getExcelTableRowHref: ({}) => string;
};

export const AuthorizedPage = React.memo<AuthorizedPageProps>(
    ({ isLoading, hasNoData, domain, getExcelTableRowHref, favIcon }) => {
        const [isSimilarSitesPanelOpen, setIsSimilarSitesPanelOpen] = React.useState(false);
        const [website, setWebsite] = useState<BaseWebsiteType>({ domain: "", favicon: "" });
        const isContactsFeatureEnabled = useSalesSettingsHelper().isContactsFeatureEnabled();
        const tabs = useRightBarTabs();

        useEffect(() => {
            setWebsite({ domain, favicon: favIcon });
        }, [domain, favIcon]);

        const renderResults = () => {
            if (isLoading || !domain.length) {
                return <SfCardLoader height={LOADER_HEIGHT} />;
            } else if (hasNoData()) {
                return <SFEmptyState />;
            }

            return (
                <AuthorizedPageWrapper>
                    <RightSidebarContext.Provider
                        value={{
                            website,
                            isSidebarOpen: true,
                            isSimilarSitesPanelOpen,
                            toggleSimilarSitesPanel: setIsSimilarSitesPanelOpen,
                            closeSidebar: () => false,
                        }}
                    >
                        <RightBarSales
                            isOpen
                            hideCloseBtn
                            closeSidebar={false}
                            customStyles={CUSTOM_STYLES_RIGHT_BAR}
                            tabs={tabs}
                        >
                            <AboutTabContainer />
                            <SiteTrendsContainer getExcelTableRowHref={getExcelTableRowHref} />
                            <BenchmarksTabContainer />
                            {isContactsFeatureEnabled && <ContactsTab />}
                        </RightBarSales>
                    </RightSidebarContext.Provider>
                </AuthorizedPageWrapper>
            );
        };
        //FIXME uncomment logout section when its needed to be implemented. SIM-34234
        return (
            <>
                {/* <HeaderContainer>
                <IconContainer>
                    <SWlogo />
                </IconContainer>
                <ButtonContainer>
                    <Logout>
                        <Button type="flat">{i18nFilter()("salesforce.general.logout")}</Button>
                    </Logout>
                </ButtonContainer>
            </HeaderContainer> */}
                {renderResults()}
            </>
        );
    },
);
