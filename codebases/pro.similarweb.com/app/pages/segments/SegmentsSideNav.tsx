import { toggleSideNav } from "actions/layoutActions";
import {
    toggleCreateUpdateSegmentGroupModal,
    toggleDeleteSegmentGroupModal,
} from "actions/segmentsModuleActions";
import { Injector } from "common/ioc/Injector";
import { isLocked } from "common/services/pageClaims";
import { SideNav } from "components/React/SideNavComponents/SideNav";
import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import {
    isBeta,
    isItemDisabled,
    isNew,
    navItemTooltip,
    trackSideNavItemClick,
} from "components/React/SideNavComponents/SideNav.utils";
import {
    SideNavList,
    SideNavListScrollSpace,
} from "components/React/SideNavComponents/SideNavList";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";

const SegmentsSideNav: React.FC<any> = (props) => {
    const swNavigator = Injector.get<any>("swNavigator");
    const SegmentsNavObj = [
        {
            title: "analysis.traffic.title",
            name: "segments",
            subItems: [
                {
                    title: "segment.analysis.traffic.engagement.title",
                    name: "segmentOverview",
                    state: "segments-analysis-traffic",
                    options: {
                        isUSStatesSupported: false,
                        isVirtualSupported: false,
                    },
                },
                {
                    title: "segment.analysis.marketingChannels.title",
                    name: "segmentTrafficChannels",
                    state: "segments-analysis-marketingChannels",
                    options: {
                        isUSStatesSupported: false,
                        isVirtualSupported: false,
                    },
                },
                {
                    title: "segments.analysis.geography.title",
                    name: "segmentGeography",
                    state: "segments-analysis-geography",
                    options: {
                        isUSStatesSupported: false,
                        isVirtualSupported: false,
                    },
                },
            ],
        },
    ];
    const getSideNavList = (activeItemName, params) => {
        return SegmentsNavObj.map((listItem: INavItem) => {
            if (_.isUndefined(listItem.subItems)) {
                return { ...interpretNavItem(listItem, activeItemName, params) };
            } else {
                return {
                    ...listItem,
                    title: i18nFilter()(listItem.title),
                    subItems: listItem.subItems.map((subItem) => {
                        return { ...interpretNavItem(subItem, activeItemName, params, listItem) };
                    }),
                };
            }
        });
    };
    const interpretNavItem = (navListItem, activeItemName, params, parent?) => {
        const result = {
            title: i18nFilter()(navListItem.title),
            name: navListItem.name,
            isDisabled: navListItem.disabled || isItemDisabled(navListItem),
            isBeta: isBeta(navListItem),
            isNew: isNew(navListItem),
            isLocked: isLocked(navListItem),
            isDashboard: false,
            isActive: activeItemName === navListItem.state,
            url: swNavigator.navLink(navListItem),
            onClick: () => onNavItemClick(navListItem, parent),
        };

        return {
            ...result,
            ...(isItemDisabled(navListItem) ? navItemTooltip(navListItem) : {}),
        };
    };
    const onNavItemClick = (navListItem: INavItem, parent) => {
        trackSideNavItemClick(navListItem.title, parent);
        if (window.outerWidth <= 1200) {
            props.toggleSideNav();
        }
        setActiveItemName(navListItem.state);
    };
    const [activeItemName, setActiveItemName] = useState<any>(props.currentPage);
    const [navItems, setNavItems] = useState<any>(() =>
        getSideNavList(props.currentPage, swNavigator.getParams()),
    );

    // const additionalOptionsProps: ISegmentsNavAdditionalOptionsProps = {
    //     onClickDelete: gid => {
    //         TrackWithGuidService.trackWithGuid("segments.module.sidenav.additional.options.delete.group", "click", {gid});
    //         const segmentGroup = SegmentsUtils.getSegmentGroupById(props.groups, gid);
    //         props.toggleDeleteSegmentGroupModal(true, segmentGroup);
    //     },
    //     onClickEdit: (action, gid) => {
    //         TrackWithGuidService.trackWithGuid("segments.module.sidenav.additional.options.edit.group", "click", {gid});
    //         const segmentGroup = SegmentsUtils.getSegmentGroupById(props.groups, gid);
    //         props.toggleCreateUpdateSegmentGroupModal(true, segmentGroup);
    //     },
    //     onToggleEllipsis: isOpen => {
    //         TrackWithGuidService.trackWithGuid("segments.module.sidenav.additional.options.toggle", "click");
    //     },
    //     gid: undefined,
    //     dropDownStyle: { position: 'absolute', right: 0 },
    // };

    const renderSideNav = () => {
        return (
            <SideNav>
                <SideNavList persistenceKey={"segmentanalysis"} navItems={navItems}>
                    <SideNavListScrollSpace />
                </SideNavList>
            </SideNav>
        );
    };
    return renderSideNav();
};

function mapStateToProps(store) {
    const {
        routing: { params, currentPage },
        segmentsModule: { customSegmentsMeta },
    } = store;
    return {
        params,
        currentPage,
        segments: customSegmentsMeta?.Segments,
        organizationSegments: customSegmentsMeta?.AccountSegments,
        groups: customSegmentsMeta?.SegmentGroups,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleDeleteSegmentGroupModal: (isOpen, segmentGroup) => {
            dispatch(toggleDeleteSegmentGroupModal(isOpen, segmentGroup));
        },
        toggleCreateUpdateSegmentGroupModal: (isOpen, segmentGroup?) => {
            dispatch(toggleCreateUpdateSegmentGroupModal(isOpen, segmentGroup));
        },
        toggleSideNav: () => {
            dispatch(toggleSideNav());
        },
    };
}

export default SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(SegmentsSideNav),
    "SegmentsSideNav",
);
