import React, { FunctionComponent } from "react";
import { isEmpty } from "lodash";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import SalesWorkspaceApiService from "../../../../../app/services/workspaces/salesWorkspaceApiService";
import AllContexts from "../../common components/AllContexts";
import { IWebsitesModal, WebsitesModal } from "../../common components/Modals/src/WebsitesModal";
import {
    IQuickLinkData,
    OverviewPage,
} from "../../common components/OverviewPage/COPY_OverviewPage";
import { WorkspaceWrapper } from "../../common components/StyledComponents";
import { StyledFlexRow } from "pages/workspace/sales/src/styles";
import WorkspaceContent from "pages/workspace/sales/src/WorkspaceContent";
import { IRecommendationTile } from "../../common components/RecommendationsSidebar/RecommendationsSidebar";
import RightBarSalesContainer from "pages/workspace/sales/src/RightBarSalesContainer";

export interface ISalesWorkspaceProps {
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
    onAddFromModal: (listID: any) => void;
    onAddFromWizard: (listID: any) => void;
    isGeneratorLimited?: boolean;
    checkIsGeneratorLocked?: () => Promise<boolean>;
    activeSelectedRow: boolean;
    recommendations: IRecommendationTile[];
    onAddRecommendations: (domainsArr, holdRightBarOpen?) => void;
    onDismissRecommendation: (domain) => void;
    onLinkRecommendation: (domain) => void;
    isRecommendationsLoading: boolean;
    isRecommendationOpen: boolean;
    toggleRecommendations(status: boolean): void;
}

const WORKSPACE_TYPE = "sales";

const getExcelTableRowHref = new SalesWorkspaceApiService().getExcelTableRowHref;

export const SalesWorkspace: FunctionComponent<ISalesWorkspaceProps> = ({
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
    createNewListForGenerator,
    onAddFromModal,
    onAddFromWizard,
    recommendations,
    onAddRecommendations,
    onDismissRecommendation,
    onLinkRecommendation,
    isRecommendationsLoading,
    isRecommendationOpen,
    isGeneratorLimited,
    checkIsGeneratorLocked,
    activeSelectedRow,
    toggleRecommendations,
}) => {
    const { SalesTableContainer } = components;
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
        activeSelectedRow,
    };
    const isEmptyList = !isTableLoading && isEmpty(opportunities) && !error;

    const renderRightBar = () => {
        if (isEmptyList) {
            return null;
        }

        return (
            <RightBarSalesContainer
                getExcelTableRowHref={getExcelTableRowHref}
                isRecommendationOpen={isRecommendationOpen}
                toggleRecommendations={toggleRecommendations}
                onAddRecommendations={onAddRecommendations}
                onDismissRecommendation={onDismissRecommendation}
                onLinkRecommendation={onLinkRecommendation}
                recommendations={recommendations}
                isLoading={isRecommendationsLoading}
            />
        );
    };

    return (
        <div className="sw-layout-no-scroll-container">
            <StyledFlexRow>
                <AllContexts
                    translate={translate}
                    track={track}
                    linkFn={{ getLink }}
                    components={components}
                    trackWithGuid={TrackWithGuidService.trackWithGuid}
                >
                    <div
                        className="sw-layout-scrollable-element use-sticky-css-rendering fadeIn"
                        auto-scroll-top="true"
                    >
                        <WorkspaceWrapper>
                            {isOverviewPage ? (
                                <OverviewPage
                                    workspaceName={workspaceName}
                                    isEmptyWorkspace={isEmptyWorkspace}
                                    onCreateNewList={onCreateNewList}
                                    quickLinkData={quickLinkData}
                                    api={new SalesWorkspaceApiService()}
                                    lastSnapshotDate={lastSnapshotDate.format("YYYY-MM")}
                                    workspaceId={workspaceId}
                                    workspaceType={WORKSPACE_TYPE}
                                    createNewListForGenerator={createNewListForGenerator}
                                    onAddFromModal={onAddFromModal}
                                    onAddFromWizard={onAddFromWizard}
                                    isGeneratorLimited={isGeneratorLimited}
                                    checkIsGeneratorLocked={checkIsGeneratorLocked}
                                    onSelectList={onSelectList}
                                    editOpportunity={editOpportunity}
                                />
                            ) : (
                                <>
                                    <WorkspaceContent
                                        modalProps={modalProps}
                                        opportunityListId={opportunityListId}
                                        tableProps={tableProps}
                                        isEmptyList={isEmptyList}
                                        SalesTableContainer={SalesTableContainer}
                                        emptyWorkspaceProps={emptyWorkspaceProps}
                                        error={error}
                                        translate={translate}
                                        enableFindOpportunities={enableFindOpportunities}
                                        goToDashboardTemplate={goToDashboardTemplate}
                                        isGeneratorLimited={isGeneratorLimited}
                                        checkIsGeneratorLocked={checkIsGeneratorLocked}
                                    />
                                    {renderRightBar()}
                                </>
                            )}
                        </WorkspaceWrapper>
                        <WebsitesModal
                            {...modalProps}
                            placeholder={"workspace.sales.websites.modal.placeholder"}
                        />
                    </div>
                </AllContexts>
            </StyledFlexRow>
        </div>
    );
};
