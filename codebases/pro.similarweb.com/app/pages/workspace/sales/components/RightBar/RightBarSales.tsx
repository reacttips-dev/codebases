import React, { CSSProperties, useEffect, useState } from "react";
import { Keyframes } from "styled-components";
import { connect } from "react-redux";
import {
    slideEnteringLeft,
    slideEnteringRight,
    slideLeavingLeft,
    slideLeavingRight,
    StyledTabContainer,
    StyledRightBar,
    StyledHeader,
    StyledTitle,
    StyledContent,
    StyledCloseButton,
    StyledHeaderRight,
    StyledHeaderLeft,
} from "./styles";
import { StyledTabs } from "../RightBar/Tab/styles";
import WebsiteWithLink from "pages/sales-intelligence/sub-modules/right-sidebar/components/WebsiteWithLink/WebsiteWithLink";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { fetchTopicsThunkAction } from "../../sub-modules/benchmarks/store/effects";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    TOPICS_TRANSLATION_KEY,
    ADD_TO_LIST_TOOLTIP,
} from "../../sub-modules/benchmarks/constants";
import { RootState, ThunkDispatchCommon } from "store/types";
import {
    selectTopicFromSettings,
    selectTopicsList,
} from "pages/workspace/sales/sub-modules/benchmarks/store/selectors";
import useRightSidebarTrackingService from "pages/sales-intelligence/hooks/useRightSidebarTrackingService";
import SimilarSitesPanelContainer from "pages/sales-intelligence/sub-modules/right-sidebar/components/SimilarSitesPanel/SimilarSitesPanelContainer";
import RightSidebarContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/RightSidebarContext";
import { bindActionCreators } from "redux";
import AddWebsiteToListButtonContainer from "pages/sales-intelligence/sub-modules/account-review/AddToListButton/AddWebsiteToListButtonContainer";
import { RightBarTabs } from "./types";
import {
    TABS_NAME,
    getNameTabForTracking,
} from "pages/workspace/sales/components/RightBar/helpers";

type RightBarSalesStepsState = {
    prev: null | number;
    curr: number;
};

type RightBarSalesProps = {
    isOpen: boolean;
    tabs: Array<(active: boolean, onClick: () => void) => React.ReactElement>;
    children: React.ReactChild[];
    chosenTopicCode: string;
    closeSidebar(): void;
    customStyles?: CSSProperties;
    fetchTopics(): void;
    hideCloseBtn?: boolean;
    topicsList?: { code: string; isPopular: boolean }[];
};

