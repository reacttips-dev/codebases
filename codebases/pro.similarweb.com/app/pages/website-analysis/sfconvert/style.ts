import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styledTS from "styled-components-ts";
import { SfCardWrapperStyle } from "./sfCards/SfCardWrapper";

export const Wrapper = styled.div`
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 405px;
    max-width: 604px;
    left: 50%;
    transform: translateX(-50%);
    box-sizing: border-box;
    overflow-x: hidden;
`;
export const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;
export const IconContainer = styled.div`
    width: 220px;
    position: relative;
    height: 57px;

    svg {
        position: absolute;
        left: -20px;
    }
`;
export const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
`;
export const GeneralLink = styled.a`
    font-size: 14px;
    font-weight: bold;
    color: ${colorsPalettes.blue[400]};
    align-items: center;
    display: flex;
    text-transform: uppercase;
`;

GeneralLink.displayName = "GeneralLink";

export const BigCompare = styled(Button).attrs(() => ({
    type: "compare",
    style: { width: "264px", height: "48px" },
}))`
    &&& {
        font-weight: 500;
        font-size: 14px;
    }
`;

export const BlockedTitle = styled.span`
    margin-top: 40px;
    font-weight: 700;
    font-size: 24px;
    line-height: initial;
    color: ${colorsPalettes.midnight[500]};
    text-transform: capitalize;
`;

export const BlockedContent = styled(FlexColumn)`
    align-items: center;
`;
export const BlockedMessage = styled.div`
    margin: 18px 0 40px 0;
    text-align: center;
`;

export const LoaderContainer = styledTS<{ height: string }>(styled(SfCardWrapperStyle))`
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 432px;
    height: ${(props) => props.height || "244px"};
`;

export const AuthorizedPageWrapper = styled.div`
    width: inherit;
    overflow: auto;
    height: 100%;
    flex-wrap: nowrap;
    display: flex;
}
`;
