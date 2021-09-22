/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
    IconSidebar,
    IconSidebarItem,
    IconSidebarLogoItem,
    IconSidebarScrollArea,
    IconSidebarSection,
} from "@similarweb/ui-components/dist/icon-sidebar";
import { colorsPalettes } from "@similarweb/styles";
import { toggleEducationBarSimple } from "actions/educationBarActions";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as React from "react";
import { FunctionComponent } from "react";
import { connect } from "react-redux";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";
import { getItemsList } from "./SideBarItems";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { swSettings } from "common/services/swSettings";
import { PrimaryNavOverrideMode } from "reducers/_reducers/primaryNavOverrideReducer";
import { primaryNavOverride } from "actions/primaryNavOverrideActions";

const i18n = i18nFilter();

interface IProSideBarProps {
    currentModule: string;
    currentPage: string;
    isSideNavOpen: boolean;
    isImpersonating?: boolean;
    isEducationBarOpen: boolean;
    toggleEducationBar: (isOpen) => void;
    changePrimaryNavOverrideMode: (mode) => void;

    /**
     * Indicates what is the current section in the platform.
     */
    secondaryBarType: SecondaryBarType;
    navOverrideMode: PrimaryNavOverrideMode;
}

enum ProSidebarMode {
    Normal,
    Impersonate,
    Demo,
}

const ProSidebarContainer = styled.div`
    width: 56px;
    height: 100%;
    position: relative;
`;

const impersonateStyles = css`
    .icon-sidebar-container.pro-icon-sidebar {
        border-left: 4px solid ${colorsPalettes.navigation.IMPERSONATE};
        border-bottom: 4px solid ${colorsPalettes.navigation.IMPERSONATE};
        padding: 4px 0 0;
    }
    .icon-sidebar-container.pro-icon-sidebar
        .IconSidebarSection.iconsidebar-section-bottom
        > div:last-child {
        background: ${colorsPalettes.navigation.IMPERSONATE};
        transition: background 0.3s linear;
        &:hover {
            background: ${colorsPalettes.navigation.IMPERSONATE_HOVER} !important;
        }
        .iconsidebar-item-enabled {
            background: inherit;
            &:hover {
                background: inherit;
            }
        }
    }
`;

const demoStyles = css`
    .icon-sidebar-container.pro-icon-sidebar {
        border-left: 4px solid ${colorsPalettes.navigation.DEMO};
        border-bottom: 4px solid ${colorsPalettes.navigation.DEMO};
        padding: 4px 0 0;
    }
    .icon-sidebar-container.pro-icon-sidebar
        .IconSidebarSection.iconsidebar-section-bottom
        > div:last-child {
        background: ${colorsPalettes.navigation.DEMO};
        transition: background 0.3s linear;
        &:hover {
            background: ${colorsPalettes.navigation.DEMO} !important;
        }
        .iconsidebar-item-enabled {
            background: inherit;
            &:hover {
                background: inherit;
            }
        }
    }
`;

const getModeStyles = (mode: ProSidebarMode): FlattenSimpleInterpolation => {
    switch (mode) {
        case ProSidebarMode.Normal:
            return null;
        case ProSidebarMode.Impersonate:
            return impersonateStyles;
        case ProSidebarMode.Demo:
            return demoStyles;
        default:
            return null;
    }
};

const ProSideBarStyled = styled.div<{ isSideNavOpen: boolean; mode: ProSidebarMode }>`
    position: absolute;
    z-index: 1020;
    height: 100%;
    width: auto;
    background-color: transparent;
    flex-grow: 0;
    transition: width 0.3s linear;
    @media (max-width: 1200px) {
        width: ${({ isSideNavOpen }) => (isSideNavOpen ? "auto" : "0px")};
    }
    .icon-sidebar-item {
        text-transform: capitalize;
    }
    ${({ mode }) => getModeStyles(mode)}
`;

