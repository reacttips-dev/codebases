import * as React from "react";
import * as PropTypes from "prop-types";
import {StatelessComponent} from "react";
import {icons as exported} from "countryIcons/icons";
import {sizeCss} from "../react-icons/SWReactIcons"; //alias
import styled, {StyledComponentBase} from "styled-components";

// for legacy purposes
export const icons = exported;

export interface ISWReactCountryIconsProps {
    countryCode: number;
    size?: string;
}

export const SWReactCountryIcons = styled.div.attrs<ISWReactCountryIconsProps>(props => ({
    "dangerouslySetInnerHTML": {__html: icons[props.countryCode]}
}))<ISWReactCountryIconsProps>`
    ${sizeCss}
`;

SWReactCountryIcons.displayName = "SWReactCountryIcons";
