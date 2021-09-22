import * as React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import WithTranslation from "../../WithTranslation/src/WithTranslation";

export const StyledHeaderCell = styled.div`
    background-color: ${colorsPalettes.carbon[25]};
    height: 32px;
    color: ${colorsPalettes.carbon[400]};
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    border-bottom: 1px solid ${colorsPalettes.carbon[100]};
    box-sizing: border-box;
    line-height: 32px;
    ${setFont({ $size: 12 })};
`;

const RightAlignedHeaderCellStyled = styled(StyledHeaderCell)`
    text-align: right;
`;

export const DefaultHeaderCell = ({ displayName }) => {
    return (
        <WithTranslation>
            {(translate) => <StyledHeaderCell>{translate(displayName)}</StyledHeaderCell>}
        </WithTranslation>
    );
};

export const RightAlignedHeaderCell = ({ displayName }) => {
    return (
        <WithTranslation>
            {(translate) => (
                <RightAlignedHeaderCellStyled>
                    {translate(displayName)}
                </RightAlignedHeaderCellStyled>
            )}
        </WithTranslation>
    );
};

export const DefaultHeaderCellCounter = ({ displayName, metadata }) => {
    return (
        <WithTranslation>
            {(translate) => (
                <StyledHeaderCell>
                    {translate(displayName)} ({metadata.count || ""})
                </StyledHeaderCell>
            )}
        </WithTranslation>
    );
};
