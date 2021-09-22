import * as React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import { setFont, mixins } from "@similarweb/styles";
import { StatelessComponent } from "react";

interface ISideNavDrawerProps {
    isOpen?: boolean;
    keepOpen?: boolean;
}

const width = `240px`;
const open = mixins.respondTo(`mediumDesktop`, `width: ${width};`);
const close = mixins.respondTo(`mediumDesktop`, `width: 0;`);
const transition = `.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;

const SideNavDrawerStyled: any = styled.div.attrs({
    "data-automation-sidenav": true,
} as any)`
    height: 100%;
    white-space: nowrap;
    background-color: #edf2f7;
    box-sizing: border-box;
    transition: ${transition};
    transition-property: width, padding-left;
    overflow: hidden;
    @media (min-width: 1201px) {
        width: ${width};
    }
    ${({ keepOpen }: ISideNavDrawerProps) =>
        !keepOpen
            ? css`
                  @media (max-width: 1200px) {
                      position: absolute;
                      z-index: 900;
                      box-shadow: 20px 25px 60px 0 rgba(0, 0, 0, 0.05);
                      border-right: 1px solid #e6e6e6;
                  }
              `
            : css``};

    ${({ isOpen }: ISideNavDrawerProps) => (isOpen ? open : close)};
`;

SideNavDrawerStyled.displayName = "SideNavDrawerStyled";

function mapStateToProps({ layout: { sideNavIsOpen } }, ownProps) {
    const isOpen = sideNavIsOpen || ownProps.keepOpen;
    return {
        isOpen,
        keepOpen: ownProps.keepOpen,
    };
}

const SideNavDrawer: StatelessComponent<any> = (props) => {
    const isOpen = props.sideNavIsOpen || props.keepOpen;
    return (
        <SideNavDrawerStyled sideNavIsOpen={isOpen} data-automation-sidenav>
            {props.children}
        </SideNavDrawerStyled>
    );
};

export default connect(mapStateToProps)(SideNavDrawerStyled);
