// [InvestorsSeparation] Copy of the original file. Will be removed soon.
import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { CircularLoader } from "components/React/CircularLoader";
import * as _ from "lodash";
import {
    InvestorKeys,
    SalesKeys,
} from "pages/workspace/common components/AddOpportunitiesButton/src/LeadCreationDropdownKeys";
import { QuotaIndicator } from "pages/workspace/common/QuotaIndicator";
import { Component, useEffect, useState } from "react";
import * as React from "react";
import { connect } from "react-redux";
import { DefaultFetchService } from "services/fetchService";
import { allTrackers } from "services/track/track";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import WithTrack from "../../../../components/WithTrack/src/WithTrack";
import WithTranslation from "../../../../components/WithTranslation/src/WithTranslation";
import NewLeadsCreationDropdown from "../AddOpportunitiesButton/src/NewLeadsCreationDropdown";
import { Quicklinks } from "../Quicklinks";
import { WorkspaceContext, workspaceContextType } from "../WorkspaceContext";
import { BuildListImage } from "./componenets/BuildListImage";
import { EmptyWorkspaceImage } from "./componenets/EmptyWorkspaceImage";
import { ListCard } from "./componenets/ListCard";

import {
    CardListEmptyContainer,
    CardsListLoader,
    EmptyContentContainer,
    EmptyContentWrapper,
    EmptyWorkspaceContainer,
    EmptyWorkspaceSubtitle,
    EmptyWorkspaceTitle,
    OverviewBoxesWrapper,
    OverviewNewListCard,
    OverviewPageContent,
    OverviewPageHeaderWrapper,
    OverviewPageWrapper,
    OverviewSectionDate,
    OverviewSectionTitle,
    OverviewSubtitle,
    OverviewTitle,
    SpaceBetween,
} from "./StyledComponents";
import { RootState } from "store/types";

export interface IQuickLinkData {
    quickLinks: any;
    findNewLeadsBox?: any;
    extensionLinks?: any;
    onClickFindNewLeadsBox?: VoidFunction;
    linkToDashboardTemplate(
        templateId: any,
        keys: any,
        country: any,
        opportunityListId: any,
        templateTitle: any,
    ): void;
    dashboardTemplates: { benchmark: string | number; industryAnalysis: string | number };
    workspace: string;
}

const translations = {
    investors: (translate: any) => ({
        emptyWorkspaceTitle: translate("workspaces.investors.empty-workspace.title"),
        emptyWorkspaceSubtitle: translate("workspaces.investors.empty-workspace.subtitle"),
        createListText: translate("workspaces.investors.empty-workspace.create-list"),
        createManualListText: translate("workspaces.investors.empty-workspace.create-manual-list"),
        listsTitle: translate("workspaces.investors.overview.my_opportunities"),
        getSnapshotDate: (obj) => translate("workspaces.investors.overview.snapshot_date", obj),
        quickLinksTitle: translate("workspaces.investors.overview.quick_links.new"),
        quickLinksButtonClose: translate("workspaces.investors.overview.quick_links.close"),
        quickLinksButtonOpen: translate("workspaces.investors.overview.quick_links.open"),
    }),
    sales: (translate: any) => ({
        emptyWorkspaceTitle: translate("workspaces.sales.empty-workspace.title"),
        emptyWorkspaceSubtitle: translate("workspaces.sales.empty-workspace.subtitle"),
        createListText: translate("workspaces.sales.empty-workspace.create-list"),
        createManualListText: translate("workspaces.sales.empty-workspace.create-manual-list"),
        listsTitle: translate("workspaces.sales.overview.my_opportunities"),
        getSnapshotDate: (obj) => translate("workspaces.sales.overview.snapshot_date", obj),
        quickLinksTitle: translate("workspaces.sales.overview.quick_links.new"),
        quickLinksButtonClose: translate("workspaces.sales.overview.quick_links.close"),
        quickLinksButtonOpen: translate("workspaces.sales.overview.quick_links.open"),
    }),
};

