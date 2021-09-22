import React from "react";
import { connect } from "react-redux";
import { RootState } from "store/types";
import { StyledOverlay, StyledOverlayContainer, StyledRightBarFixedContainer } from "./styles";
import BenchmarksTabContainer from "pages/workspace/sales/sub-modules/benchmarks/components/BenchmarksTab/BenchmarksTabContainer";
import RightBarSales from "./RightBarSales";
import SiteTrendsContainer from "../../sub-modules/site-trends/SiteTrendsContainer";
import AboutTabContainer from "pages/workspace/sales/sub-modules/feed/components/AboutTab/AboutTabContainer";
import { selectBenchmarksQuota } from "pages/workspace/sales/sub-modules/benchmarks/store/selectors";
import RightSidebarContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/RightSidebarContext";
import ContactsTab from "pages/sales-intelligence/sub-modules/right-sidebar/components/contacts/ContactsTab/ContactsTab";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import useRightBarTabs from "pages/workspace/sales/components/RightBar/hooks/useRightBarTabs";

export type RightBarHoverContainerProps = {
    getExcelTableRowHref(args: any): string;
};

type ConnectedProps = ReturnType<typeof mapStateToProps>;

const RightBarHoverContainer = (props: RightBarHoverContainerProps & ConnectedProps) => {
    const { isSidebarOpen, closeSidebar } = React.useContext(RightSidebarContext);
    const { getExcelTableRowHref } = props;
    const [overlayShown, setOverlayShown] = React.useState(false);
    const isContactsFeatureEnabled = useSalesSettingsHelper().isContactsFeatureEnabled();
    const tabs = useRightBarTabs();

    function handleMouseOver() {
        setOverlayShown(true);
    }

    function handleMouseLeave() {
        setOverlayShown(false);
    }

    return (
        <StyledOverlayContainer>
            {isSidebarOpen && overlayShown && <StyledOverlay />}
            <StyledRightBarFixedContainer
                isRightBarOpen={isSidebarOpen}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
            >
                <RightBarSales isOpen={isSidebarOpen} closeSidebar={closeSidebar} tabs={tabs}>
                    <AboutTabContainer />
                    {/*//@ts-ignore*/}
                    <SiteTrendsContainer getExcelTableRowHref={getExcelTableRowHref} />
                    <BenchmarksTabContainer />
                    {isContactsFeatureEnabled && <ContactsTab />}
                </RightBarSales>
            </StyledRightBarFixedContainer>
        </StyledOverlayContainer>
    );
};

const mapStateToProps = (state: RootState) => ({
    benchmarksQuota: selectBenchmarksQuota(state),
});

export default connect(mapStateToProps)(RightBarHoverContainer) as React.FC<
    RightBarHoverContainerProps
>;
