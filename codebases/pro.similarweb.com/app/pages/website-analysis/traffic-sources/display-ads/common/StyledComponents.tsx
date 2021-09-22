import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { CenteredFlexRow, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { Switcher } from "@similarweb/ui-components/dist/switcher";
import { SWReactIcons } from "@similarweb/icons";

export const Filters = styled(FlexRow)`
    flex-grow: 1;
    justify-content: space-between;

    Button {
        min-width: 104px;
        margin-top: 18px;
        margin-right: 37px;
    }
`;

export const FiltersGrow = styled(FlexRow)`
    flex-grow: 1;
    margin: 15px 39px 4px 51px;
`;

export const Filter = styled(FlexRow)`
    width: auto;
    margin-right: 16px;
    .ChipItemText {
        max-width: 205px;
    }
`;

export const DomainsFilterWrapper = styled.div`
    display: flex;
`;

export const DisplayAdsPageWrapper = styled.div`
    min-height: 502px;
    background-color: ${colorsPalettes.carbon[0]};
    border-radius: 6px;
`;

export const StyledLoaderWrapper = styled(CenteredFlexRow)<{
    height?: number;
}>`
    height: ${({ height }) => (height ? `${height}px` : "400px")};
    background-color: ${colorsPalettes.carbon["0"]};
    width: 100%;
`;

export const DisplayAdsGalleryWrapper = styled.div`
    padding: 20px 51px 51px 51px;
`;

export const SortWrapper = styled(FlexRow)`
    margin-bottom: 20px;
    align-items: center;
`;

export const DropdownWrapper = styled.div`
    padding-right: 35px;
    .DropdownButton {
        background: ${colorsPalettes.carbon["0"]};
    }
    .DropdownButton--opened {
        background: ${colorsPalettes.blue["500"]};
        .DropdownButton-text {
            color: ${colorsPalettes.carbon["0"]};
        }
    }
    .DropdownButton-text {
        color: ${colorsPalettes.carbon["400"]};
    }
`;

export const FilterText = styled.span`
    font-size: 14px;
    padding-right: 12px;
`;

export const Separator = styled.div`
    width: 32px;
    height: 0;
    border: 1px solid #d4d8dc;
    transform: rotate(90deg);
    margin: 20px 6px 0 -16px;
`;

export const InnerFilters = styled(FlexRow)`
    flex-wrap: wrap;
    margin-top: 5px;

    ${Filter} {
        margin-bottom: 16px;
    }
`;

export const StyledEllipsisDropdownItem = styled(EllipsisDropdownItem)`
    grid-template-columns: 80% 9% 5%;
`;

export const ContainerWrapper = styled.div`
    background-color: ${colorsPalettes.carbon["0"]};
    box-shadow: 0 3px 6px ${rgba(colorsPalettes.carbon[500], 0.08)};
`;

export const StyledSwitcher = styled(Switcher)`
    height: 40px;
`;

export const StyledSWReactIcons = styled(SWReactIcons)<{ isClicked: boolean }>`
    svg {
        path {
            fill: ${({ isClicked }) =>
                isClicked ? colorsPalettes.blue[400] : colorsPalettes.midnight[200]};
        }
    }
`;

export const LoaderWrapper = styled(CenteredFlexRow)`
    height: 100%;
`;
