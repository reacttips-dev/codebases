import * as React from "react";
import {LoadingSkeleton} from "@bbyca/bbyca-components";
import {SyncedNav, Navigation} from "@bbyca/bbyca-components";
import {NavigationLink, SideNavigationNode, convertLangToLocale} from "models";
import {convertLocaleToLang} from "models";
import {routeManager, Key} from "@bbyca/apex-components";
import {RouteActions} from "react-router-redux";
import {replaceAllSpacesBy} from "utils/stringUtils";

export interface Props {
    isLoading: boolean;
    backToText: string;
    tree: NavigationLink;
    isMobile: boolean;
}

interface Params {
    name: string;
    id?: string;
}

export const SideNavigation = (props: Props) => {
    return props.isLoading ? (
        <LoadingSkeleton.SideNavigation />
    ) : props.isMobile ? (
        <Navigation tree={props.tree} backToText={props.backToText} isMobile={props.isMobile} />
    ) : (
        <SyncedNav tree={props.tree} backToText={props.backToText} />
    );
};

export const createNavigationLink = (
    sideNavigationNode: SideNavigationNode,
    params: Params,
    language: Language,
    router: RouteActions,
    pageKey: Key,
): NavigationLink => toNavigationLinkRecursive(sideNavigationNode, null, 0, params, pageKey, language, router);

export const findPath = (node: NavigationLink) => {
    if (node.isSelected) {
        return node.pathLinks;
    }
    let path = null;
    for (const link of node.links) {
        path = findPath(link);
        if (path !== null) {
            break;
        }
    }
    return path;
};

const MAX_ITERATIONS = 100;

const toNavigationLinkRecursive = (
    node: any,
    parent: NavigationLink,
    currIteration: number,
    params: Params,
    pageKey?: Key,
    language?: Language,
    router?: RouteActions,
): NavigationLink => {
    if (currIteration === MAX_ITERATIONS) {
        return null;
    }
    const result = buildLink(node, parent, params, pageKey, language, router);
    if (!node.links && node.children) {
        node.links = node.children;
    }
    node.links.forEach((childNode) => {
        const mappedChildNode = toNavigationLinkRecursive(
            childNode,
            result,
            currIteration + 1,
            params,
            pageKey,
            language,
            router,
        );

        if (mappedChildNode && mappedChildNode.isOpen) {
            result.isOpen = true;
        }

        result.links.push(mappedChildNode);
    });

    return result;
};

const buildLink = (
    node: SideNavigationNode,
    parent: NavigationLink,
    params: Params,
    pageKey: Key,
    language: Language,
    router: RouteActions,
): NavigationLink => {
    const path = node.path ? `/${convertLangToLocale(language).toLowerCase()}${node.path}` : "";
    return {
        title: node.title,
        links: [],
        id: node.id,
        isSelected: node.active || (params.id || params.name) === node.id,
        isOpen: node.children && node.children.findIndex((child) => (params.id || params.name) === child.id) !== -1,
        path,
        pathLinks: addPathLink(parent && parent.pathLinks ? parent.pathLinks : [], node, params, pageKey),
        onClick: buildOnClickCallBack(node, language, params, router, pageKey),
        dataAutomation: `secondary-nav-${replaceAllSpacesBy(node.title, "-").toLowerCase()}`,
    };
};

const buildOnClickCallBack = (
    node: SideNavigationNode,
    language: Language,
    params: Params,
    router: RouteActions,
    pageKey: Key,
) => {
    return (e: React.MouseEvent) => {
        if (node.path) {
            router.push(`/${convertLangToLocale(language).toLowerCase()}${node.path}`);
        } else {
            router.push(
                routeManager.getPathByKey(
                    convertLocaleToLang(language as Locale),
                    pageKey,
                    node.seo || params.name,
                    node.id,
                ),
            );
        }
        e.stopPropagation();
    };
};

const addPathLink = (parentPathLinks: any, sideNavigationNode: SideNavigationNode, params: Params, pageKey: Key) =>
    parentPathLinks.concat({
        label: sideNavigationNode.title,
        linkType: pageKey,
        seoText: sideNavigationNode.seo || params.name,
        linkTypeId: sideNavigationNode.id,
    });

export default SideNavigation;
