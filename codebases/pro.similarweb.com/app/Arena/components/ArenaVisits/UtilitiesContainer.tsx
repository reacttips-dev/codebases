import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { CircleSwitcherItem, Switcher } from "@similarweb/ui-components/dist/switcher";
import * as React from "react";
import { SFC } from "react";
import { granularities } from "../../../../.pro-features/utils";
import { i18nFilter } from "../../../filters/ngFilters";
import {
    StyledSwitcherDivider,
    StyledSwitchersContainer,
    StyledUtilsContainer,
} from "./StyledComponents";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";

export interface IUtilitiesContainerProps {
    unbounceVisitsOnly?: boolean;
    onBounceVisitsOnlyChange?: () => void;
    unbounceVisitsTitle: string;
    unbounceVisitsTitleTooltip: string;
    selectedGranularityIndex: number;
    selectedVisualizationIndex: number;
    onGranularitiesClick: (selectedIndex, granularity) => void;
    onVisualizationClick: (selectedIndex, visualization) => void;
}

export const UtilitiesContainer: SFC<IUtilitiesContainerProps> = ({
    unbounceVisitsOnly,
    onBounceVisitsOnlyChange,
    unbounceVisitsTitle,
    unbounceVisitsTitleTooltip,
    selectedGranularityIndex,
    selectedVisualizationIndex,
    onGranularitiesClick,
    onVisualizationClick,
}) => {
    const visualizations = ["%", "#"];
    return (
        <StyledUtilsContainer>
            <PlainTooltip
                placement={"top"}
                tooltipContent={i18nFilter()(unbounceVisitsTitleTooltip)}
            >
                <span>
                    <Checkbox
                        selected={unbounceVisitsOnly}
                        label={i18nFilter()(unbounceVisitsTitle)}
                        onClick={onBounceVisitsOnlyChange}
                    />
                </span>
            </PlainTooltip>
            <StyledSwitchersContainer
                data-sw-intercom-tour-workspaces-marketing-styled_switchers_container-step-4
            >
                <Switcher
                    selectedIndex={selectedGranularityIndex}
                    customClass="CircleSwitcher"
                    onItemClick={(index) => onGranularitiesClick(index, granularities[index])}
                >
                    {granularities.map((granItem) => {
                        return (
                            <CircleSwitcherItem key={granItem}>
                                {granItem.charAt(0)}
                            </CircleSwitcherItem>
                        );
                    })}
                </Switcher>
                <StyledSwitcherDivider />
                <Switcher
                    selectedIndex={selectedVisualizationIndex}
                    customClass="CircleSwitcher"
                    onItemClick={(index) => onVisualizationClick(index, visualizations[index])}
                >
                    {visualizations.map((visItem) => {
                        return <CircleSwitcherItem key={visItem}>{visItem}</CircleSwitcherItem>;
                    })}
                </Switcher>
            </StyledSwitchersContainer>
        </StyledUtilsContainer>
    );
};