const EmptyWorkspace = ({
    workspaceType,
    onCreateNewList,
    createNewListForGenerator,
    translate,
    workspaceId,
    showNewListDropdown,
}: any) => {
    const {
        emptyWorkspaceTitle,
        emptyWorkspaceSubtitle,
        createListText,
        createManualListText,
    } = translations[workspaceType](translate);
    const button = (
        <IconButton
            iconName="add"
            width={200}
            onClick={showNewListDropdown ? null : onCreateNewList}
            dataAutomation={`${workspaceType}-overview-page-empty-state-button`}
        >
            {showNewListDropdown ? createListText : createManualListText}
        </IconButton>
    );
    const fetchService = DefaultFetchService.getInstance();
    const [Quota, setQuota] = useState<any>();
    useEffect(
        /* fetch site data */ () => {
            async function fetchData() {
                const response = await fetchService.get(
                    `api/userdata/workspaces/${workspaceType}/${workspaceId}/quota`,
                );
                setQuota(response);
            }
            fetchData();
        },
        [],
    );
    return (
        <EmptyWorkspaceContainer>
            <EmptyContentWrapper>
                <EmptyWorkspaceImage />
                <EmptyContentContainer>
                    <EmptyWorkspaceTitle>
                        {showNewListDropdown ? emptyWorkspaceTitle : createManualListText}
                    </EmptyWorkspaceTitle>
                    <EmptyWorkspaceSubtitle>{emptyWorkspaceSubtitle}</EmptyWorkspaceSubtitle>
                    {!showNewListDropdown ? (
                        button
                    ) : (
                        <NewLeadsCreationDropdown
                            keys={SalesKeys}
                            button={button}
                            onAddLeadsManually={onCreateNewList}
                            onAddFromGenerator={createNewListForGenerator}
                        />
                    )}
                </EmptyContentContainer>
            </EmptyContentWrapper>
            <QuotaIndicator workspaceType={workspaceType} quota={Quota} />
        </EmptyWorkspaceContainer>
    );
};

const OpportunitiesLists = React.memo<any>(
    ({
        workspaceType,
        translate,
        onCreateNewList,
        createNewListForGenerator,
        opportunityLists,
        onSelectList,
        lastSnapshotDate,
        isListsLoading,
        onAddFromModal,
        onAddFromWizard,
        isGeneratorLimited,
        checkIsGeneratorLocked,
        editOpportunity,
        workspaceId,
        listsFromStore,
        isFeatureEnabled,
    }) => {
        const { listsTitle, createListText, getSnapshotDate } = translations[workspaceType](
            translate,
        );
        const snapshotDateText = getSnapshotDate({ date: lastSnapshotDate.format("MMM YYYY") });
        const keys = workspaceType === "investors" ? InvestorKeys : SalesKeys;
        const fetchService = DefaultFetchService.getInstance();
        const [Quota, setQuota] = useState<any>();

        useEffect(
            /* fetch site data */ () => {
                async function fetchData() {
                    const response = await fetchService.get(
                        `api/userdata/workspaces/${workspaceType}/${workspaceId}/quota`,
                    );
                    setQuota(response);
                }
                fetchData();
            },
            [opportunityLists],
        );

        const getStoreList = (listID) => {
            return listsFromStore.find(({ opportunityListId }) => opportunityListId === listID);
        };

        return (
            <WithTrack>
                {(track) => {
                    const onClickSelectList = (list) => {
                        track("Internal link", "click", `see all domains`);
                        onSelectList(list);
                    };
                    const onClickNewList = () => {
                        track("Add companies", "open", `Create list from home page`);
                    };
                    const button = (
                        <Button onClick={onClickNewList} type="flat" label={createListText} />
                    );
                    return (
                        <>
                            <SpaceBetween>
                                <FlexColumn>
                                    <OverviewSectionTitle>{listsTitle}</OverviewSectionTitle>
                                    <OverviewSectionDate>{snapshotDateText}</OverviewSectionDate>
                                </FlexColumn>
                                <QuotaIndicator workspaceType={workspaceType} quota={Quota} />
                            </SpaceBetween>
                            <OverviewBoxesWrapper>
                                {isListsLoading ? (
                                    <CardsListLoader>
                                        <CircularLoader
                                            options={{
                                                svg: {
                                                    stroke: "#dedede",
                                                    strokeWidth: "4",
                                                    r: 21,
                                                    cx: "50%",
                                                    cy: "50%",
                                                },
                                                style: {
                                                    width: 46,
                                                    height: 46,
                                                },
                                            }}
                                        />
                                    </CardsListLoader>
                                ) : (
                                    <>
                                        {!isFeatureEnabled("saved-searches") && ( // TODO https://jira.similarweb.io/browse/SIM-29139
                                            <OverviewNewListCard>
                                                <CardListEmptyContainer>
                                                    <BuildListImage />
                                                    <NewLeadsCreationDropdown
                                                        button={button}
                                                        keys={keys}
                                                        onAddLeadsManually={onCreateNewList}
                                                        onAddFromGenerator={
                                                            createNewListForGenerator
                                                        }
                                                        isGeneratorLimited={isGeneratorLimited}
                                                        checkIsGeneratorLocked={
                                                            checkIsGeneratorLocked
                                                        }
                                                    />
                                                </CardListEmptyContainer>
                                            </OverviewNewListCard>
                                        )}
                                        {opportunityLists.map((crrList) => (
                                            <ListCard
                                                crrList={crrList}
                                                key={crrList.opportunityListId}
                                                onSelectList={onClickSelectList}
                                                translate={translate}
                                                workspaceType={workspaceType}
                                                onAddFromModal={onAddFromModal}
                                                onAddFromWizard={onAddFromWizard}
                                                isGeneratorLimited={isGeneratorLimited}
                                                checkIsGeneratorLocked={checkIsGeneratorLocked}
                                                editOpportunity={editOpportunity}
                                                workspaceId={workspaceId}
                                                listsFromStore={getStoreList(
                                                    crrList.opportunityListId,
                                                )}
                                            />
                                        ))}
                                    </>
                                )}
                            </OverviewBoxesWrapper>
                        </>
                    );
                }}
            </WithTrack>
        );
    },
);

