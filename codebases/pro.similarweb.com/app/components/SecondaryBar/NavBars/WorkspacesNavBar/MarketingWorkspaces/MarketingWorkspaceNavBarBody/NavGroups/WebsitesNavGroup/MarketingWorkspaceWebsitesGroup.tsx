import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
    NavBarGroupItemWithMenu,
    NavBarSimpleItem,
    NavBarIcon,
} from "@similarweb/ui-components/dist/navigation-bar";
import { adaptWebsitesData } from "components/SecondaryBar/NavBars/WorkspacesNavBar/MarketingWorkspaces/Services/MarketingWorkspaceDataHandler";
import { IArena, marketingWorkspaceApiService } from "services/marketingWorkspaceApiService";
import { EmptyGroupItemWithMenu } from "../../NavItems/EmptyGroupItemWithMenu";
import { ECategoryType } from "common/services/categoryService.types";
import { marketingWorkspaceGo } from "pages/workspace/marketing/MarketingWorkspaceCtrl";
import { BenchmarkToArenaModal } from "components/Workspace/BenchmarkToArena/src/BenchmarkToArenaModal";
import CountryService from "services/CountryService";
import { BenchmarkToArenaItem } from "components/Workspace/BenchmarkToArena/src/BenchmarkToArenaItem";
import { IMarketingWorkspaceServices } from "components/SecondaryBar/NavBars/WorkspacesNavBar/MarketingWorkspaces/MarketingWorkspaceNavBarBody/MarketingWorkspaceNavBarBodyTypes";
import { colorsPalettes } from "@similarweb/styles";
import { GroupDropdownMenuItem } from "../../NavGroupComponents/GroupDropdownMenuItem";
import { CustomCategoriesWizard } from "components/customCategoriesWizard/CustomCategoriesWizard";

interface IMarketingWorkspaceWebsitesGroupProps {
    services: IMarketingWorkspaceServices;
    arenas: IArena[];
    customIndustries: any[];
    selectedWebsiteGroupId?: string;
    websiteGroupRecommendationEngineOn: string;
    currentPage: string;
    workspaceId: string;
    setMarketingWorkspaceSetRecommendationEngine: (arenaId) => void;
}

