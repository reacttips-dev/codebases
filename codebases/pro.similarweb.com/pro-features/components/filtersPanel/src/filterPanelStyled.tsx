import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import styled from "styled-components";
import { Textfield } from "@similarweb/ui-components/dist/textfield";

const SINGLE_MODE_TABLE_RATIO = "75% 25%";
const COMPARE_MODE_TABLE_RATIO = "50% 17% 33%";

const getHoverStyled = () => {
    return `
      &:hover {
        background-color: ${colorsPalettes.carbon[25]};
    }
  `;
};

export const PhraseFilterTableContentContainer = styled.div`
    max-height: 300px;
    overflow-y: auto;
`;

export const PhraseFilterContainer = styled.div`
    padding: 10px 0px;
`;

const PhraseFilterHeader = styled.div`
    display: grid;
    padding: 10px 11px 11px 11px;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;

export const PhraseFilterCompareHeader = styled(PhraseFilterHeader)`
    grid-template-columns: ${COMPARE_MODE_TABLE_RATIO};
`;

export const PhraseFilterSingleHeader = styled(PhraseFilterHeader)`
    grid-template-columns: ${SINGLE_MODE_TABLE_RATIO};
`;

export const Text = styled.label<{
    fontSize?: number;
    fontWeight?: number;
    opacity?: number;
    fontStyle?: string;
    hideData?: boolean;
}>`
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    cursor: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
    font-style: ${({ fontStyle }) => (fontStyle ? fontStyle : null)};
    visibility: ${({ hideData }) => (hideData ? `hidden` : `visible`)};
    ${({ fontWeight = 500 }) => fontWeight && `font-weight: ${fontWeight}`};
    ${({ fontSize = 12, opacity = 0.8 }) =>
        setFont({ $size: fontSize, $color: rgba(colorsPalettes.carbon[500], opacity) })};
`;

export const PhraseFilterSingleTableRowContainer = styled.div`
    cursor: pointer;
    ${getHoverStyled()};
`;

export const PhraseFilterSingleTableRow = styled.div`
    display: grid;
    grid-template-columns: ${SINGLE_MODE_TABLE_RATIO};
    padding: 12px 16px;
`;

export const PhraseFilterCompareTableContent = styled.div`
    display: grid;
    grid-template-columns: ${COMPARE_MODE_TABLE_RATIO};
    padding: 12px 16px;
`;

export const PhraseFilterCompareTableContentContainer = styled.div`
    cursor: pointer;
    height: 48px;
    ${getHoverStyled()};
`;

export const ProgressBarSingleContainer = styled.div`
    width: 50px;
`;

export const TrafficShareWithTooltipContainer = styled.div<{ hideData?: boolean }>`
    width: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 5px;
    visibility: ${({ hideData }) => (hideData ? `hidden` : `visible`)};
    .traffic-share-progress-bar {
        height: 12px;
    }
`;

export const SearchInput = styled(Textfield)`
    margin: 0px 4px;
    border-bottom: 1px solid ${colorsPalettes.blue[400]};
`;

export const ProgressBarSingleContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const ProgressBarSingleTextContainer = styled(ProgressBarSingleContentContainer)`
    padding-right: 8px;
`;
