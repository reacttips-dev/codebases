import React from "react";
import { Switcher, TextSwitcherItem } from "@similarweb/ui-components/dist/switcher";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledSwitcherContainer } from "./styles";
import { BenchmarksVisualizationType } from "../../constants";
import VisualisationSwitchItem from "../VisualisationSwitchItem/VisualisationSwitchItem";

type VisualisationSwitchProps = {
    selected: BenchmarksVisualizationType;
    onSelect(index: number): void;
};

const VisualisationSwitch = (props: VisualisationSwitchProps) => {
    const translate = useTranslation();
    const { selected, onSelect } = props;

    return (
        <StyledSwitcherContainer>
            <Switcher selectedIndex={selected} onItemClick={onSelect} customClass="TextSwitcher">
                <TextSwitcherItem>
                    <VisualisationSwitchItem
                        iconName="arena"
                        tooltipText={translate("si.insights.leaderboard.tooltip_text")}
                        tooltipTitle={translate("si.insights.leaderboard.tooltip_title")}
                    />
                </TextSwitcherItem>
                <TextSwitcherItem>
                    <VisualisationSwitchItem
                        iconName="icon-graph"
                        tooltipText={translate("si.insights.chart.tooltip_text")}
                        tooltipTitle={translate("si.insights.chart.tooltip_title")}
                    />
                </TextSwitcherItem>
                <TextSwitcherItem>
                    <VisualisationSwitchItem
                        iconName="icon-table"
                        tooltipText={translate("si.insights.table.tooltip_text")}
                        tooltipTitle={translate("si.insights.table.tooltip_title")}
                    />
                </TextSwitcherItem>
            </Switcher>
        </StyledSwitcherContainer>
    );
};

export default VisualisationSwitch;
