import * as React from "react";
import * as PropTypes from "prop-types";
import styled, {StyledComponentBase} from "styled-components";
import {icons as exported} from "icons/icons"; //alias
// for legacy purposes
export const icons = exported;

const getCssStr = (size: string) => `{height: ${size}; width: ${size}};`;

const sizes = {
    xs: '16px',
    sm: '24px',
    md: '32px',
    lg: '40px',
    xl: '48px',
    xxl: '72px',
};

export const sizeCss = ({size}: {size?: string}) => size ? getCssStr(sizes[size] ? sizes[size] : size) : null;


const SWReactIconsInner = (props)=> {
    const {iconName, className} = props;
    return (
        <div className={className} data-pdf-icon={"SWReactIcons"} data-automation-icon-name={iconName} dangerouslySetInnerHTML={{__html: icons[iconName]}}/>
    )
}

export const SWReactIcons = styled(SWReactIconsInner)`
    ${sizeCss}
`;


SWReactIcons.propTypes = {
    className: PropTypes.string,
};

SWReactIcons.defaultProps = {
    className: "SWReactIcons",
};

SWReactIcons.displayName = "SWReactIcons";
