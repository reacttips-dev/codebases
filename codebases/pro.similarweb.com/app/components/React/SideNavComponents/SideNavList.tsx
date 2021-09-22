import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import {
    SideNavItemBeta,
    SideNavItemChildren,
    SideNavItemDashboard,
    SideNavItemEditable,
    SideNavItemLocked,
    SideNavItemNew,
    SideNavItemSingle,
} from "@similarweb/ui-components/dist/side-nav";
import autobind from "autobind-decorator";
import * as _ from "lodash";
import * as React from "react";
import { PureComponent } from "react";
import styled from "styled-components";
import { INavItem } from "./SideNav.types";
import { SideNavGroup, SideNavGroupContainer } from "./SideNavGroup";
import { SwTrack } from "services/SwTrack";

export interface ISideNavListProps {
    navItems: INavItem[];
    persistenceKey?: string;
}

export const SideNavListScrollSpace = styled.div`
    height: 1px;
    width: 100%;
    margin-bottom: 0;
`;

const SideNavGroups = styled.div`
    flex-grow: 1;
    overflow: hidden;
    .SideNav-scroller.ScrollArea {
        :not(:hover) {
            .ScrollBar-container {
                opacity: 0;
            }
        }
        .ScrollArea-content {
            > div {
                margin-bottom: 12px;
            }
        }
    }
`;

const transition = `.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
const SideNavIndicator: any = styled.div.attrs({
    "data-sidenav-indicator": true,
} as any)`
    width: 2px;
    height: ${({ height }: any) => height || 30}px;
    background-color: #4e8cf9;
    position: absolute;
    right: 0;
    top: ${({ top }: any) => top}px;
    transition: top ${transition};
`;

const scrollerStyle = {
    width: 3.7,
    opacity: 0.3,
    borderRadius: 10,
    backgroundColor: "#30445c",
};

const scrollerContainerStyle = {
    backgroundColor: "transparent",
};

const sideNavComponents = {
    SideNavItemChildren,
    SideNavItemSingle,
    SideNavItemBeta,
    SideNavItemLocked,
    SideNavItemNew,
    SideNavItemDashboard,
    SideNavItemEditable,
};

const createSideNavItem = (item, index, property?) => {
    const componentType = "SideNavItem" + (property ? property : "Children");
    const componentProps = Object.assign(
        {},
        {
            label: item.title,
            key: index,
            url: item.url,
            isActive: item.isActive,
            isDisabled: item.isDisabled,
            onClick: item.onClick,
            dataAutomation: item.name,
            isLocked: item.isLocked,
            isEmpty: item.isEmpty,
        },
        property === "Dashboard"
            ? {
                  isSharedByMe: item.isSharedByMe,
                  isSharedWithMe: item.isSharedWithMe,
                  id: item.id,
                  isLoading: item.isLoading,
                  deletePopUpIsOpen: item.deletePopUpIsOpen,
                  onCancel: item.onCancel,
                  onConfirm: item.onConfirm,
                  confirmationData: item.confirmationData,
                  onMenuToggle: item.onMenuToggle,
                  onMenuClick: item.onMenuClick,
                  menuItems: item.menuItems,
              }
            : {},
        property === "Editable"
            ? {
                  isLoading: item.isLoading,
                  isFocused: item.isFocused,
                  isError: item.isError,
                  onItemChange: item.onItemChange,
                  onItemCancelEdit: item.onItemCancelEdit,
                  onItemEdit: item.onItemEdit,
                  debounce: item.debounce,
                  isSelected: item.isSelected,
                  inputMaxLength: item.inputMaxLength,
              }
            : {},
    );
    const component = React.createElement(sideNavComponents[componentType], componentProps);
    if (item.hasOwnProperty("tooltipText")) {
        return (
            <PlainTooltip
                tooltipContent={item.tooltipText}
                key={item.name}
                placement={item.tooltipPlacement}
            >
                <div>{component}</div>
            </PlainTooltip>
        );
    } else {
        return component;
    }
};

const hasActiveChild = (children) => {
    return !_.isUndefined(_.find(children, (child) => child.isActive));
};

export class SideNavList extends PureComponent<ISideNavListProps, any> {
    private container;
    private timeoutId;
    private indicator;
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    public componentDidMount() {
        this.updateScrollHeight();
        window.addEventListener("resize", this.updateScrollHeight, { capture: true });
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.updateScrollHeight, { capture: true });
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    public UNSAFE_componentWillReceiveProps() {
        this.updateScrollHeight();
    }

    public render() {
        let scrollStyle;
        if (this.state.scrollHeight) {
            scrollStyle = {
                height: this.state.scrollHeight,
            };
        }
        return (
            <SideNavGroups ref={this.setContainerRef}>
                <ScrollArea
                    className="SideNav-scroller"
                    style={scrollStyle}
                    verticalScrollbarStyle={scrollerStyle}
                    verticalContainerStyle={scrollerContainerStyle}
                >
                    {this.props.children}
                    {this.props.navItems.map((item, index) => {
                        if (_.isUndefined(item.subItems)) {
                            return createSideNavItem(item, index, "Single");
                        } else {
                            const persistenceKey = this.props.persistenceKey
                                ? `${this.props.persistenceKey}_sidenav_group_${index}`
                                : null;
                            return (
                                <SideNavGroup
                                    persistenceKey={persistenceKey}
                                    key={item.title}
                                    sideNavGroupTitle={item.title}
                                    isHidden={item.hidden}
                                    isOpen={item.isOpen}
                                    onGroupToggle={this.onGroupToggle}
                                    hasActiveChild={hasActiveChild(item.subItems)}
                                >
                                    {item.subItems.map((subItem, subIndex) => {
                                        let component = createSideNavItem(subItem, subIndex);
                                        ["Locked", "Beta", "New", "Dashboard", "Editable"].forEach(
                                            (property) => {
                                                if (subItem["is" + property]) {
                                                    component = createSideNavItem(
                                                        subItem,
                                                        subIndex,
                                                        property,
                                                    );
                                                }
                                            },
                                        );
                                        return component;
                                    })}
                                </SideNavGroup>
                            );
                        }
                    })}
                </ScrollArea>
            </SideNavGroups>
        );
    }

    @autobind
    private onGroupToggle(toggle, group) {
        SwTrack.all.trackEvent(
            "Expand Collapse",
            toggle ? "expand" : "collapse",
            `Side Bar/${group}`,
        );
        this.updateScrollHeight();
    }

    @autobind
    private setContainerRef(ref) {
        this.container = ref;
    }

    @autobind
    private updateScrollHeight() {
        const list = this.container;
        this.timeoutId = setTimeout(() => {
            if (list) {
                this.setState(
                    {
                        scrollHeight: list.clientHeight,
                    },
                    () => {
                        this.timeoutId = null;
                    },
                );
            }
        }, 75);
    }

    @autobind
    private setIndicatorRef(ref) {
        this.indicator = ref;
    }
}
