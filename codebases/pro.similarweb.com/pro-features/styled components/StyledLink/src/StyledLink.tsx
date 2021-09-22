import * as React from "react";
import styled from "styled-components";

const StyledLink: any = styled.a.attrs({
    target: "_self",
})`
    color: #4e8cf9;
    text-decoration: none;
    cursor: ${(props: any) => (props.href || props.onClick ? "pointer" : "auto")};
`;
StyledLink.displayName = "StyledLink";
export default StyledLink;
