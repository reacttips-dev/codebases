import { colorsPalettes } from "@similarweb/styles";
import * as React from "react";
import {
    BottomSectionContainer,
    BreakLineText,
    BreakLineTextContainerGrid,
    Bullet,
    ChangeContainer,
    ChangeTooltipContainer,
    Dash,
    FlexColumn,
    HeaderContainer,
    HeadersContainerGrid,
    Icon,
    RowContainerGrid,
    Separator,
    Text,
    TextGridChild,
    ZeroChangeContainer,
} from "./StyledComponents";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

const TextWithBullets = (props) => {
    const { textProps, bulletProps } = props;
    const { bulletsColor } = bulletProps;
    return (
        <FlexRow>
            {bulletsColor.map((bulletColor, index) => (
                <Bullet key={index} color={bulletColor} />
            ))}
            <Text {...textProps}>{props.children}</Text>
        </FlexRow>
    );
};

const ZeroChange = ({ subtitle, rowHeight }) => {
    return (
        <ZeroChangeContainer hasSubtitle={!!subtitle} rowHeight={rowHeight}>
            <Dash hasSubtitle={!!subtitle} />
        </ZeroChangeContainer>
    );
};

const bottomSectionRow = (
    { displayName, value, isBold, change, subtitle },
    index,
    bottomRows,
    defaultNullValue,
    rowHeight,
    columns,
    getChangeColor,
) => {
    const numberOfEqualSizedColumns = columns - 1;
    const isLastRow = index === bottomRows.length - 1;
    const lastRowColorValue =
        bottomRows.length > 1 && isLastRow ? colorsPalettes.carbon[300] : undefined;
    return (
        <>
            <RowContainerGrid
                key={displayName}
                rowHeight={rowHeight}
                equalColumns={numberOfEqualSizedColumns}
            >
                <TextGridChild
                    data-automation="change-tooltip-table-rows-value"
                    justifySelf={false}
                    color={lastRowColorValue}
                >
                    {displayName}
                </TextGridChild>
                {value.map((val) => (
                    <TextGridChild
                        key={val}
                        data-automation="change-tooltip-table-rows-value"
                        justifySelf={true}
                        color={lastRowColorValue}
                    >
                        {val ? val : defaultNullValue}
                    </TextGridChild>
                ))}
                <Change
                    key={index}
                    subtitle={subtitle}
                    value={change}
                    getChangeColor={getChangeColor}
                    rowHeight={rowHeight}
                />
            </RowContainerGrid>
            {!isLastRow && <Separator key="separator" />}
        </>
    );
};

const row = (
    { color, displayName, value, change, type, subtitle, isBold },
    index,
    tableRows,
    defaultNullValue,
    rowHeight,
    columns,
    getChangeColor,
) => {
    const numberOfEqualSizedColumns = columns - 1;
    return (
        <RowContainerGrid
            key={`row-${index}`}
            rowHeight={rowHeight}
            equalColumns={numberOfEqualSizedColumns}
        >
            {subtitle ? (
                <FlexColumn>
                    <TextWithBullets
                        bulletProps={{
                            bulletsColor: type === "total" ? [tableRows[0].color, color] : [color],
                        }}
                        data-automation="change-tooltip-table-rows-domain"
                    >
                        {displayName}
                    </TextWithBullets>
                    {subtitle}
                </FlexColumn>
            ) : (
                <TextWithBullets
                    textProps={{ isBold }}
                    bulletProps={{
                        bulletsColor: type === "total" ? [tableRows[0].color, color] : [color],
                    }}
                    data-automation="change-tooltip-table-rows-domain"
                >
                    {displayName}
                </TextWithBullets>
            )}
            {value.map((val) => (
                <TextGridChild
                    key={val}
                    data-automation="change-tooltip-table-rows-value"
                    opacity={0.8}
                    isBold={isBold}
                    justifySelf={true}
                >
                    {val ? val : defaultNullValue}
                </TextGridChild>
            ))}
            <Change
                key={index}
                subtitle={subtitle}
                value={change}
                getChangeColor={getChangeColor}
                rowHeight={rowHeight}
            />
        </RowContainerGrid>
    );
};

