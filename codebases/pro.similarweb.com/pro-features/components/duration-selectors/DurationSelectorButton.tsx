import { SWReactIcons } from "@similarweb/icons";
import { FiltersBarDropdownButton } from "components/filters-bar/filters-bar-dropdown/FiltersBarDropdownButton";
import { getDropDownButtonTitle } from "pages/website-analysis/DurationSelectorUtils";
import styled from "styled-components";

const DurationSelectorTextStyle = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
`;

const DurationSelectorIconStyle = styled.div`
    width: 24px;
    height: 24px;
    margin-right: 8px;
`;

const DurationSelectorDropdownButton = styled(FiltersBarDropdownButton)`
    & .DropdownButton-text.DropdownButton-text {
        text-indent: 0;
        margin-right: 15px;
        width: 100%;
    }
`;

export const DurationSelectorButton = ({
    height,
    isDisabled,
    initialPreset,
    presets,
    isCompare = false,
}) => (
    <DurationSelectorDropdownButton disabled={isDisabled} hasValue={true} height={height}>
        <DurationSelectorIconStyle>
            <SWReactIcons iconName="daily-ranking" />
        </DurationSelectorIconStyle>
        <DurationSelectorTextStyle>
            {getDropDownButtonTitle(initialPreset, presets)}
            {isCompare && <span className="isCompareBullet" />}
        </DurationSelectorTextStyle>
    </DurationSelectorDropdownButton>
);
