import styled from "styled-components";
import { PrimaryHomepageHeader } from "@similarweb/ui-components/dist/homepages/primary/src/StyledComponents";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { HomepageBodyText } from "@similarweb/ui-components/dist/homepages/common/CommonStyledComponents";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { setFont } from "@similarweb/styles/src/mixins";

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    > * {
        width: 100%;
        box-sizing: border-box;
    }
`;

export const HeaderContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    min-width: 980px;
    max-width: 1060px;
    padding: 40px;
    box-sizing: border-box;
`;

export const TilesGroup = styled.div`
    min-width: 980px;
    max-width: 1060px;
    &:last-child {
        margin-bottom: 48px;
    }
`;

export const AutocompleteWrapper = styled.div.attrs(
    (props: { isCollapsed: boolean; isFocused?: boolean }) => ({
        isCollapsed: props.isCollapsed ? "276px" : "465px",
        isFocused: props.isFocused
            ? rgba(colorsPalettes.carbon[500], 0.8)
            : colorsPalettes.carbon[0],
    }),
)`
    transition: all 0.05s ease-out;
    width: ${(props) => props.isCollapsed as any};
    .AutocompleteDigitalMarketing {
        > *:hover,
        > *:hover:not(:hover) {
            border: 1px solid ${colorsPalettes.carbon[0]} !important;
        }
    }
    .input-container {
        background: transparent;
        * {
            color: ${(props) => props.isFocused as any};
        }
    }
`;

export const PrimaryHomepageHeaderStyled = styled(PrimaryHomepageHeader)`
    position: sticky;
    display: flex;
    flex-direction: row;
    justify-content: center;
    top: 0;
    padding: 0;
`;

export const Text = styled.div.attrs((props) => ({
    color: props.color,
}))`
    ${(props) => mixins.setFont({ $color: props.color })};
`;

export const HeaderTitle = styled(Text).attrs(() => ({
    color: colorsPalettes.carbon[0],
}))`
    font-size: 34px;
    font-weight: 500;
    line-height: 40px;
    margin-bottom: 8px;
`;
export const HeaderSubtitle = styled(Text).attrs(() => ({
    color: colorsPalettes.carbon[0],
}))`
    font-size: 14px;
`;

export const HomepageBodyTextStyled = styled(HomepageBodyText)`
    font-size: 24px
    display: block;
    margin: 48px 0 24px 40px;
`;

export const TilesContainer = styled.div.attrs((props: { tilesPerRow: number }) => ({
    tilesPerRow: props.tilesPerRow ?? 4,
}))`
    display: grid;
    grid-template-columns: repeat(${(props) => props.tilesPerRow}, 1fr);
    grid-gap: 24px;
    justify-items: center;
    margin: 0 40px;
`;

export const RedirectTabsContainer = styled.span`
    > div {
        display: inline-block;
    }
`;

export const RedirectEmptyState = styled.div<{ width?: number }>`
    width: ${({ width }) => (width ? `${width}px` : "auto")};
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 51px;
    img {
        margin-bottom: 66px;
    }
`;
export const RedirectEmptyStateText = styled.div`
    text-align: center;
    ${setFont({ $size: 16, $color: colorsPalettes.carbon["400"] })};
`;

export const RedirectStyledLoader = styled(PixelPlaceholderLoader)`
    margin-bottom: 12px;
`;
