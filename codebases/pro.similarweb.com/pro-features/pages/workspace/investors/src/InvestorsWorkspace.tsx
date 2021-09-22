import { colorsPalettes } from "@similarweb/styles";
import * as _ from "lodash";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { CLEAR_HIGHLIGHT_CLICKED_ROW_EVENT } from "../../../../../app/components/React/Table/FlexTable/Big/FlexTable";
import Benchmark from "../../../../../app/components/dashboard/dashboard-templates/templates/Benchmark";
import Evaluation from "../../../../../app/components/dashboard/dashboard-templates/templates/Evaluation";
import { i18nFilter } from "../../../../../app/filters/ngFilters";
import { WebsiteExpandDataSidebar } from "../../../../../app/pages/workspace/common/WebsiteExpandData/WebsiteExpandData";
import { TrackWithGuidService } from "../../../../../app/services/track/TrackWithGuidService";
import InvestorsWorkspaceApiService from "../../../../../app/services/workspaces/investorsWorkspaceApiService";
import { NoData } from "../../../../components/NoData/src/NoData";
import { FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";
import { StyledBox } from "../../../../styled components/Workspace/src/StyledWorkspaceBox";
import AllContexts from "../../common components/AllContexts";
import { CommonEmptyState } from "../../common components/CommonEmptyState/CommonEmptyState";
import { IWebsitesModal, WebsitesModal } from "../../common components/Modals/src/WebsitesModal";
import { IQuickLinkData, OverviewPage } from "../../common components/OverviewPage/OverviewPage";
import {
    IRecommendationTile,
    RecommendationsSidebar,
} from "../../common components/RecommendationsSidebar/RecommendationsSidebar";
import { RightBar } from "../../common components/RightBar/src/RightBar";
import {
    WorkspaceContentContainer,
    WorkspaceWrapper,
} from "../../common components/StyledComponents";
import { InvestorsWorkspaceWrapper } from "pages/workspace/investors/src/styles";

const getDashboardQuickLinks = (domain) => [
    {
        title: "workspaces.investors.quicklinks.header.title.1",
        description: "workspaces.investors.quicklinks.header.text.1",
        templateId: Evaluation.id,
        templateTitle: `${domain} ${i18nFilter()("dashboard.templates.evaluation.title")}`,
    },
    {
        title: "workspaces.investors.quicklinks.header.title.2",
        description: "workspaces.investors.quicklinks.header.text.2",
        templateId: Benchmark.id,
        templateTitle: `${domain} ${i18nFilter()("dashboard.templates.benchmark.title")}`,
    },
];

export interface IInvestorsWorkspaceProps {
    editOpportunity: any;
    error: boolean;
    isEmptyWorkspace: boolean;
    isTableLoading: boolean;
    workspaceId: string;
    enableFindOpportunities: boolean;
    onSelectList: (id) => void;
    workspaceName: string;
    isOverviewPage: boolean;
    opportunityListId: string;
    data: any;
    opportunities: any;
    lastSnapshotDate: any;
    translate: (key) => string;
    track: (a?, b?, c?, d?) => void;
    getLink: (a, b?, c?) => string;
    onFilter: (a) => void;
    onRemoveOpportunities: (a) => void;
    onDataUpdate: () => void;
    onFindWebsites: () => void;
    onCreateNewList: () => void;
    createNewListForGenerator: () => void;
    components: any; // { [s: string]: JSX.Element };
    quickLinkData: IQuickLinkData;
    modalProps: IWebsitesModal;
    openWebsitesModal: () => void;
    emptyWorkspaceProps: { onUploadClick: () => void; onFindClick: () => void };
    goToDashboardTemplate: (templateId, keys, country, opportunityListId, templateTitle) => void;
    showErrorToast: (text) => void;
    recommendations: IRecommendationTile[];
    onAddRecommendations: (domainsArr, holdRightBarOpen?) => void;
    onDismissRecommendation: (domain) => void;
    onLinkRecommendation: (domain) => void;
    isRecommendationsLoading: boolean;
    isRightBarOpen: boolean;
    isRecommendationOpen: boolean;
    toggleRightBar: (isOpen) => void;
    onAddFromModal: (listID: any) => void;
    onAddFromWizard: (listID: any) => void;
}

const WORKSPACE_TYPE = "investors";

const FlexRowStyled = styled(FlexRow)`
    height: 100%;
`;

const WorkspaceContent = ({
    isEmptyList,
    tableProps,
    InvestorsTableContainer,
    emptyWorkspaceProps,
    error,
    translate,
    goToDashboardTemplate,
    enableFindOpportunities,
    opportunityListId,
}) => {
    return (
        <>
            {isEmptyList ? (
                <WorkspaceContentContainer>
                    <CommonEmptyState
                        workspaceType={WORKSPACE_TYPE}
                        enableFindOpportunities={enableFindOpportunities}
                        {...emptyWorkspaceProps}
                    />
                </WorkspaceContentContainer>
            ) : (
                <WorkspaceContentContainer>
                    {error ? (
                        <NoData
                            title={translate("workspaces.investors.table.nodata.title")}
                            subtitle={translate("workspaces.investors.table.nodata.subtitle")}
                        />
                    ) : (
                        <StyledBox>
                            <InvestorsTableContainer
                                key={opportunityListId}
                                {...tableProps}
                                enableFindOpportunities={enableFindOpportunities}
                                goToDashboardTemplate={goToDashboardTemplate}
                            />
                        </StyledBox>
                    )}
                </WorkspaceContentContainer>
            )}
        </>
    );
};

const getExcelTableRowHref = new InvestorsWorkspaceApiService().getExcelTableRowHref;
export const InvestorsWorkspace: StatelessComponent<IInvestorsWorkspaceProps> = ({
    editOpportunity,
    error,
    isEmptyWorkspace,
    isTableLoading,
    workspaceId,
    workspaceName,
    enableFindOpportunities,
    onSelectList,
    isOverviewPage,
    opportunityListId,
    data,
    opportunities,
    lastSnapshotDate,
    translate,
    track,
    getLink,
    onFilter,
    onRemoveOpportunities,
    onDataUpdate,
    components,
    quickLinkData,
    goToDashboardTemplate,
    modalProps,
    openWebsitesModal,
    emptyWorkspaceProps,
    onFindWebsites,
    showErrorToast,
    onCreateNewList,
    recommendations,
    onAddRecommendations,
    onDismissRecommendation,
    onLinkRecommendation,
    isRecommendationsLoading,
    isRightBarOpen,
    isRecommendationOpen,
    createNewListForGenerator,
    toggleRightBar,
    onAddFromModal,
    onAddFromWizard,
}) => {
    const { InvestorsTableContainer } = components;

    const tableProps = {
        isTableLoading,
        workspaceId,
        opportunityListId,
        data,
        opportunities,
        onFilter,
        onRemoveOpportunities,
        onDataUpdate,
        lastSnapshotDate,
        openWebsitesModal,
        onFindWebsites,
        showErrorToast,
    };
    const isEmptyList = !isTableLoading && _.isEmpty(opportunities) && !error;
    const onCloseSidebar = () => {
        toggleRightBar(false);
        $("body").trigger(CLEAR_HIGHLIGHT_CLICKED_ROW_EVENT);
    };
    return (
        <div className="sw-layout-no-scroll-container">
            <FlexRowStyled>
                <AllContexts
                    translate={translate}
                    trackWithGuid={TrackWithGuidService.trackWithGuid}
                    track={track}
                    linkFn={{ getLink }}
                    components={components}
                >
                    <div
                        className="sw-layout-scrollable-element use-sticky-css-rendering fadeIn"
                        auto-scroll-top
                    >
                        <InvestorsWorkspaceWrapper>
                            {isOverviewPage ? (
                                <OverviewPage
                                    workspaceName={workspaceName}
                                    isEmptyWorkspace={isEmptyWorkspace}
                                    onCreateNewList={onCreateNewList}
                                    quickLinkData={quickLinkData}
                                    api={new InvestorsWorkspaceApiService()}
                                    lastSnapshotDate={lastSnapshotDate.format("YYYY-MM")}
                                    workspaceId={workspaceId}
                                    workspaceType={WORKSPACE_TYPE}
                                    createNewListForGenerator={createNewListForGenerator}
                                    onAddFromModal={onAddFromModal}
                                    onAddFromWizard={onAddFromWizard}
                                    editOpportunity={editOpportunity}
                                    onSelectList={onSelectList}
                                />
                            ) : (
                                <>
                                    <WorkspaceContent
                                        opportunityListId={opportunityListId}
                                        tableProps={tableProps}
                                        isEmptyList={isEmptyList}
                                        InvestorsTableContainer={InvestorsTableContainer}
                                        emptyWorkspaceProps={emptyWorkspaceProps}
                                        error={error}
                                        translate={translate}
                                        enableFindOpportunities={enableFindOpportunities}
                                        goToDashboardTemplate={goToDashboardTemplate}
                                    />
                                    {!isEmptyList && (
                                        <RightBar
                                            primary={() => (
                                                <RecommendationsSidebar
                                                    onAddRecommendations={onAddRecommendations}
                                                    onDismissRecommendation={
                                                        onDismissRecommendation
                                                    }
                                                    onLinkRecommendation={onLinkRecommendation}
                                                    recommendations={recommendations}
                                                    isLoading={isRecommendationsLoading}
                                                />
                                            )}
                                            onCloseSidebar={onCloseSidebar}
                                            secondary={() => (
                                                <WebsiteExpandDataSidebar
                                                    getExcelTableRowHref={getExcelTableRowHref}
                                                    getDashboardQuickLinks={getDashboardQuickLinks}
                                                    goToDashboardTemplate={goToDashboardTemplate}
                                                />
                                            )}
                                            isOpen={isRightBarOpen}
                                            isPrimaryOpen={isRecommendationOpen}
                                            isTableLoading={isTableLoading}
                                        />
                                    )}
                                </>
                            )}
                        </InvestorsWorkspaceWrapper>
                        <WebsitesModal
                            {...modalProps}
                            placeholder={"workspace.investors.websites.modal.placeholder"}
                        />
                    </div>
                </AllContexts>
            </FlexRowStyled>
        </div>
    );
};
