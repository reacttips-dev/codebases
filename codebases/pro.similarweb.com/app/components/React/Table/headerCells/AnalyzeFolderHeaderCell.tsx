import * as React from "react";
import { fonts } from "@similarweb/styles";
import styled from "styled-components";
import { i18nFilter } from "filters/ngFilters";

// FIXME: Used just here, due to currently we haven't got label exported from ui-components
const BetaLabel = styled.span`
    letter-spacing: 0.6px;
    font-family: ${fonts.$robotoFontFamily};
    font-size: 8px;
    border-radius: 10px;
    font-weight: bold;
    color: #fff;
    text-transform: uppercase;
    padding: 4px 5px 3px 5px;
    line-height: 1;
    background-color: #4fc3a0;
    margin-left: 5px;
`;

const AnalyzeHeaderContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const AnalyzeFolderHeaderCell = (props) => (
    <AnalyzeHeaderContainer>
        {props.displayName}
        <BetaLabel>
            {i18nFilter()("analysis.content.pop.pages.table.columns.analysis.beta")}
        </BetaLabel>
    </AnalyzeHeaderContainer>
);
