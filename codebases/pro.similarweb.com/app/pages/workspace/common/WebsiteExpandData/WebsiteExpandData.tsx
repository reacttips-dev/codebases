import { Button } from "@similarweb/ui-components/dist/button";
import _ from "lodash";
import { Dayjs } from "dayjs";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import styled from "styled-components";

import {
    IScroll,
    WebsiteHeader,
} from "../../../../../.pro-features/pages/workspace/common components/WebsiteHeader";
import {
    WorkspaceContext,
    workspaceContextType,
} from "../../../../../.pro-features/pages/workspace/common components/WorkspaceContext";
import { i18nFilter } from "../../../../filters/ngFilters";
import { allTrackers } from "../../../../services/track/track";
import { selectTab } from "../actions_creators/common_worksapce_action_creators";
import { ANALYSIS_TAB, DASHBOARDS_TAB, FEED_TAB, LIST_SETTING_FEED } from "../consts";
import {
    availableTab,
    ICommonWorkspaceState,
    ISelectedSite,
} from "../reducers/common_workspace_reducer";
import { selectActiveOpportunityList } from "../selectors";
import { IOpportunityListItem } from "../types";
import { Tab } from "./Tab";
import { AnalysisTab } from "./Tabs/AnalysisTab";
import { DashboardsTab } from "./Tabs/DashboardsTab";
import { FeedSettingsWrapper } from "./Tabs/StyledComponents";
import { FeedTab } from "pages/workspace/sales/sub-modules/feed/components/FeedTab/FeedTab";
import { ThunkDispatchCommon } from "store/types";

const Container = styled.div`
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow: auto;
    overflow-x: hidden;
`;

const Tabs = styled.div<IScroll>`
    position: relative;
    width: 100%;
    transition: all 0.3s ease-out;
    padding-top: ${(props) => (props.scroll ? "104px" : "224px")};
    min-height: 100%;
    box-sizing: border-box;
    &::before {
        content: " ";
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: ${(props) => (props.scroll ? "104px" : "224px")};
        transition: all 0.3s ease-out;
    }
`;

interface IWebsiteExpandDataProps {
    selectedDomain: ISelectedSite;
    activeOpportunitiesList: IOpportunityListItem;
    activeListId: string;
    activeWorkspaceId: string;
    lastSnapshotDate: Dayjs;
    selectedTab: availableTab;
    previouslySelectedTab: availableTab;
    getDashboardQuickLinks: any;
    goToDashboardTemplate: () => void;
    getExcelTableRowHref: (params) => string;
    unsupportedFeatures: Set<string>;

    onTabSelect(tab: string);
}

interface IWebsiteExpandDataState {
    isScrolling: boolean;
}

export class WebsiteExpandData extends React.PureComponent<
    IWebsiteExpandDataProps,
    IWebsiteExpandDataState
> {
    public el: HTMLDivElement;

    public state = {
        isScrolling: false,
    };

    public componentDidMount() {
        this.el.addEventListener("scroll", this.onScroll, { capture: true });
    }

    public onScroll = () => {
        this.setState({
            isScrolling: this.state.isScrolling ? this.el.scrollTop > 0 : this.el.scrollTop > 146,
        });
    };

    public componentWillUnmount() {
        this.el.removeEventListener("scroll", this.onScroll, { capture: true });
    }

    public onTabSelect = (newTab) => {
        allTrackers.trackEvent(
            "Expanded Side bar",
            "switch",
            `${this.props.selectedDomain.domain}/Tab/${newTab.toLowerCase().replace("_", " ")}`,
        );
        this.el.scrollTop = 0;
        this.setState(
            {
                isScrolling: false,
            },
            () => {
                this.props.onTabSelect(newTab);
            },
        );
    };

    public setRef = (el) => (this.el = el);

    public render() {
        const {
            selectedDomain,
            selectedTab,
            previouslySelectedTab,
            unsupportedFeatures,
            activeWorkspaceId,
            activeOpportunitiesList,
        } = this.props;
        return (
            <WorkspaceContext.Consumer>
                {({ editOpportunityList }: workspaceContextType) => {
                    const onClickSettings = () => {
                        allTrackers.trackEvent(
                            "list model setting",
                            "open",
                            "country List/sidebar",
                        );
                        editOpportunityList(
                            activeWorkspaceId,
                            activeOpportunitiesList,
                            false,
                            LIST_SETTING_FEED,
                        );
                    };
                    return (
                        <Container ref={this.setRef}>
                            {selectedDomain && (
                                <>
                                    <WebsiteHeader
                                        selectedTab={selectedTab}
                                        unsupportedFeatures={unsupportedFeatures}
                                        onTabSelect={this.onTabSelect}
                                        scroll={this.state.isScrolling}
                                        {...selectedDomain}
                                    />
                                    <Tabs scroll={this.state.isScrolling}>
                                        {!unsupportedFeatures.has(LIST_SETTING_FEED) && (
                                            <Tab
                                                name={FEED_TAB}
                                                selectedTab={selectedTab}
                                                previouslySelectedTab={previouslySelectedTab}
                                            >
                                                <FeedTab />
                                            </Tab>
                                        )}
                                        <Tab
                                            name={ANALYSIS_TAB}
                                            selectedTab={selectedTab}
                                            previouslySelectedTab={previouslySelectedTab}
                                        >
                                            <AnalysisTab
                                                getExcelTableRowHref={
                                                    this.props.getExcelTableRowHref
                                                }
                                            />
                                        </Tab>
                                        <Tab
                                            name={DASHBOARDS_TAB}
                                            selectedTab={selectedTab}
                                            previouslySelectedTab={previouslySelectedTab}
                                        >
                                            <DashboardsTab
                                                getDashboardQuickLinks={
                                                    this.props.getDashboardQuickLinks
                                                }
                                                goToDashboardTemplate={
                                                    this.props.goToDashboardTemplate
                                                }
                                            />
                                        </Tab>
                                    </Tabs>
                                    <FeedSettingsWrapper isVisible={selectedTab === FEED_TAB}>
                                        {i18nFilter()("workspace.feed_sidebar.settings")}
                                        <Button type="flat" onClick={onClickSettings}>
                                            {i18nFilter()("workspace.feed_sidebar.settings.button")}
                                        </Button>
                                    </FeedSettingsWrapper>
                                </>
                            )}
                        </Container>
                    );
                }}
            </WorkspaceContext.Consumer>
        );
    }
}

const mapStateToProps = ({ commonWorkspace }: { commonWorkspace: ICommonWorkspaceState }) => ({
    activeOpportunitiesList: selectActiveOpportunityList(commonWorkspace) || {},
    selectedDomain: commonWorkspace.selectedDomain,
    activeListId: commonWorkspace.activeListId,
    activeWorkspaceId: commonWorkspace.activeWorkspaceId,
    lastSnapshotDate: commonWorkspace.lastSnapshotDate,
    selectedTab: commonWorkspace.selectedTab,
    previouslySelectedTab: commonWorkspace.previouslySelectedTab,
    unsupportedFeatures: commonWorkspace.unsupportedFeatures,
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => ({
    onTabSelect: bindActionCreators(selectTab, dispatch),
});
export const WebsiteExpandDataSidebar = connect(
    mapStateToProps,
    mapDispatchToProps,
)(WebsiteExpandData);
