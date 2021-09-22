import styled from "styled-components";
import { RightAlignedCell } from "components/React/Table/cells/RankCell";
import React from "react";
import { Change, ChangeAbs } from "components/React/Table/cells";
import { colorsPalettes } from "@similarweb/styles";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import { i18nFilter, pureNumberFilterWithZeroCount } from "filters/ngFilters";
import { setFont } from "@similarweb/styles/src/mixins";

const PositionCellArrow = styled.div`
    margin: 0 6px;
`;
const PositionCellTarget = styled.b``;
const Container = styled(RightAlignedCell)`
    display: flex;
    text-align: center;
    justify-content: flex-end;
`;
const New = styled.span`
    color: ${colorsPalettes.green["s100"]};
`;

const NumberColor = styled.span<{ positive: boolean }>`
    color: ${({ positive }: { positive: boolean }) =>
        positive ? colorsPalettes.green["s100"] : colorsPalettes.red["s100"]};
`;
const Text = styled.span`
    ${setFont({ $color: colorsPalettes.carbon[500], $size: 13, $weight: 400 })};
`;
const SerpFeatureChangeTooltipContent = ({ value, previousPosition }) => {
    const isPositive = value > 0;
    const firstName = isPositive ? "Up" : "Down";
    return (
        <>
            <Text>{i18nFilter()("serp.table.change.call.tooltip.part1", { text: firstName })}</Text>
            &nbsp;
            <NumberColor positive={isPositive}>
                {pureNumberFilterWithZeroCount(Math.abs(value), 1)}
            </NumberColor>
            &nbsp;
            <Text>
                {i18nFilter()("serp.table.change.call.tooltip.part2", { number: previousPosition })}
            </Text>
        </>
    );
};

export const PositionAbsoluteChangeCell = (props) => {
    const { row, showTooltip } = props;
    const previousPosition = row.PreviousPosition || row.previousPosition;
    const currentPosition = row.CurrentPosition || row.currentPosition;

    const popupConfig = {
        width: 240,
        placement: "top",
    };

    if (Number.isInteger(previousPosition)) {
        const value = previousPosition - currentPosition;
        if (showTooltip && value) {
            return (
                <PopupHoverContainer
                    config={popupConfig}
                    content={() => (
                        <SerpFeatureChangeTooltipContent
                            value={value}
                            previousPosition={previousPosition}
                        />
                    )}
                >
                    <Container>
                        <ChangeAbs {...props} value={value} />
                    </Container>
                </PopupHoverContainer>
            );
        } else {
            return (
                <Container>
                    <ChangeAbs {...props} value={value} />
                </Container>
            );
        }
    } else {
        return (
            <Container>
                <New>New</New>
            </Container>
        );
    }
};
