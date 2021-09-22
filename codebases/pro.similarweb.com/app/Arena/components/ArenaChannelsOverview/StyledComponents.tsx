import { colorsPalettes } from "@similarweb/styles";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";
import { FlexRow } from "../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { StyledBox } from "../../StyledComponents";
import { CategoryItem } from "components/React/CategoriesDropdown/CategoryDropdown";
import { StyledHeader } from "pages/app performance/src/page/StyledComponents";

export const ChannelsBox = styled(StyledBox)`
    font-family: Roboto, serif;
    ${StyledHeader} {
        margin-bottom: 16px;
    }
`;
ChannelsBox.displayName = "ChannelsBox";

export const FiltersContainer = styled(FlexRow)`
    justify-content: space-between;
    padding: 0 24px 16px;
`;
FiltersContainer.displayName = "FiltersContainer";

export const CheckboxesContainer = styled(FlexRow)`
    > div:first-child {
        margin-right: 32px;
    }
`;
CheckboxesContainer.displayName = "CheckboxesContainer";

export const ChartContainer = styled.div`
    height: 240px;

    box-sizing: border-box;

    padding: 0 14px 8px 14px;

    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;
ChartContainer.displayName = "ChartContainer";

export const CategoriesChipDownContainer = styled.div`
    margin-right: 10px;
`;
CategoriesChipDownContainer.displayName = "CategoriesChipDownContainer";

export const CategoryItemContainer = styled(CategoryItem)`
    font-weight: 400;
`;
CategoryItemContainer.displayName = "CategoryItemContainer";
