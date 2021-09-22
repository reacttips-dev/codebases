/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { FC, FunctionComponent, useMemo, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { i18nFilter } from "filters/ngFilters";
import { swSettings } from "common/services/swSettings";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import {
    IArena,
    IMarketingWorkspace,
    marketingWorkspaceApiService,
} from "services/marketingWorkspaceApiService";
import { ECategoryType } from "common/services/categoryService.types";
import { WorkspaceSettingsModal } from "components/Workspace/WorkspaceSettingsModal/src/WorkspaceSettingsModal";
import { marketingWorkspaceGo } from "pages/workspace/marketing/MarketingWorkspaceCtrl";
import swLog from "@similarweb/sw-log";

const IconContainer = styled.div<{ paddingLeft: number }>`
    position: relative;
    bottom: 18px;
    padding-left: ${({ paddingLeft }) => paddingLeft}px;
    transition: all 0.2s ease-out;
    ${SWReactIcons} {
        svg {
            width: 24px;
            height: 24px;
        }
    }
`;

export const SNSettingsIcon = styled(SWReactIcons)`
    cursor: pointer;
    &:hover {
        svg {
            path {
                fill: ${colorsPalettes.blue[400]};
            }
        }
    }
`;
enum SettingsTabs {
    GENERAL = 0,
    ASSETS_MANAGEMENT = 1,
}

interface IMarketingWorkspaceNavBarFooterProps {
    workspaceId: string;
    workspaceName: string;
    arenas: IArena[];
    customIndustries: any[];
    keywordGroups: any[];
    params: {
        websiteGroupId?: string;
        keywordGroupId?: string;
        arenaId?: string;
        country?: string;
    };
    marketingWorkspaceSetAllParams: (params) => void;
}

export const MarketingWorkspaceNavBarFooter: FC<IMarketingWorkspaceNavBarFooterProps> = (props) => {
    const { arenas, params, keywordGroups, workspaceId, customIndustries } = props;
    const workspaceInitialName = props.workspaceName;

    const [showWorkspaceSettingsModal, setShowWorkspaceSettingsModal] = useState(false);
    const [settingsInitialTab, setSettingsInitialTab] = useState(SettingsTabs.ASSETS_MANAGEMENT);
    const [isLoading, setIsLoading] = useState(false);
    const [workspaceName, setWorkspaceName] = useState(workspaceInitialName);
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const showKeywordGroups = !swSettings.user.hasDM && !swSettings.user.hasMR;
    const showPartnerLists = !swSettings.user.hasDM && !swSettings.user.hasMR;
    const keywordGroupsForManageAssetsModal = showKeywordGroups
        ? keywordGroups.map((group) => ({
              displayName: group.name,
              count: group.keywords.length,
              selected: group.linked,
              id: group.id,
          }))
        : [];
    const websitesGroupsForManageAssetsModal = customIndustries
        .filter((industry) => {
            // only categories tagged as partners list
            return industry.categoryType === ECategoryType.PARTNERS_LIST;
        })
        .map((industry) => ({
            displayName: industry.name,
            count: industry.domains.length,
            selected: industry.linked,
            id: industry.id,
        }));
    const settingModalKey = `${showWorkspaceSettingsModal}-${keywordGroupsForManageAssetsModal.length}-${websitesGroupsForManageAssetsModal.length}`;

    const hideWorkspaceSettingsModal = (callback = null) => {
        setShowWorkspaceSettingsModal(false);
        callback && callback();
    };

    const getSelectedGroups = (groups) => {
        return groups.reduce((result, group) => {
            if (group.visible) {
                return [...result, group.id];
            }
            return result;
        }, []);
    };

    const onWorkspaceSave = async ({ websitesGroups = [], keywordsGroups = [] }, workspaceName) => {
        try {
            await marketingWorkspaceApiService.updateMarketingWorkspace(workspaceId, workspaceName);
            await marketingWorkspaceApiService.overrideWorkspaceLinkedGroups(
                workspaceId,
                getSelectedGroups(websitesGroups),
                getSelectedGroups(keywordsGroups),
            );
            const { name } = swNavigator.current();
            const params = swNavigator.getParams();
            swNavigator.go(name, params, { reload: true });
        } catch (e) {
            swLog.error(`Error while trying to update workspace ${workspaceId}: `, e);
        } finally {
            setIsLoading(false);
            setShowWorkspaceSettingsModal(false);
        }
    };

    const onWorkspaceDelete = async () => {
        try {
            const remove = await marketingWorkspaceApiService.removeMarketingWorkspace(workspaceId);
            const workspaces = await marketingWorkspaceApiService.getMarketingWorkspaces();
            // redirect to wizard
            if (workspaces.length === 0) {
                swNavigator.go("marketingWorkspace-new");
            } else {
                // redirect to the next workspace
                const nextWorkspace = workspaces[0];
                hideWorkspaceSettingsModal(async () => {
                    await marketingWorkspaceGo("marketingWorkspace-arena", {
                        workspaceId: nextWorkspace.id,
                        arenaId: nextWorkspace.arenas[0].id,
                    });
                });
            }
        } catch (e) {
            swLog.error(`Error while trying to remove workspace ${props.workspaceId}: `, e);
        } finally {
            setShowWorkspaceSettingsModal(false);
        }
    };
    const maxAllowedWorkspaces = swSettings.components.MarketingWorkspace.resources
        .WorkspacesLimit as number;

    return (
        maxAllowedWorkspaces > 1 && (
            <div>
                <PlainTooltip
                    placement="top-left"
                    tooltipContent={i18nFilter()("workspaces.marketing.sidenav.setting.tooltip")}
                    cssClass="plainTooltip-element marketing-workspace-settings"
                >
                    <IconContainer paddingLeft={8}>
                        <div
                            onClick={() => {
                                setShowWorkspaceSettingsModal(true);
                            }}
                        >
                            <SNSettingsIcon
                                iconName="settings"
                                iconSize="sm"
                                hideOnCollapse={false}
                            />
                        </div>
                    </IconContainer>
                </PlainTooltip>
                <WorkspaceSettingsModal
                    key={settingModalKey}
                    isOpen={showWorkspaceSettingsModal}
                    onCancel={hideWorkspaceSettingsModal}
                    workspaceName={workspaceName}
                    onSave={onWorkspaceSave}
                    onDeleteWorkspace={onWorkspaceDelete}
                    arenas={arenas.map((arena) => arena.friendlyName)}
                    workspaceOriginalName={workspaceInitialName}
                    isLoading={isLoading}
                    initialTab={settingsInitialTab}
                    showKeywordGroups={showKeywordGroups}
                    showPartnerLists={showPartnerLists}
                />
            </div>
        )
    );
};

const mapStateToProps = ({
    marketingWorkspace: { allWorkspaces, selectedWorkspace, selectedArenaTab },
    routing,
}) => {
    const {
        id,
        arenas,
        title,
        customIndustries,
        keywordGroups,
        sharedKeywordGroups,
    } = selectedWorkspace;
    const { params } = routing;
    return {
        selectedArenaTab,
        allWorkspaces,
        workspaceId: id,
        workspaceName: title,
        arenas,
        customIndustries,
        keywordGroups,
        sharedKeywordGroups,
        params,
    };
};

export default connect(mapStateToProps, null)(MarketingWorkspaceNavBarFooter);
