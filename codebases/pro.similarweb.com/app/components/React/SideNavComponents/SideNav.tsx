import { fonts, mixins } from "@similarweb/styles";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import SideNavDrawer from "./SideNavDrawer";

const SideNavDiv = styled.div`
    position: relative;
    height: 100%;
    .SideNav-button {
        align-self: center;
        margin: 16px 0;
    }
    display: flex;
    flex-direction: column;
    > * {
        flex-grow: 0;
    }
    .ScrollBar-container {
        z-index: 2;
    }
` as any;

SideNavDiv.displayName = "SideNavDiv";

interface ISideNavDivProps {
    keepOpen?: boolean;
}

export const SideNav: StatelessComponent<ISideNavDivProps> = (props) => {
    return (
        <SideNavDrawer keepOpen={props.keepOpen}>
            <SideNavDiv>{props.children}</SideNavDiv>
        </SideNavDrawer>
    );
};

SideNav.displayName = "SideNav";