const ProSideBar: FunctionComponent<IProSideBarProps> = (props) => {
    const {
        currentModule,
        secondaryBarType,
        isSideNavOpen,
        isImpersonating,
        isEducationBarOpen,
        toggleEducationBar,
        navOverrideMode,
        changePrimaryNavOverrideMode,
    } = props;
    const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);
    const [isBarOpen, setIsBarOpen] = React.useState(undefined);
    const withScrollArea = windowHeight <= 640;

    // Retiring the "All" option
    React.useEffect(() => {
        if (navOverrideMode === PrimaryNavOverrideMode.All) {
            changePrimaryNavOverrideMode(PrimaryNavOverrideMode.S2);
        }
    }, [navOverrideMode]);

    React.useEffect(() => {
        window.addEventListener("resize", updateWindowHeight, { capture: true });
        return function cleanup() {
            window.removeEventListener("resize", updateWindowHeight, { capture: true });
        };
    });

    const updateWindowHeight = (): void => {
        setWindowHeight(window.innerHeight);
    };

    // event handler for click on a sidebar item that doesn't have a component property
    const onLinkItemClick = (item, itemOnClick): void => {
        if (item.trackName) {
            TrackWithGuidService.trackWithGuid("solutions2.sidebar.menu", "click", {
                trackName: item.trackName,
            });
        }
        // doing this so that the next time an item is clicked, state will
        // be set since it will be a different value ie. undefined -> false.
        setIsBarOpen(isBarOpen === false ? undefined : false);
        itemOnClick();
    };
    // event handler for click on a side bar item that has a component property
    const onComponentItemClick = (): void => {
        setIsBarOpen(true);
    };
    // event handler for click on a child of a side bar item that has a component property ex. items in a dropdown
    const onComponentItemChildClick = (): void => {
        setIsBarOpen(false);
    };

    const onComponentItemToggle = (isOpen, isOutsideClick, e): void => {
        if (isOutsideClick) {
            setIsBarOpen(false);
        }
        // if the dropdown closes, we want the sidebar state to be reset to listen for mouse events
        if (!isOpen) {
            setIsBarOpen(undefined);
        }
    };

    const items = getSidebarItems(
        currentModule,
        secondaryBarType,
        {
            isEducationBarOpen,
            toggleEducationBar,
            changePrimaryNavOverrideMode,
            navOverrideMode,
        },
        onLinkItemClick,
        onComponentItemClick,
        onComponentItemChildClick,
        onComponentItemToggle,
    );

    let sidebarMode = ProSidebarMode.Normal;

    if (swSettings.user.hasProductOrClaimsOverride) {
        sidebarMode = ProSidebarMode.Demo;
    }

    if (isImpersonating) {
        sidebarMode = ProSidebarMode.Impersonate;
    }

    return (
        <ProSidebarContainer>
            <ProSideBarStyled isSideNavOpen={isSideNavOpen} mode={sidebarMode}>
                <IconSidebar isOpen={isBarOpen} customClassName={"pro-icon-sidebar"}>
                    <IconSidebarSection style={{ overflow: "hidden" }}>
                        {/* TODO:  replace span with a tag after GTM sb is built - href={"/#/home/modules"}*/}
                        <span>
                            <IconSidebarLogoItem />
                        </span>
                        {withScrollArea ? (
                            <IconSidebarScrollArea>{items.topItems}</IconSidebarScrollArea>
                        ) : (
                            <>{items.topItems}</>
                        )}
                    </IconSidebarSection>
                    <IconSidebarSection
                        className={"iconsidebar-section-bottom"}
                        style={{ position: "sticky", bottom: 0, overflow: "hidden" }}
                    >
                        {items.bottomItems}
                    </IconSidebarSection>
                </IconSidebar>
            </ProSideBarStyled>
        </ProSidebarContainer>
    );
};

function getSidebarItems(
    currentModule: string,
    secondaryBarType: SecondaryBarType,
    props: any,
    onItemClick: (item: any, itemOnClick: any) => void,
    onComponentItemClick: VoidFunction,
    onComponentItemChildClick: VoidFunction,
    onComponentItemToggle: (isOpen: any, isOutsideClick: any, e: any) => void,
): { topItems: JSX.Element[]; bottomItems: JSX.Element[] } {
    const topItems = [];
    const bottomItems = [];

    getItemsList(currentModule, props).forEach((item, idx) => {
        if (item.isHidden) {
            return null;
        }
        // Resolve what is the currently selected item according to the active
        // secondary bar type. the active item should always be in-sync with
        // the current secondary bar type. and the secondary bar type is set
        // according to the current section in the platform.
        const isActive = _.includes(item.sections, secondaryBarType);

        const component = (
            <React.Fragment key={`prosidebar_item_${idx}`}>
                {item.sidebarItemComponent ? (
                    item.sidebarItemComponent(
                        isActive,
                        onComponentItemClick,
                        onComponentItemChildClick,
                        onComponentItemToggle,
                    )
                ) : (
                    <IconSidebarItem
                        icon={item.icon}
                        title={i18n(item.title)}
                        onItemClick={
                            item.isDisabled
                                ? item.onClickDisabled || _.noop
                                : () => onItemClick(item, item.onClick)
                        }
                        isActive={isActive}
                        withSeparator={item.withSeparator}
                        isDisabled={item.isDisabled}
                    />
                )}
            </React.Fragment>
        );
        _.some(["all", "all-s2", "internal", "productupdates"], (el) =>
            _.includes(item.package, el),
        )
            ? bottomItems.push(component)
            : topItems.push(component);
    });

    return { topItems, bottomItems };
}

export const mapStateToProps = ({
    routing,
    impersonation,
    educationBar,
    layout,
    secondaryBar,
    primaryNavOverride,
}) => {
    const { currentModule, currentPage } = routing;
    const { impersonateMode: isImpersonating } = impersonation;
    const { isOpen: isEducationBarOpen } = educationBar;
    const { isSideNavOpen } = layout;
    const { secondaryBarType } = secondaryBar;
    const { navOverrideMode } = primaryNavOverride;

    return {
        isEducationBarOpen,
        isImpersonating,
        isSideNavOpen,
        currentModule,
        currentPage,
        secondaryBarType,
        navOverrideMode,
    };
};

const mapDispatchToProps = (dispatch): object => {
    return {
        toggleEducationBar: () => {
            dispatch(toggleEducationBarSimple());
        },
        changePrimaryNavOverrideMode: (mode: PrimaryNavOverrideMode) => {
            dispatch(primaryNavOverride(mode));
        },
    };
};

export default SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(ProSideBar),
    "ProSideBar",
);
