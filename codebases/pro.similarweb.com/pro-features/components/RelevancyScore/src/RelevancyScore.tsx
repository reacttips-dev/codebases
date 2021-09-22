import { colorsPalettes } from "@similarweb/styles";
import * as React from "react";
import { StatelessComponent } from "react";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";

export interface IRelevancyScoreProps {
    bullets: number;
    maxBullets: number;
}

export const ScoreContainer = styled.div`
    display: flex;
    justify-content: space-around;
`;
export const FullBullet = styled.span`
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background-color: ${colorsPalettes.midnight["200"]};
`;
export const EmptyBullet = styled(FullBullet)`
    background-color: ${colorsPalettes.carbon["50"]};
`;

export const RelevancyScore: StatelessComponent<IRelevancyScoreProps> = ({
    bullets,
    maxBullets,
}) => {
    const fullBullets = Math.round(bullets);
    return (
        <ScoreContainer>
            {Array.from(Array(maxBullets)).map((value, i) => {
                return i < fullBullets ? <FullBullet /> : <EmptyBullet />;
            })}
        </ScoreContainer>
    );
};

RelevancyScore.displayName = "RelevancyScore";
