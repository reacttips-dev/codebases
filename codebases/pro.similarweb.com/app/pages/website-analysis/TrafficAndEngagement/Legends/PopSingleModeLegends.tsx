import {
    Bullet,
    Text,
} from "pages/website-analysis/TrafficAndEngagement/Components/StyledComponents";
import { webSourceDisplayName } from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/UtilityFunctions";
import React from "react";

export const PopSingleModeLegends = (props) => {
    const { webSource, chartType, legendItems, customLegends } = props;
    const Legends = legendItems.map((item, index) => (
        <Legend
            item={item}
            key={index}
            webSource={webSource}
            chartType={chartType}
            customLegends={customLegends}
        />
    ));
    return Legends;
};

const Legend = (props) => {
    const { item, webSource, chartType, customLegends } = props;
    const { name, color, transparentColor } = item;
    const allWebSources = ["Mobile web", "Desktop"];
    const webSources =
        webSource === "Total" && chartType === "column" && customLegends
            ? allWebSources
            : [webSource];
    return (
        <div>
            <Text color={color}>{name}</Text>
            {webSources.map((webSource, index) => (
                <WebSource
                    key={index}
                    webSource={webSource}
                    color={index === 0 ? color : transparentColor}
                />
            ))}
        </div>
    );
};

const WebSource = ({ color, webSource }) => {
    return (
        <Text>
            <Bullet background={color} />
            {webSourceDisplayName[webSource] ? webSourceDisplayName[webSource] : webSource}
        </Text>
    );
};
