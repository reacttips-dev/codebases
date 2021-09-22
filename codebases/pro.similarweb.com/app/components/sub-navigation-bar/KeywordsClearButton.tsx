import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as React from "react";
import styled from "styled-components";
import { IconButton } from "@similarweb/ui-components/dist/button";

interface ISubNavBackButtonProps {
    backStateUrl: string;
}

const KeywordsClearButtonWrapper = styled.div`
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: 8px;
`;

const KeywordsClearButton: React.FC<ISubNavBackButtonProps> = ({ backStateUrl }) => {
    const onBackButtonClick = (homeUrl): void => {
        window.location.href = homeUrl;
    };

    return (
        <KeywordsClearButtonWrapper>
            <IconButton
                iconName="clear"
                onClick={onBackButtonClick.bind(null, backStateUrl)}
                iconSize="xs"
                type="flat"
            >
                Clear
            </IconButton>
        </KeywordsClearButtonWrapper>
    );
};

SWReactRootComponent(KeywordsClearButton, "KeywordsClearButton");
export default KeywordsClearButton;