// FIXME Requires refactoring
const RightBarSales = ({
    tabs,
    closeSidebar,
    isOpen,
    children,
    chosenTopicCode,
    customStyles,
    fetchTopics,
    hideCloseBtn = false,
    topicsList,
}: RightBarSalesProps) => {
    const translate = useTranslation();
    const { website } = React.useContext(RightSidebarContext);

    const sidebarTrackingService = useRightSidebarTrackingService();
    const [steps, setState] = useState<RightBarSalesStepsState>({ prev: null, curr: 0 });

    useEffect(() => {
        !topicsList.length && fetchTopics();
    }, [topicsList]);

    /**
     * TODO: Rewrite with react-transition-group
     * Define status of element and position regarding previous or current element
     * and return suitable animation
     * @param curr - current active element
     * @param prev - previous active element
     * @param number - number of element in the list
     */
    const runAnimation = (
        curr: number,
        prev: null | number,
        number: number,
    ): Keyframes | string => {
        const isLeaving = prev === number;
        const isEntering = curr === number;
        const right = curr > prev;
        const left = curr > prev;
        if (prev === null) return "";
        if (isEntering) {
            return right ? slideEnteringRight : slideEnteringLeft;
        }
        if (isLeaving) {
            return left ? slideLeavingLeft : slideLeavingRight;
        }
        return "";
    };

    const onClickTab = (index: number, prevStep: number): (() => void) => (): void => {
        setState({ ...steps, curr: index, prev: prevStep });
    };

    const handleClickTab = (index: number) => (): void => {
        if (index !== steps.curr) {
            sidebarTrackingService.trackSidebarTabClicked(
                getNameTabForTracking(index),
                getNameTabForTracking(steps.curr),
                translate(`workspace.sales.benchmarks.topics.${chosenTopicCode}`),
            );
        }

        setState({ ...steps, curr: index, prev: steps.curr });
    };

    const handleLinkToBenchmarks = (index: RightBarTabs) => (metricName: string) => {
        sidebarTrackingService.trackAboutViewAllOpportunitiesClicked(
            metricName,
            translate(`${TOPICS_TRANSLATION_KEY}.${chosenTopicCode}`),
        );
        setState({ ...steps, curr: index, prev: steps.curr });
    };

    const propsGenerator = (index: number, curr: number) => {
        const isActiveTab = index === curr;

        if (index === RightBarTabs.Benchmarks || index === RightBarTabs.Contacts) {
            return {
                isActiveTab,
            };
        }

        if (index === RightBarTabs.About) {
            return {
                isActiveTab,
                linkToTrends: () => {
                    sidebarTrackingService.trackAboutViewTrendsClicked(
                        translate(`${TOPICS_TRANSLATION_KEY}.${chosenTopicCode}`),
                    );
                    onClickTab(RightBarTabs.SiteTrends, curr)();
                },
                linkToBenchmarks: handleLinkToBenchmarks(RightBarTabs.Benchmarks),
            };
        }

        if (index === RightBarTabs.SiteTrends) {
            return {
                isActiveTab,
                linkToBenchmark: onClickTab(RightBarTabs.Benchmarks, curr),
            };
        }

        return { isActiveTab };
    };

    return (
        <StyledRightBar style={customStyles} isOpen={isOpen} data-automation-sidebar-open={isOpen}>
            <StyledHeader>
                <StyledTitle>
                    <StyledHeaderLeft>
                        {website && (
                            <>
                                <WebsiteWithLink website={website} />
                                <AddWebsiteToListButtonContainer
                                    disabledText={translate(ADD_TO_LIST_TOOLTIP)}
                                    domain={website.domain}
                                    isWhiteIcon
                                    withLoadingState
                                />
                            </>
                        )}
                    </StyledHeaderLeft>

                    <StyledHeaderRight>
                        {!hideCloseBtn && (
                            <StyledCloseButton>
                                <IconButton
                                    iconSize="sm"
                                    iconName="clear"
                                    type="flat"
                                    onClick={() => {
                                        sidebarTrackingService.trackSidebarCloseIconClicked(
                                            translate(TABS_NAME[steps.curr]),
                                        );
                                        closeSidebar();
                                    }}
                                />
                            </StyledCloseButton>
                        )}
                    </StyledHeaderRight>
                </StyledTitle>
                <StyledTabs totalTabs={tabs.length}>
                    {tabs.map((tab, index) => tab(index === steps.curr, handleClickTab(index)))}
                </StyledTabs>
            </StyledHeader>
            <StyledContent>
                {React.Children.map(children, (content, i) => {
                    if (content) {
                        return (
                            <StyledTabContainer
                                key={i}
                                curr={steps.curr === i}
                                prev={steps.prev === i}
                                animation={runAnimation(steps.curr, steps.prev, i)}
                            >
                                {React.cloneElement(content as React.ReactElement, {
                                    ...propsGenerator(i, steps.curr),
                                })}
                            </StyledTabContainer>
                        );
                    }
                })}
            </StyledContent>
            <SimilarSitesPanelContainer />
        </StyledRightBar>
    );
};

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchTopics: fetchTopicsThunkAction,
        },
        dispatch,
    );
};

const mapStateToProps = (state: RootState) => ({
    chosenTopicCode: selectTopicFromSettings(state),
    topicsList: selectTopicsList(state),
});

export default connect(mapStateToProps, mapDispatchToProps)<RightBarSalesProps>(RightBarSales);
