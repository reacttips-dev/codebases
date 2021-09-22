import { SWReactIcons } from "@similarweb/icons";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import NgRedux from "ng-redux";
import React from "react";
import styled from "styled-components";
import { hasWorkSpacesPermission } from "../../../services/Workspaces.service";
import BaseWorkspaceApiService from "../../../services/workspaces/baseWorkspaceApiService";
import { getWsConfigFromState, IWsConfig } from "../config/stateToWsConfigMap";
import { selectActiveOpportunityListId, selectActiveWorkspaceId } from "./selectors";

declare const similarweb;
export const hasMobileWeb = (country) =>
    swSettings.current.resources.MobileWebCountries.includes(country);

export function HasWorkspaceTrialPermission(): boolean {
    const proWindow: any = window;
    return (
        proWindow.similarweb.settings.components.Workspaces.resources.WorkspaceType === "Trial" ||
        proWindow.similarweb.settings.components.Workspaces.resources.WorkspaceType ===
            "MarketingTrial" ||
        (_.isArray(proWindow.similarweb.settings.components.Workspaces.resources.WorkspaceType) &&
            _.find(
                proWindow.similarweb.settings.components.Workspaces.resources.WorkspaceType,
                (workspace: string) => workspace === "Trial" || workspace === "MarketingTrial",
            ) !== undefined)
    );
}

export async function isDomainInWorkspace(domain) {
    if (hasWorkSpacesPermission()) {
        // enough to check here, because it is method from base class and checks for every workspace type
        const baseApiService = new BaseWorkspaceApiService();
        const lists = await baseApiService.getTrackingStatus(domain);
        if (lists.length === 0) {
            return { hasLists: false };
        }
        return {
            hasLists: true,
            isTracked: lists.every(({ isTracked }) => isTracked),
        };
    }
    return { hasLists: false };
}

export function shouldLockModule(AvaliabilityMode) {
    return /hidden|locked|hook/i.test(AvaliabilityMode);
}

function applySubItemsPermissions(subItems = []) {
    return subItems.map((subItem) => {
        const { wsComponent: wsCmpName } = (getWsConfigFromState(
            { name: subItem.state },
            subItem.tab,
        ) || {}) as IWsConfig;
        const wsComponent = similarweb.settings.components[wsCmpName];
        if (wsComponent && wsComponent.resources && wsComponent.resources.AvaliabilityMode) {
            return {
                ...subItem,
                lockIcon: shouldLockModule(wsComponent.resources.AvaliabilityMode),
            };
        }
        return subItem;
    });
}

export function applyNavItemPermissions(item) {
    if (hasWorkSpacesPermission() && !HasWorkspaceTrialPermission()) {
        const subItemsWithPermissions = applySubItemsPermissions(item.subItems);
        if (subItemsWithPermissions.length) {
            return {
                ...item,
                subItems: subItemsWithPermissions,
            };
        }
        return item;
    }
    return item;
}

const IconContainer = styled.div`
    margin-left: 2px;
`;

export const desktopOnlyIndicator = (country) => () => {
    if (!hasMobileWeb(country)) {
        return (
            <IconContainer>
                <SWReactIcons size={"xs"} iconName={"desktop"} className="subtitle-websource" />
            </IconContainer>
        );
    }
    return false;
};

export function isListActive(listId, workspaceId) {
    const { commonWorkspace } = Injector.get<NgRedux.INgRedux>("$ngRedux").getState();
    const activeListId = selectActiveOpportunityListId(commonWorkspace);
    const activeWorkspaceId = selectActiveWorkspaceId(commonWorkspace);
    return activeListId === listId && activeWorkspaceId === workspaceId;
}

export function COPYisListActive(listId, workspaceId) {
    const { legacySalesWorkspace } = Injector.get<NgRedux.INgRedux>("$ngRedux").getState();
    const activeListId = selectActiveOpportunityListId(legacySalesWorkspace);
    const activeWorkspaceId = selectActiveWorkspaceId(legacySalesWorkspace);
    return activeListId === listId && activeWorkspaceId === workspaceId;
}

export const isValidURL = (str) => {
    const pattern = new RegExp(
        "^((ft|htt)ps?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)+[a-z]{2,}|" + // domain name and extension
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?" + // port
        "(\\/[-a-z\\d%@_.~+&:]*)*" + // path
        "(\\?[;&a-z\\d%@_.,~+&:=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$",
        "i",
    ); // fragment locator
    return !!pattern.test(str);
};

export const safeParse = (str: string, defaultValue?: any) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return defaultValue;
    }
};
