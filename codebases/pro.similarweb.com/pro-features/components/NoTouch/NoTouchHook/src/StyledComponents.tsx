import { SWReactIcons } from "@similarweb/icons";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import styled from "styled-components";
import NoTouchImage from "../../NoTouchImage";
import NoTouchList from "../../NoTouchList";
import NoTouchPrice from "../../NoTouchPrice";

interface INoTouchHookContainer {
    width?: string;
}

export const NoTouchHookContainer = styled.div<INoTouchHookContainer>`
    overflow: hidden;
    display: flex;
    width: ${({ width }) => (width ? width : "740px")};
    border-radius: 6px;
    box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.24), 0 0 8px 0 rgba(0, 0, 0, 0.12);
    background-color: #7975f2;
`;
NoTouchHookContainer.displayName = "NoTouchHookContainer";

export const NoTouchHookIcon = styled(SWReactIcons)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 20px;
    height: 24px;
    margin-right: 7px;
    svg {
        width: 20px;
        height: 20px;
    }
`;
NoTouchHookIcon.displayName = "NoTouchHookIcon";

export const NoTouchHookColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    padding: 60px 40px 50px;
    box-sizing: border-box;
    background-color: #fff;
    color: #2a3e52;
    a {
        &:focus {
            outline: none;
        }
    }
`;
export const NoTouchHookColumnTransparent = styled(NoTouchHookColumn)`
    background-color: transparent;
    color: #fff;
    path {
        fill: currentColor;
    }
`;
export const NoTouchHookColumnImg = styled(NoTouchHookColumnTransparent)`
    padding: 20px;
`;
NoTouchHookColumn.displayName = "NoTouchHookColumn";

export const NoTouchHookImage = styled(NoTouchImage)`
    align-self: center;
    margin-bottom: 10px;
    transform: translateX(-8%);
`;
export const NoTouchHookImageAutoHeight = styled(NoTouchImage)`
    align-self: center;
    height: auto;
    margin: auto;
`;
NoTouchHookImage.displayName = "NoTouchHookImage";

export const NoTouchHookPrice = styled(NoTouchPrice)`
    margin: 58px 0 20px;
`;
NoTouchHookPrice.displayName = "NoTouchHookPrice";

export const NoTouchHookList = styled(NoTouchList)`
    align-self: stretch;
    margin: 0 0 auto;
`;
NoTouchHookList.displayName = "NoTouchHookList";

export const NoTouchHookLink = styled.a`
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    margin: 8px 0 0 27px;
    font-size: 14px;
    color: #1a1a42;
    line-height: normal;
`;
NoTouchHookLink.displayName = "NoTouchHookLink";

export const NoTouchHookFooter = styled.div`
    align-items: center;
    margin-top: 32px;
`;
NoTouchHookFooter.displayName = "NoTouchHookFooter";

/*
 * Button
 */

const ButtonOutlined = (props: any) => (
    <Button {...props} type="outlined">
        {props.children}
    </Button>
);

const ButtonOutlinedNegative = styled(ButtonOutlined)`
    border-color: #fff;
    color: #fff;
    ${ButtonLabel} {
        color: #fff;
    }
    &:hover {
        background-color: transparent;
        border-color: #fff;
        ${ButtonLabel} {
            color: #fff;
        }
    }
`;

const ButtonTrial = (props: any) => (
    <Button {...props} type="trial">
        {props.children}
    </Button>
);

interface INoTouchHookButton {
    children?: string | JSX.Element;
    type?: "trial" | "outlined-negative";
}

const ButtonComponent: React.FunctionComponent<INoTouchHookButton> = ({
    type = "trial",
    ...props
}) => {
    if (type === "outlined-negative") {
        return <ButtonOutlinedNegative {...props}>{props.children}</ButtonOutlinedNegative>;
    }

    return <ButtonTrial {...props}>{props.children}</ButtonTrial>;
};

export const NoTouchHookButton: any = styled(ButtonComponent)`
    max-width: 100%;
    min-width: 200px;
    line-height: normal;
`;
NoTouchHookButton.displayName = "NoTouchHookButton";

export const NoTouchMoreLink = styled.a`
    display: block;
    color: #7975f2;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    margin: 10px 0 0;
`;