const OverviewPageHeader = ({
    workspaceName,
    workspaceType,
    translate,
    quickLinkData,
    showQuickLinks,
    toggleQuickLinks,
    showToggle,
}) => {
    const { quickLinksTitle, quickLinksButtonClose, quickLinksButtonOpen } = translations[
        workspaceType
    ](translate);

    const getToggleButton = () => {
        const buttonText = showQuickLinks ? quickLinksButtonClose : quickLinksButtonOpen;
        const buttonIconName = showQuickLinks ? "chev-up" : "chev-down";

        return (
            <IconButton iconName={buttonIconName} onClick={toggleQuickLinks} type={"flat"}>
                {buttonText}
            </IconButton>
        );
    };

    return (
        <OverviewPageHeaderWrapper>
            <SpaceBetween>
                <OverviewTitle>{workspaceName}</OverviewTitle>
                {showToggle && getToggleButton()}
            </SpaceBetween>
            <OverviewSubtitle visible={showQuickLinks}>{quickLinksTitle}</OverviewSubtitle>
            <Quicklinks
                {...quickLinkData}
                templateId={quickLinkData.dashboardTemplates}
                translate={translate}
            />
        </OverviewPageHeaderWrapper>
    );
};

interface IOverviewProps {
    workspaceName: string;
    isEmptyWorkspace: boolean;
    onCreateNewList: any;
    quickLinkData: IQuickLinkData;
    api: any;
    lastSnapshotDate: string;
    workspaceId: string;
    workspaceType: string;
    onSelectList: (id) => void;
    createNewListForGenerator: () => void;
    onAddFromModal: (listID) => void;
    onAddFromWizard: (listID) => void;
    isGeneratorLimited?: boolean;
    checkIsGeneratorLocked?: () => Promise<boolean>;
    editOpportunity: any;
    opportunityListsFromStore: any;
}

interface IOverviewState {
    isListsLoading: boolean;
    showQuickLinks: boolean;
}

class OverviewPageCmp extends Component<IOverviewProps, IOverviewState> {
    private opportunityLists = [];

    constructor(props) {
        super(props);

        this.state = {
            isListsLoading: true,
            showQuickLinks: true,
        };
    }

    public async getList() {
        try {
            const opportunityLists = await this.props.api.getWorkspaceOverviewLists(
                this.props.workspaceId,
                this.props.lastSnapshotDate,
            );
            this.opportunityLists = opportunityLists.sort((a, b) => {
                if (a.friendlyName < b.friendlyName) {
                    return -1;
                }
                if (a.friendlyName > b.friendlyName) {
                    return 1;
                }
                return 0;
            });
        } finally {
            this.setState({ isListsLoading: false });
        }
    }

