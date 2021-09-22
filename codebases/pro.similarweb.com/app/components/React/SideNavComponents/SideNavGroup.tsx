import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, fonts, mixins, rgba } from "@similarweb/styles";
import { Collapsible } from "@similarweb/ui-components/dist/collapsible";
import { $navButtonBorderWidth, $navLinkColor } from "@similarweb/ui-components/dist/side-nav";
import * as _ from "lodash";
import * as PropTypes from "prop-types";
import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import { toggleSideNavGroup } from "../../../actions/layoutActions";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import UIComponentStateService from "../../../services/UIComponentStateService";
const hasActiveChild = (children) => {
    return !_.isUndefined(_.find(children, (child) => child.props.isActive));
};

const GroupNavButton = styled.div.attrs<{ activeClosed: boolean }>(
    (props) =>
        ({
            "data-sidenav-active-element": props.activeClosed,
        } as any),
)`
    height: 32px;
    padding-left: 24px;
    font-family: ${fonts.$robotoFontFamily};
    ${mixins.setFont({ $size: 11, $weight: 600, $color: colorsPalettes.carbon[300] })};
    letter-spacing: 1px;
    cursor: pointer;
    align-items: center;
    &:hover {
        ${mixins.setFont({ $color: rgba(colorsPalettes.midnight[600], 0.8) })};
        ${SWReactIcons} {
            svg {
                path {
                    fill: ${rgba(colorsPalettes.midnight[600], 0.8)};
                }
            }
        }
    }
    display: ${({ isHidden }: any) => (isHidden ? "none" : "flex")};
    border-right: solid ${$navButtonBorderWidth} transparent;
    ${({ activeClosed }: any) =>
        activeClosed &&
        css`
            border-right: solid ${$navButtonBorderWidth} ${$navLinkColor};
            transition: border-right 200ms ease-in-out;
        `};
    text-transform: uppercase;
    ${SWReactIcons} {
        display: flex;
        margin-left: 6px;
        margin-top: -2px;
    }
` as any;
GroupNavButton.displayName = "GroupNavButton";

export const SideNavGroupContainer = styled.div.attrs({
    "data-sidenav-group": true,
} as any)`
    line-height: 30px;
    width: 100%;
`;

interface ISideNavGroupState {
    isGroupActive: boolean;
}

interface ISideNavGroupProps {
    sideNavGroupTitle: string;
    isOpen: boolean;
    persistenceKey?: string;
    isHidden?: boolean;
    toggleSideNavGroup?: (group: string) => void;
    onGroupToggle?: (toggle, group) => void;
    hasActiveChild: boolean;
}

export class SideNavGroup extends PureComponent<ISideNavGroupProps, ISideNavGroupState> {
    public static propTypes = {
        isOpen: PropTypes.bool,
        isHidden: PropTypes.bool,
        onGroupToggle: PropTypes.func,
    };

    public static defaultProps = {
        isOpen: false,
        isHidden: false,
        onGroupToggle: (toggle, group) => null,
    };

    public static getDerivedStateFromProps(props, state) {
        if (props.hasActiveChild) {
            return {
                isGroupActive: true,
            };
        }

        return null;
    }

    constructor(props, context) {
        super(props, context);
        const defaultState = { isGroupActive: false };
        let state;
        const groupHasActiveChild = this.props.hasActiveChild;
        if (groupHasActiveChild || this.props.isOpen) {
            state = { isGroupActive: true };
        } else if (this.props.persistenceKey) {
            const fromStorage = UIComponentStateService.getItem(
                this.props.persistenceKey,
                "localStorage",
                true,
            );
            if (fromStorage) {
                state = JSON.parse(fromStorage);
            } else {
                state = defaultState;
            }
        } else {
            state = defaultState;
        }
        this.state = state;
    }

    // *******************
    //  Lifecycle events
    // *******************

    public render() {
        const { sideNavGroupTitle, isHidden } = this.props;
        // mark as activeClosed only if have an active child and the group is closed
        const activeClosed = !this.state.isGroupActive && this.props.hasActiveChild;
        const chevIcon = `chev-${this.state.isGroupActive ? `down` : `up`}`;
        return (
            <SideNavGroupContainer>
                <GroupNavButton
                    activeClosed={activeClosed}
                    onClick={this.toggleCollapse}
                    isHidden={isHidden}
                    data-automation-sidenav-link-group
                >
                    {sideNavGroupTitle}
                    <SWReactIcons iconName={chevIcon} size="xs" />
                </GroupNavButton>
                <Collapsible isActive={this.state.isGroupActive}>{this.props.children}</Collapsible>
            </SideNavGroupContainer>
        );
    }

    // ****************
    //  Class methods
    // ****************

    private toggleCollapse = () => {
        const isGroupActive = !this.state.isGroupActive;
        const value = { isGroupActive };
        if (this.props.persistenceKey) {
            UIComponentStateService.setItem(
                this.props.persistenceKey,
                "localStorage",
                JSON.stringify(value),
                true,
            );
        }

        this.setState(
            {
                isGroupActive,
            },
            () => {
                this.props.onGroupToggle(isGroupActive, this.props.sideNavGroupTitle);
            },
        );
    };
}

const mapStateToProps = ({ routing: { currentPage } }) => {
    return {
        currentPage,
    };
};

SWReactRootComponent(connect(mapStateToProps)(SideNavGroup), "SideNavGroup");
