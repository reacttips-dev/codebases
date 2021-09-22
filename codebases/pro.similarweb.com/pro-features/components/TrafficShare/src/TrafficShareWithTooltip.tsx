import * as React from "react";
import { StatelessComponent } from "react";
import { ITrafficShareBarProps } from "../../../styled components/StyledTrafficShare/src/StyledTrafficShare";
import { TrafficShareTooltip } from "../../tooltips/src/TrafficShareTooltip/TrafficShareTooltip";
import { TrafficShare } from "./TrafficShare";
import WithTranslation from "../../WithTranslation/src/WithTranslation";

export interface ITrafficShareProps {
    data: ITrafficShareBarProps[];
    title: string;
    barGap?: number;
    trafficShareHeight?: number;
    minWidthToShowData?: number;
    trafficShareClassName?: string;
}

export const TrafficShareWithTooltip: StatelessComponent<ITrafficShareProps> = ({
    data,
    title,
    barGap,
    trafficShareHeight,
    minWidthToShowData,
    trafficShareClassName,
}) => {
    const hasData = data && data.some((item) => item.width > 0);
    return hasData ? (
        <WithTranslation>
            {(translate) => (
                <TrafficShareTooltip trafficShareProps={data} title={title}>
                    <TrafficShare
                        data={data}
                        barGap={barGap}
                        height={trafficShareHeight}
                        minWidthToShowData={minWidthToShowData}
                        className={trafficShareClassName}
                    />
                </TrafficShareTooltip>
            )}
        </WithTranslation>
    ) : null;
};
