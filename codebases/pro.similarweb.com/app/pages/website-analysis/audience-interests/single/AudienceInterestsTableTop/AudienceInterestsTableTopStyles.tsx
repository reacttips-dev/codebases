import styled, { css } from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";
import { DownloadExcelContainer, SearchContainer } from "../../../../workspace/StyledComponent";

export const Container = styled.div`
    display: flex;
    align-items: center;
    ${SearchContainer} {
        flex-grow: 1;
    }
`;

export const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

export const Section = styled.div<{ margin?: number }>`
    padding: 0 12px;
    display: flex;
    align-items: center;
    ${({ margin }) =>
        margin &&
        css`
            margin: ${margin}px 0;
        `};
`;

export const ChipdownItem = styled.div`
    flex-grow: 0;
    margin-right: 8px;
`;

export const Title = styled.div`
    padding: 24px 24px 22px 24px;
    ${mixins.setFont({ $size: 20, $color: colorsPalettes.carbon[500], $weight: 500 })};
`;

export const Separator = styled.hr`
    border-top-color: ${colorsPalettes.carbon[50]};
    margin: 0;
`;

export const SectionContainer = styled.div`
    padding: 0 24px;
`;

export const SingleBox = styled.div<{ border: number }>`
    border: ${({ border }) => border}px solid ${colorsPalettes.carbon[50]};
    border-radius: 4px;
    overflow: hidden;
`;

export const CategoriesAndTopicsDist = styled.div`
    display: flex;
    margin: 17px 0 24px 0;
`;

export const CategoriesWrapper = styled(SingleBox)`
    flex-basis: 60%;
    margin-right: 16px;
`;

export const TopicsWrapper = styled(SingleBox)`
    flex-basis: 40%;
    padding: 16px;
    box-sizing: border-box;
`;

export const TopicsTitle = styled.div`
    ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
    margin-bottom: 20px;
    display: flex;
`;
