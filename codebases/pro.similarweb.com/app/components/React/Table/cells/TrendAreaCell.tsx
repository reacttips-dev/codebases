import React, { useRef, useMemo } from "react";
import styled from "styled-components";
import { isEmpty } from "lodash";
import { getUuid } from "UtilitiesAndConstants/UtilityFunctions/crypto";

export const TrendContainer = styled.div`
    top: -4px;
    position: relative;
    pointer-events: none;
`;

const AlignRight = styled.div`
    text-align: right;
`;

interface ITrendAreaCellProps {
    value: number[];
}

// this is for aspect ratio only and does not affect the actual pixel size
const width = 106;
const height = 30;

export const TrendAreaCell: React.FC<ITrendAreaCellProps> = ({ value }) => {
    const svgId = useRef(`trendAreaCell-gradient-${getUuid()}`);

    if (isEmpty(value)) {
        return <AlignRight>N/A</AlignRight>;
    }

    const pathData = useMemo(() => {
        const step = width / (value.length - 1);
        const ratio = Math.max(...value) / height;
        const normalizedData = value.map((dataPoint) => dataPoint / ratio);

        // 0 is the start of the svg
        let currentStep = 0;
        let path = `M ${currentStep} ${height - normalizedData[0]}`;
        normalizedData.shift();

        normalizedData.forEach((d) => {
            currentStep += step;
            const reversedValue = height - d;
            path += ` L ${currentStep} ${reversedValue}`;
        });

        return path;
    }, [value]);

    const fillPathData = useMemo(() => {
        return `${pathData} L ${width} ${height} L 0 ${height} Z`;
    }, [pathData]);

    return (
        <TrendContainer>
            <AlignRight>
                <svg viewBox={`0 0 ${width} ${height}`}>
                    <path fill={`url(#${svgId.current})`} d={fillPathData} data-z-index="0"></path>
                    <path
                        fill="none"
                        d={pathData}
                        data-z-index="1"
                        stroke="#3E74FE"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    ></path>
                    <defs>
                        <defs>
                            <linearGradient x1="0" y1="0" x2="0" y2="1" id={svgId.current}>
                                <stop offset="0" stopColor="#E3EBFF" stopOpacity="1"></stop>
                                <stop offset="1" stopColor="#E3EBFF" stopOpacity="1"></stop>
                            </linearGradient>
                        </defs>
                    </defs>
                </svg>
            </AlignRight>
        </TrendContainer>
    );
};