    public componentDidMount() {
        this.getList();
    }
    public componentDidUpdate(prevProps) {
        if (prevProps.opportunityListsFromStore !== this.props.opportunityListsFromStore) {
            this.setState({ isListsLoading: true });
            this.getList();
        }
    }

    public getOpportunityListWithCountries = _.memoize((opportunityLists, getCountryById) => {
        return opportunityLists.map((list) => ({
            ...list,
            country: getCountryById(list.country),
        }));
    });

    public render() {
        const {
            workspaceId,
            workspaceType,
            workspaceName,
            isEmptyWorkspace,
            onCreateNewList,
            onSelectList,
            quickLinkData,
            onAddFromModal,
            onAddFromWizard,
            isGeneratorLimited,
            checkIsGeneratorLocked,
            editOpportunity,
            opportunityListsFromStore,
        } = this.props;
        return (
            <WorkspaceContext.Consumer>
                {({ getCountryById, lastSnapshotDate, isFeatureEnabled }: workspaceContextType) => {
                    const opportunityLists = this.getOpportunityListWithCountries(
                        this.opportunityLists,
                        getCountryById,
                    );
                    return (
                        <WithTranslation>
                            {(translate) => {
                                return (
                                    <OverviewPageWrapper>
                                        <OverviewPageHeader
                                            workspaceName={workspaceName}
                                            workspaceType={workspaceType}
                                            translate={translate}
                                            quickLinkData={quickLinkData}
                                            showQuickLinks={this.state.showQuickLinks}
                                            toggleQuickLinks={this.toggleQuickLinks}
                                            showToggle={!isFeatureEnabled("saved-searches")}
                                        />
                                        <OverviewPageContent
                                            showQuickLinks={this.state.showQuickLinks}
                                        >
                                            {isEmptyWorkspace ? (
                                                <EmptyWorkspace
                                                    workspaceType={workspaceType}
                                                    translate={translate}
                                                    onCreateNewList={onCreateNewList}
                                                    workspaceId={workspaceId}
                                                    createNewListForGenerator={
                                                        this.onCreateNewListForGenerator
                                                    }
                                                    showNewListDropdown={
                                                        !isFeatureEnabled("saved-searches")
                                                    }
                                                />
                                            ) : (
                                                <OpportunitiesLists
                                                    workspaceType={workspaceType}
                                                    translate={translate}
                                                    onCreateNewList={onCreateNewList}
                                                    createNewListForGenerator={
                                                        this.onCreateNewListForGenerator
                                                    }
                                                    opportunityLists={opportunityLists}
                                                    onSelectList={onSelectList}
                                                    lastSnapshotDate={lastSnapshotDate}
                                                    isListsLoading={this.state.isListsLoading}
                                                    onAddFromModal={onAddFromModal}
                                                    onAddFromWizard={onAddFromWizard}
                                                    isGeneratorLimited={isGeneratorLimited}
                                                    checkIsGeneratorLocked={checkIsGeneratorLocked}
                                                    editOpportunity={editOpportunity}
                                                    workspaceId={workspaceId}
                                                    listsFromStore={opportunityListsFromStore}
                                                    isFeatureEnabled={isFeatureEnabled}
                                                />
                                            )}
                                        </OverviewPageContent>
                                    </OverviewPageWrapper>
                                );
                            }}
                        </WithTranslation>
                    );
                }}
            </WorkspaceContext.Consumer>
        );
    }

    public onCreateNewListForGenerator = () => {
        const { isEmptyWorkspace, workspaceType, createNewListForGenerator } = this.props;

        if (workspaceType === "sales") {
            const eventName = isEmptyWorkspace
                ? "Find leads/from home page/from empty workspace"
                : "Find leads/from home page/from top card";

            allTrackers.trackEvent("Internal link", "click", eventName);
        }

        createNewListForGenerator();
    };

    private toggleQuickLinks = () => {
        allTrackers.trackEvent(
            "button",
            "click",
            this.state.showQuickLinks ? "shortcuts/hide" : "shortcuts/show",
        );

        this.setState({ showQuickLinks: !this.state.showQuickLinks });
    };
}

function mapStateToProps({ legacySalesWorkspace }: RootState) {
    return {
        opportunityListsFromStore: legacySalesWorkspace.workspaces?.[0]?.opportunityLists,
    };
}

export const OverviewPage = connect(mapStateToProps)(OverviewPageCmp);
