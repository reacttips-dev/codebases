import { colorsPalettes } from "@similarweb/styles";
import styled from "styled-components";

const HeaderStripe = styled.nav`
    width: 100%;
    height: 64px;
    line-height: 64px;
    color: #ffffff;
    background: ${colorsPalettes.midnight["500"]};
    position: relative;
    z-index: 10;
`;

export const Header = styled(HeaderStripe)`
    padding: 0 20px;
`;
