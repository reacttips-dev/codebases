import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import * as s from "./styles";

export type BenchmarkSummaryItemProps = {
    text: string;
    value: string | number;
    loading?: boolean;
    isWinner?: boolean;
    labelColor?: string;
    valueColor?: string;
    dataAutomation: string;
    infoTooltipText?: string;
    align?: "flex-start" | "center" | "flex-end";
    customIcon?: JSX.Element;
    className?: string;
};

const BenchmarkSummaryItem: React.FC<BenchmarkSummaryItemProps> = ({
    text,
    value,
    align,
    labelColor,
    valueColor,
    dataAutomation,
    infoTooltipText,
    loading = false,
    isWinner = false,
    customIcon,
    className,
}) => {
    function renderInfoTooltip() {
        return (
            <PlainTooltip tooltipContent={infoTooltipText} placement="top" maxWidth={200}>
                <s.StyledBenchmarkSummaryInfo>
                    <SWReactIcons iconName="global-rank" size="xs" />
                </s.StyledBenchmarkSummaryInfo>
            </PlainTooltip>
        );
    }

    function renderValue() {
        if (loading) {
            return <PixelPlaceholderLoader width={45} height={17} />;
        }

        return (
            <s.StyledBenchmarkSummaryValueText data-automation={dataAutomation} color={valueColor}>
                {customIcon}
                <span>{value}</span>
                {isWinner && (
                    <s.StyledBenchmarkWinnerIcon>
                        <SWReactIcons iconName="winner" size="xs" />
                    </s.StyledBenchmarkWinnerIcon>
                )}
            </s.StyledBenchmarkSummaryValueText>
        );
    }

    return (
        <s.StyledBenchmarkSummaryItem
            className={className}
            justifyContent={align}
            data-automation="benchmark-summary-item"
        >
            <s.StyledBenchmarkSummaryItemInner>
                <s.StyledBenchmarkSummaryItemHead>
                    {labelColor && <s.StyledBenchmarkSummaryLabel labelColor={labelColor} />}
                    <span>{text}</span>
                    {infoTooltipText && renderInfoTooltip()}
                </s.StyledBenchmarkSummaryItemHead>
                {renderValue()}
            </s.StyledBenchmarkSummaryItemInner>
        </s.StyledBenchmarkSummaryItem>
    );
};

export default BenchmarkSummaryItem;