export const MarketingWorkspaceWebsitesGroup: FC<IMarketingWorkspaceWebsitesGroupProps> = (
    props,
) => {
    const {
        customIndustries,
        arenas,
        websiteGroupRecommendationEngineOn,
        currentPage,
        selectedWebsiteGroupId,
        workspaceId,
        setMarketingWorkspaceSetRecommendationEngine,
        services,
    } = props;

    const [isGroupOpened, setIsGroupOpened] = useState(true);
    const [isGroupRecModalOpen, setIsGroupRecModalOpen] = useState(false);
    const [showCustomCategoriesWizard, setShowCustomCategoriesWizard] = useState(false);

    const hasWebsiteGroupsData = useMemo(() => {
        return customIndustries && customIndustries.length > 0;
    }, [customIndustries]);

    const hasSelectedWebsiteGroup = useMemo(() => {
        return customIndustries?.some((x) => x.id === selectedWebsiteGroupId) ?? false;
    }, [customIndustries, selectedWebsiteGroupId]);

    useEffect(() => {
        // In case the current nav item has no websites, or a subitem (website)
        // was selected - we want to make sure that it is opened, and cannot be closed
        if (hasSelectedWebsiteGroup || !hasWebsiteGroupsData) {
            setIsGroupOpened(true);
        }
    }, [hasSelectedWebsiteGroup, hasWebsiteGroupsData, setIsGroupOpened]);

    const onWebsiteGroupRecommendationEngine = useCallback(
        (arena) => () => {
            setIsGroupRecModalOpen(false);
            setMarketingWorkspaceSetRecommendationEngine(arena.id);
            marketingWorkspaceGo("marketingWorkspace-websiteGroupRecommendation", {
                arenaId: arena.id,
                duration: "3m",
                websource: "Desktop",
                country: arena.country,
            });
        },
        [setIsGroupRecModalOpen, setMarketingWorkspaceSetRecommendationEngine],
    );

    const renderArenasForGroupRecommenadation = useCallback(() => {
        const arenaItems = arenas.map((arena, index) => {
            const countryObj = CountryService.getCountryById(arena.country);
            return (
                <BenchmarkToArenaItem
                    key={`arena-${index}`}
                    country={countryObj}
                    title={arena.friendlyName}
                    competitorsIcons={arena.competitors.map((competitor) => competitor.favicon)}
                    mainDomain={arena.allies[0]}
                    onClick={onWebsiteGroupRecommendationEngine(arena)}
                />
            );
        });

        return arenaItems.length > 0 ? arenaItems : null;
    }, [arenas, onWebsiteGroupRecommendationEngine]);

    const renderMenuItems = useCallback(() => {
        return [
            <GroupDropdownMenuItem
                key={"partner-list"}
                id={"partnerList"}
                title={services.translate("add.website.group.list.title")}
                description={services.translate("add.website.group.list.description")}
                iconName="add"
            />,
            <GroupDropdownMenuItem
                key={"find-new-partners"}
                id={"findNewPartners"}
                title={services.translate("add.website.group.recommendation.title")}
                description={services.translate("add.website.group.recommendation.description")}
                iconName="wand"
            />,
        ];
    }, []);

    const handleGroupClick = useCallback(() => {
        /**
         * We want to keep the nav item constantly opened (ignore user toggle) in cases
         * where it has a selected website (to avoid closing the nav item when it has a selected child)
         * or in cases where it has no items at all. (so that the user will see the "add new item" message)
         */
        if (hasSelectedWebsiteGroup || !hasWebsiteGroupsData) {
            return;
        }

        setIsGroupOpened(!isGroupOpened);
    }, [isGroupOpened, setIsGroupOpened, hasSelectedWebsiteGroup, hasWebsiteGroupsData]);

    const handleMenuItemClick = useCallback(
        (item): void => {
            switch (item.id) {
                case "partnerList":
                    setShowCustomCategoriesWizard(true);
                    return;

                case "findNewPartners":
                    setIsGroupRecModalOpen(true);
                    return;

                default:
                    return;
            }
        },
        [setIsGroupRecModalOpen, workspaceId, services],
    );

    const renderWebsiteGroupItems = useCallback(() => {
        return adaptWebsitesData(
            customIndustries,
            arenas,
            websiteGroupRecommendationEngineOn,
            currentPage,
            services,
        )
            .filter((group) => group.linked)
            .map((group) => {
                const hasKeywordItems = group.totalItems > 0;
                const groupText = hasKeywordItems
                    ? `${group.name} (${group.totalItems})`
                    : `${group.name}`;

                return (
                    <NavBarSimpleItem
                        key={group.id}
                        id={group.id}
                        text={groupText}
                        isSelected={group.id === selectedWebsiteGroupId}
                        onClick={group.onClick}
                    />
                );
            });
    }, [
        customIndustries,
        arenas,
        websiteGroupRecommendationEngineOn,
        currentPage,
        services,
        selectedWebsiteGroupId,
    ]);

    const renderEmptyGroupItem = useCallback(() => {
        return (
            <EmptyGroupItemWithMenu
                text={services.translate("workspaces.marketing.sidenav.websiteGroups.new.text")}
                buttonText={services.translate(`workspaces.marketing.sidenav.websitegroups.new`)}
                onMenuItemClick={handleMenuItemClick}
                getMenuItems={renderMenuItems}
            />
        );
    }, [services, handleMenuItemClick, renderMenuItems]);

    const onSaveCustomCategory = async (modal, data) => {
        const addedGroup = data.find((group) => group.Name === modal.ctrl.categoryName);
        if (addedGroup) {
            try {
                await marketingWorkspaceApiService.linkWebsiteGroupToWorkspace(
                    addedGroup.Id,
                    workspaceId,
                );
                marketingWorkspaceGo("marketingWorkspace-websiteGroup", {
                    workspaceId: workspaceId,
                    websiteGroupId: addedGroup.Id,
                    sites: null,
                });
            } catch (e) {}
        }
        setShowCustomCategoriesWizard(false);
    };

    const websiteGroupItems = hasWebsiteGroupsData
        ? renderWebsiteGroupItems()
        : renderEmptyGroupItem();

    return (
        <>
            <CustomCategoriesWizard
                isOpen={showCustomCategoriesWizard}
                onClose={() => {
                    setShowCustomCategoriesWizard(false);
                }}
                wizardProps={{
                    stayOnPage: true,
                    namePlaceholder:
                        "workspaces.marketing.customcategories.wizard.name.placeholder",
                    editorTitle: "workspaces.marketing.customcategories.wizard.editor.title",
                    placeholder:
                        "workspaces.marketing.customcategories.wizard.editor.placeholder.bold",
                    isCategoryTypeDisabled: true,
                    initialCategoryType: ECategoryType.PARTNERS_LIST,
                    onSave: onSaveCustomCategory,
                }}
            />
            <NavBarGroupItemWithMenu
                id={"websites-group"}
                text={services.translate("workspaces.marketing.sidenav.websitegroups")}
                isOpened={isGroupOpened}
                onClick={handleGroupClick}
                getMenuItems={renderMenuItems}
                onMenuItemClick={handleMenuItemClick}
                menuWidth={"328px"}
                renderIconToggle={(isOpen) => (
                    <NavBarIcon
                        iconName="group-shared"
                        iconSize="xs"
                        iconColor={colorsPalettes.navigation.ICON_DARK}
                    />
                )}
            >
                {websiteGroupItems}
            </NavBarGroupItemWithMenu>
            <BenchmarkToArenaModal
                isOpen={isGroupRecModalOpen}
                title={services.translate(
                    "workspaces.marketing.websitegroup.recommendation.modal.title",
                )}
                subTitle={services.translate(
                    "workspaces.marketing.websitegroup.recommendation.modal.subtitle",
                )}
                onCloseClick={() => setIsGroupRecModalOpen(false)}
            >
                {renderArenasForGroupRecommenadation()}
            </BenchmarkToArenaModal>
        </>
    );
};