const Headers = ({ tableHeaders, header, columns }) => {
    // generate array deep copy in order to prevent the props from mutating by the sort.
    const tableHeadersDeepCopy = [...tableHeaders];
    const sortByPosition = (objA, objB) => objA.position - objB.position;
    const sortedTableHeaders = tableHeadersDeepCopy.sort(sortByPosition);
    const firstColumnHeader = sortedTableHeaders[0];
    const remainingColumnsHeaders = sortedTableHeaders.slice(1, sortedTableHeaders.length);
    const numberOfEqualSizedColumns = columns - 1;
    const tableHeaderSize = 12;
    const defaultOpacity = 0.8;
    return (
        <>
            <HeaderContainer>
                <Text maxWidth="280px" isBold={true} data-automation="change-tooltip-header">
                    {header}
                </Text>
            </HeaderContainer>
            <HeadersContainerGrid equalColumns={numberOfEqualSizedColumns}>
                {/* safe to get data from array by position because it's sorted*/}
                <Text
                    size={tableHeaderSize}
                    opacity={defaultOpacity}
                    data-automation="change-tooltip-table-headers-domain"
                >
                    {firstColumnHeader.displayName}
                </Text>
                {remainingColumnsHeaders.map((header) => (
                    <BreakLineTextContainerGrid key={header.displayName}>
                        <BreakLineText
                            size={tableHeaderSize}
                            opacity={defaultOpacity}
                            data-automation="change-tooltip-table-headers-value"
                        >
                            {header.displayName}
                        </BreakLineText>
                    </BreakLineTextContainerGrid>
                ))}
            </HeadersContainerGrid>
        </>
    );
};

const Change = ({ value, getChangeColor, rowHeight, subtitle }) => {
    if (value === "0" || value === 0) {
        return <ZeroChange subtitle={subtitle} rowHeight={rowHeight} />;
    }
    const isDecrease = value.charAt(0) === "-" || value.trim().charAt(0) === "<";
    // the use of the slice method in order to remove the percentage sign
    let isNan = value === "N/A" || isNaN(value.slice(0, -1));
    if (value.trim().charAt(0) === "<" || value.trim().charAt(0) === ">") {
        isNan = false;
    }
    const color = getChangeColor(isDecrease, isNan);
    return (
        <ChangeContainer isNan={isNan} rowHeight={rowHeight}>
            {!isNan && <Icon iconName={isDecrease ? "arrow-down" : "arrow-up"} color={color} />}
            <Text size={14} color={color} opacity={isNan ? 0.8 : 1}>
                {isDecrease ? value.substr(1) : value.trim()}
            </Text>
        </ChangeContainer>
    );
};

export const RankingsDistributionTooltip = (props) => {
    const {
        tableRows,
        defaultNullValue,
        getChangeColor,
        rowHeight,
        width,
        columns,
        bottomRows: bottomRowsProp = [],
    } = props;
    const rows = tableRows.map((item, index, tableRows) =>
        row(item, index, tableRows, defaultNullValue, rowHeight, columns, getChangeColor),
    );
    const bottomRows =
        bottomRowsProp.length === 0
            ? undefined
            : bottomRowsProp.map((item, index, bottomRows) =>
                  bottomSectionRow(
                      item,
                      index,
                      bottomRows,
                      defaultNullValue,
                      rowHeight,
                      columns,
                      getChangeColor,
                  ),
              );
    return (
        <ChangeTooltipContainer width={width}>
            <Headers {...props} />
            {rows}
            {!!bottomRows && <BottomSectionContainer>{bottomRows}</BottomSectionContainer>}
        </ChangeTooltipContainer>
    );
};

RankingsDistributionTooltip.defaultProps = {
    defaultNullValue: "N/A",
    rowHeight: 24,
    // the following function in order to support others colors for bounce rate and future features
    getChangeColor: (isDecrease, isNan) =>
        isDecrease
            ? colorsPalettes.red.s100
            : isNan
            ? colorsPalettes.carbon[500]
            : colorsPalettes.green.s100,
};
