import * as React from "react";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
import { PlainTooltip } from "../../Tooltip/PlainTooltip/PlainTooltip";
import * as classNames from "classnames";

export interface IProgressBarContainer {
    valuePercents: string;
    visits: number | boolean | string;
    progressBarWidth: number;
    innerColor?: string;
    height?: number;
    tooltipDisplayText?: string;
    layout?: "row" | "column";
}
export const ProgressBarContainer: React.FC<IProgressBarContainer> = ({
    valuePercents,
    visits,
    progressBarWidth,
    innerColor,
    height,
    tooltipDisplayText,
    layout,
}) => {
    const classes = classNames("swTable-progressBar", {
        "swTable-progressBar-column": layout === "column",
    });
    return (
        <div className={classes}>
            <span className="min-value">{valuePercents}</span>
            <PlainTooltip
                cssClass={"plainTooltip-element plainTooltip-element--header"}
                placement={"top"}
                text={`${visits} ${tooltipDisplayText}`}
                enabled={visits !== false}
            >
                <div className="u-full-width">
                    <ProgressBar width={progressBarWidth} innerColor={innerColor} height={height} />
                </div>
            </PlainTooltip>
        </div>
    );
};
ProgressBarContainer.defaultProps = {
    tooltipDisplayText: "referred visits",
    layout: "row",
};
ProgressBarContainer.displayName = "ProgressBarContainer";
