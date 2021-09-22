import { WorkspaceContentContainer } from "pages/workspace/common components/StyledComponents";
import { CommonEmptyState } from "pages/workspace/common components/CommonEmptyState/CommonEmptyState";
import { NoData } from "components/NoData/src/NoData";
import { StyledBox } from "styled components/Workspace/src/StyledWorkspaceBox";
import * as React from "react";

const WORKSPACE_TYPE = "sales";

const WorkspaceContent = ({
    isEmptyList,
    tableProps,
    SalesTableContainer,
    emptyWorkspaceProps,
    error,
    translate,
    modalProps,
    goToDashboardTemplate,
    enableFindOpportunities,
    opportunityListId,
    isGeneratorLimited,
    checkIsGeneratorLocked,
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
                            title={translate("workspaces.sales.table.nodata.title")}
                            subtitle={translate("workspaces.sales.table.nodata.subtitle")}
                        />
                    ) : (
                        <StyledBox>
                            <SalesTableContainer
                                key={opportunityListId}
                                {...tableProps}
                                isWebsitesModalOpen={modalProps.isOpen}
                                enableFindOpportunities={enableFindOpportunities}
                                goToDashboardTemplate={goToDashboardTemplate}
                                isGeneratorLimited={isGeneratorLimited}
                                checkIsGeneratorLocked={checkIsGeneratorLocked}
                            />
                        </StyledBox>
                    )}
                </WorkspaceContentContainer>
            )}
        </>
    );
};

export default WorkspaceContent;
