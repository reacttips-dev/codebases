import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { IArena } from "services/marketingWorkspaceApiService";
import { adaptArenasData } from "../../../Services/MarketingWorkspaceDataHandler";
import {
    NavBarSimpleItem,
    NavBarGroupItemWithButton,
    NavBarIcon,
} from "@similarweb/ui-components/dist/navigation-bar";
import { EmptyGroupItem } from "../../NavItems/EmptyGroupItem";
import { IMarketingWorkspaceServices } from "../../MarketingWorkspaceNavBarBodyTypes";
import { colorsPalettes } from "@similarweb/styles";

interface IMarketingWorkspaceArenasGroupProps {
    arenas: IArena[];
    selectedArenaTab: number;
    selectedArenaId?: string;
    services: IMarketingWorkspaceServices;
}

export const MarketingWorkspacesArenasGroup: FC<IMarketingWorkspaceArenasGroupProps> = (props) => {
    const { arenas, selectedArenaTab, services, selectedArenaId } = props;

    const [isGroupOpened, setIsGroupOpened] = useState(true);

    const hasArenas = useMemo(() => {
        return arenas && arenas.length > 0;
    }, [arenas]);

    const hasSelectedArena = useMemo(() => {
        return arenas?.some((arena) => arena.id === selectedArenaId) ?? false;
    }, [arenas, selectedArenaId]);

    useEffect(() => {
        // In case the current nav item has no arenas, or a subitem (arena)
        // was selected - we want to make sure that it is opened, and cannot be closed
        if (!hasArenas || hasSelectedArena) {
            setIsGroupOpened(true);
        }
    }, [hasArenas, hasSelectedArena, setIsGroupOpened]);

    const renderArenaItems = useCallback(() => {
        return adaptArenasData(arenas, selectedArenaTab, services).map((arena) => {
            return (
                <NavBarSimpleItem
                    key={arena.id}
                    id={arena.id}
                    text={arena.name}
                    isSelected={arena.id === selectedArenaId}
                    onClick={arena.onClick}
                />
            );
        });
    }, [arenas, selectedArenaTab, services, selectedArenaId]);

    const handleAddArenaClick = useCallback(() => {
        services.swNavigator.go("marketingWorkspace-arena-new");
    }, [services]);

    const handleGroupClick = useCallback(() => {
        /**
         * We want to keep the nav item constantly opened (ignore user toggle) in cases
         * where it has a selected arena (to avoid closing the nav item when it has a selected child)
         * or in cases where it has no items at all. (so that the user will see the "add new item" message)
         */
        if (hasSelectedArena || !hasArenas) {
            return;
        }

        setIsGroupOpened(!isGroupOpened);
    }, [services, isGroupOpened, setIsGroupOpened, hasSelectedArena, hasArenas]);

    const renderEmptyGroupItem = useCallback(() => {
        return (
            <EmptyGroupItem
                text={services.translate("workspaces.marketing.sidenav.arenas.new.text")}
                buttonText={services.translate(`workspaces.marketing.sidenav.arenas.new`)}
                onButtonClick={handleAddArenaClick}
            />
        );
    }, [services, handleAddArenaClick]);

    /**
     * We want to keep the nav item constantly opened (ignore user toggle) in cases
     * where it has a selected arena (to avoid closing the nav item when it has a selected child)
     * or in cases where it has no items at all. (so that the user will see the "add new item" message)
     */
    const arenaItems = hasArenas ? renderArenaItems() : renderEmptyGroupItem();

    return (
        <NavBarGroupItemWithButton
            id="arenas-group"
            text={services.translate(`workspaces.marketing.sidenav.arenas`)}
            isOpened={isGroupOpened}
            onClick={handleGroupClick}
            onButtonClick={() => handleAddArenaClick()}
            renderIconToggle={(isOpen) => (
                <NavBarIcon
                    iconName="category"
                    iconSize="xs"
                    iconColor={colorsPalettes.navigation.ICON_DARK}
                />
            )}
        >
            {arenaItems}
        </NavBarGroupItemWithButton>
    );
};
