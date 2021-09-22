import * as React from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { toggleSideNav } from "../../../actions/layoutActions";
import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { PureComponent } from "react";
import { mixins } from "@similarweb/styles";
import { SwTrack } from "services/SwTrack";

const SideNavTogglerComponent: any = styled(SWReactIcons).attrs({
    iconName: "burger",
})`
    display: none;
    width: 64px;
    height: 56px;
    @media (max-width: 960px) {
        height: 50px;
    }
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
    box-sizing: border-box;
    path {
        fill: ${({ sideNavIsOpen }) => (sideNavIsOpen ? "#ffffff" : "#949aae")};
    }
    &:hover {
        path {
            fill: #ffffff;
        }
    }
    ${mixins.respondTo(`mediumDesktop`, `display: inline-flex;`)};
`;

const SideBarTogglerClick: any = styled.div`
    height: auto;
`;

const ignoredModules = ["insights", "marketingWorkspace", "salesWorkspace", "investorsWorkspace"];

class SideNavToggler extends PureComponent<any, any> {
    constructor(props, context) {
        super(props, context);
    }

    public componentDidMount() {
        if (window.innerWidth < 1200) {
            SwTrack.all.trackEvent("button", "show", "hamburger menu");
        }
    }

    public render() {
        if (ignoredModules.includes(this.props.currentModule)) {
            return null;
        } else {
            return (
                <SideBarTogglerClick onClick={() => this.props.toggleSideNav()}>
                    <SideNavTogglerComponent sideNavIsOpen={this.props.sideNavIsOpen} />
                </SideBarTogglerClick>
            );
        }
    }
}

function mapStateToProps({ layout: { sideNavIsOpen }, routing: { currentModule } }) {
    return {
        sideNavIsOpen,
        currentModule,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleSideNav: () => {
            SwTrack.all.trackEvent("button", "click", "hamburger menu");
            dispatch(toggleSideNav());
        },
    };
}

const connected = connect(mapStateToProps, mapDispatchToProps)(SideNavToggler);

SWReactRootComponent(connected, "SideNavToggler");

export default connected;
