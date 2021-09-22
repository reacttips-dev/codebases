import { SWReactIcons } from "@similarweb/icons";
import { LegendWithValue } from "@similarweb/ui-components/dist/legend";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import GAVerifiedContainer from "components/React/GAVerifiedIcon/GAVerifiedContainer";
import {
    GridBox,
    IconsContainer,
    ILegendProps,
    InfoIconContainer,
    StyledPillGreen,
} from "components/React/Legends/styledComponents";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import React from "react";
import { CHART_COLORS } from "constants/ChartColors";
import { dynamicFilterFilter } from "filters/dynamicFilter";

const colors = CHART_COLORS.compareMainColors;
const maxWebsitesPerRow = 8;
const nameAndDataMargin = "2px";

export const Legends: React.FunctionComponent<ILegendProps> = ({
    legendItems,
    toggleSeries,
    gridColumnGap,
    gridRowGap,
    showLegendsData,
    legendComponent,
    gridDirection,
    legendComponentWrapper,
    textMaxWidth,
}) => {
    // next two dummy lines are only to re-render the React component due to the angular break ''
    const [dummyVar, setDummyVar] = React.useState(true);
    const reRenderLegendsComponent = () => setDummyVar(!dummyVar);
    const itemsAmount = legendItems.length;
    const legends = legendItems.map((item, index) => {
        const icons = [];
        if (item.isGAVerified) {
            icons.push(
                <IconsContainer key={"GAVerified"}>
                    <GAVerifiedContainer
                        size="SMALL"
                        isActive={true}
                        isPrivate={item.isGAPrivate}
                        key={index}
                        tooltipAvailable={true}
                        tooltipIsActive={false}
                        metric={item.metric}
                    />
                </IconsContainer>,
            );
        }
        if (item.isWinner) {
            icons.push(
                <IconsContainer key="winner" className="winnerIcon">
                    <SWReactIcons iconName="winner" size="xs" />
                </IconsContainer>,
            );
        }
        if (item.infoTooltip) {
            icons.push(
                <InfoIconContainer key="info-tooltip">
                    <PlainTooltip placement="top" text={item.infoTooltip}>
                        <span>
                            <InfoIcon iconName="info" />
                        </span>
                    </PlainTooltip>
                </InfoIconContainer>,
            );
        }
        if (item.isBeta) {
            icons.push(
                <InfoIconContainer key={index}>
                    <StyledPillGreen>BETA</StyledPillGreen>
                </InfoIconContainer>,
            );
        }
        const value = item.data && dynamicFilterFilter()(item.data, item.format);
        const Legend = legendComponent ? legendComponent : LegendWithValue;
        const legend = (
            <Legend
                segmentSubtitleWidth={164}
                text={item.name}
                setOpacity={item.setOpacity}
                isChecked={item.visible ?? !item.hidden}
                subtitleText={item?.subtitleText}
                labelColor={item.color || colors[index % colors.length]}
                value={item.showLegendData !== false && showLegendsData && value}
                key={index}
                icons={icons}
                textMaxWidth={textMaxWidth}
                // the distance between the website name and the value bellow
                gridRowGap={item.gridRowGap || nameAndDataMargin}
                isDisabled={item.isDisabled}
                onClick={(event) => {
                    toggleSeries(item, !!item.hidden, event, reRenderLegendsComponent);
                }}
            />
        );

        const legendTooltip = item.tooltip ? (
            <PlainTooltip placement="top" text={item.tooltip} key={index}>
                <span>{legend}</span>
            </PlainTooltip>
        ) : (
            legend
        );

        const Wrapper = legendComponentWrapper;
        return Wrapper ? <Wrapper key={index}>{legendTooltip}</Wrapper> : legendTooltip;
    });
    const repeatAmount = Math.min(itemsAmount, maxWebsitesPerRow);
    return (
        <GridBox
            className="legends-container"
            repeatAmount={repeatAmount.toString()}
            gridRowGap={gridRowGap}
            gridColumnGap={gridColumnGap}
            gridDirection={gridDirection}
        >
            {legends}
        </GridBox>
    );
};
Legends.defaultProps = {
    gridColumnGap: "24px",
    gridRowGap: "10px",
    showLegendsData: true,
    textMaxWidth: "150px",
};
export default SWReactRootComponent(Legends, "Legends");
