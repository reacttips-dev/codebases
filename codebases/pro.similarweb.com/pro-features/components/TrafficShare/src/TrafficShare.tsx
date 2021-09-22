import * as React from "react";
import { StatelessComponent } from "react";
import {
    ITrafficShareBarProps,
    TrafficShareBar,
    TrafficShareBarThin,
    TrafficShareContainer,
} from "../../../styled components/StyledTrafficShare/src/StyledTrafficShare";

export interface ITrafficShareProps {
    data: ITrafficShareBarProps[];
    minWidthToShowData?: number;
    className?: string;
    barGap?: number;
    height?: number;
}

export const TrafficShare: StatelessComponent<ITrafficShareProps> = ({
    data,
    minWidthToShowData,
    className,
    barGap,
    height,
}) => {
    const filteredZeroWidth = data.filter((item) => item.width > 0);
    return (
        <TrafficShareContainer className={className} height={height}>
            {filteredZeroWidth.map((item, index) => {
                if (index === 0 || index === filteredZeroWidth.length - 1) {
                    const showData = minWidthToShowData
                        ? item.width > minWidthToShowData
                        : item.width > 0.1;
                    return (
                        <TrafficShareBar
                            style={{}}
                            marginRight={barGap}
                            name={item.name}
                            key={index}
                            color={item.color}
                            backgroundColor={item.backgroundColor}
                            width={item.width}
                        >
                            {showData ? item.text : ""}
                        </TrafficShareBar>
                    );
                }
                // Added due to major performance issue in loyalty page where we render 100 cells of the top component causing slow machines to struggle adding multiple css rules to dom
                return (
                    <TrafficShareBarThin
                        key={index}
                        style={{
                            color: item.color,
                            backgroundColor: item.backgroundColor,
                            // @ts-ignore
                            width: `${item.width * 100}%`,
                            marginRight: `${barGap}px`,
                        }}
                    >
                        {item.width > 0.1 ? item.text : ""}
                    </TrafficShareBarThin>
                );
            })}
        </TrafficShareContainer>
    );
};
