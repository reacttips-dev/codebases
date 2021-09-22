import { colorsPalettes, mixins } from "@similarweb/styles";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import { WidgetSubtitle } from "components/React/Widgets/WidgetsSubtitle";
import React from "react";
import { StyledPill } from "styled components/StyledPill/src/StyledPill";
import styled from "styled-components";

const WidgetTopContainer = styled.div`
    margin: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 50px;
`;
const WidgetSubtitleContainer = styled.span`
    margin-left: 4px;
`;

const Pill = styled(StyledPill)<{ isBeta?: boolean }>`
    ${({ isBeta }) => (isBeta ? `background-color: #4fc3a0` : `background-color: #f58512`)};
    margin-left: 5px;
    margin-top: 4px;
`;

export const TitleContainer = styled.div`
    ${mixins.setFont({ $size: 20, $weight: 500, $color: colorsPalettes.carbon[500] })};
    display: flex;
`;

export interface IWidgetsTitleProps {
    headline: string;
    newPill?: boolean;
    betaPill?: boolean;
    toolTipInfoText?: string;
    className?: string;
}

export const WidgetsTop: React.FunctionComponent<IWidgetsTitleProps> = ({
    toolTipInfoText,
    headline,
    newPill,
    betaPill,
    className,
}) => {
    return (
        <WidgetTopContainer className={className}>
            <TitleContainer>
                <BoxTitle tooltip={toolTipInfoText}>{headline}</BoxTitle>
                {newPill && <Pill>NEW</Pill>}
                {betaPill && <Pill isBeta={true}>BETA</Pill>}
            </TitleContainer>
            <WidgetSubtitleContainer>
                <WidgetSubtitle />
            </WidgetSubtitleContainer>
        </WidgetTopContainer>
    );
};
