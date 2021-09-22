import { colorsPalettes } from "@similarweb/styles";
import * as React from "react";
import { StatelessComponent } from "react";
import { FlexColumn } from "../../../../styled components/StyledFlex/src/StyledFlex";
import { Bullet, Duration, LegendItem, LegendItems, Title } from "./StyledComponents";

interface IComparePeriodsLegendProps {
    titles: string[];
    durations: string[];
}

const durationColors = [colorsPalettes.orange[400], colorsPalettes.blue[400]];
const multipleTitleColors = [
    colorsPalettes.orange[200],
    colorsPalettes.orange[400],
    colorsPalettes.blue[200],
    colorsPalettes.blue[400],
];

export const ComparePeriodsLegend: StatelessComponent<IComparePeriodsLegendProps> = ({
    titles,
    durations,
}) => {
    const titlesPerDuration = titles.length / durations.length;
    const titleColors = titlesPerDuration > 1 ? [...multipleTitleColors] : [...durationColors];
    return (
        <LegendItems>
            {durations.map((item, idx) => (
                <ComparedItem
                    key={"li" + idx}
                    durationIndex={idx}
                    titles={titles.splice(0, titlesPerDuration)}
                    duration={durations[idx]}
                    titleColors={titleColors.splice(0, titlesPerDuration)}
                />
            ))}
        </LegendItems>
    );
};

interface IComparedItemProps {
    durationIndex: number;
    titles: string[];
    duration: string;
    titleColors: string[];
}

export const ComparedItem: StatelessComponent<IComparedItemProps> = ({
    durationIndex,
    titles,
    duration,
    titleColors,
}) => {
    return (
        <LegendItem>
            <Duration color={durationColors[durationIndex]}>{duration}</Duration>
            <FlexColumn>
                {titles.map((title, idx) => (
                    <Title key={"t" + idx}>
                        <Bullet color={titleColors[idx]} />
                        {title}
                    </Title>
                ))}
            </FlexColumn>
        </LegendItem>
    );
};
