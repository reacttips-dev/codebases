import { SWReactIcons } from "@similarweb/icons";
import * as React from "react";
import styled from "styled-components";
import { setFont } from "@similarweb/styles/src/mixins";
import { colorsPalettes, rgba } from "@similarweb/styles";

const NoSuggestionsMessageContainer = styled.div`
    height: 258px;
    width: 100%;
    padding: 33px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
`;

const Title = styled.div`
    ${setFont({ $size: "16px", $color: colorsPalettes.carbon[500] })};
    margin-top: 20px;
`;

const SubTitle = styled.div`
    ${setFont({ $size: "12px", $color: rgba(colorsPalettes.carbon[500], 0.6) })};
    text-align: center;
    margin-top: 8px;
`;

export const NoSuggestionsArt = () => <SWReactIcons iconName={"no-data-tree"} />;

export const NoSuggestionsMessage = ({ noDataTitle, noDataSubtitle }) => (
    <NoSuggestionsMessageContainer>
        <NoSuggestionsArt />
        <Title>{noDataTitle}</Title>
        <SubTitle>{noDataSubtitle}</SubTitle>
    </NoSuggestionsMessageContainer>
);
