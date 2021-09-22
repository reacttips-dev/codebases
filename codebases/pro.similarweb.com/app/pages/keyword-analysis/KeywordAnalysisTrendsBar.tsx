import dayjs from "dayjs";
import { setFont } from "@similarweb/styles/src/mixins";
import { colorsPalettes, rgba, fonts } from "@similarweb/styles";
import React, { FC } from "react";
import { TrendsBar } from "../../../.pro-features/components/TrendsBar/src/TrendsBar";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";
import styled from "styled-components";
import { abbrNumberVisitsFilter } from "../../filters/ngFilters";
import { dynamicFilterFilter } from "filters/dynamicFilter";

interface IKeywordAnalysisTrendsBarProps {
    data?: Array<{ [key: string]: number }>;
    barsLimit?: number;
    inverted?: boolean;
}

interface IKeywordAnalysisTrendsBarContainerProps extends IKeywordAnalysisTrendsBarProps {
    dataVolume: number;
    trendsBar?: any;
    showUpperLine?: boolean;
    volumeThreshold?: number;
}

const dateFormat = (date) => dayjs(date).format("MMM, YYYY");
const Container = styled.div`
    height: 48px;
`;

export const RightCorner = styled.div`
    position: absolute;
    right: 20px;
    bottom: 15px;
`;
const Value = styled.label`
    @media (min-width: 1381px) {
        ${setFont({
            $family: fonts.$dmSansFontFamily,
            $weight: 300,
            $size: 38,
            $color: rgba(colorsPalettes.midnight[500], 0.8),
        })}
    }
    ${setFont({
        $family: fonts.$dmSansFontFamily,
        $weight: 300,
        $size: 32,
        $color: rgba(colorsPalettes.midnight[500], 0.8),
    })}
    cursor: default;
`;

const KeywordAnalysisTrendsBar: FC<IKeywordAnalysisTrendsBarProps> = ({
    data,
    barsLimit,
    inverted,
}) => {
    const filter = abbrNumberVisitsFilter();
    const dataWithTooltips = data.map((item) => {
        const [key, value] = Object.entries(item)[0];
        return {
            value,
            tooltip: (
                <span>
                    <strong>{`${filter(value)}`}</strong>
                    {` searches in ${dateFormat(key)}`}
                </span>
            ),
        };
    });
    return (
        <Container>
            <TrendsBar values={dataWithTooltips} barsLimit={barsLimit} inverted={inverted} />
        </Container>
    );
};

export default SWReactRootComponent(KeywordAnalysisTrendsBar, "KeywordAnalysisTrendsBar");

const FlexBox = styled.div`
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
`;

const TrendsBarContainer = styled.div`
    margin-top: 5px;
    display: flex;
    position: relative;
    left: 0px;
    bottom: 20px;
    height: 30px;
`;

const Hr = styled.hr`
    margin-top: 15px;
    margin-bottom: 24px;
`;
export const KeywordAnalysisTrendsBarContainer: React.FunctionComponent<IKeywordAnalysisTrendsBarContainerProps> = (
    props,
) => {
    return (
        <>
            {props.showUpperLine && <Hr />}
            <FlexBox>
                <Value>
                    {dynamicFilterFilter()(
                        props.dataVolume,
                        `minVisitsAbbr${props.volumeThreshold ? `:${props.volumeThreshold}` : ""}`,
                    )}
                </Value>
                {props.data && props.dataVolume > props.volumeThreshold && (
                    <TrendsBarContainer>
                        <KeywordAnalysisTrendsBar {...props} />
                    </TrendsBarContainer>
                )}
                {props.trendsBar && (
                    <TrendsBarContainer>
                        <div style={{ height: 48 }}>{props.trendsBar}</div>
                    </TrendsBarContainer>
                )}
            </FlexBox>
        </>
    );
};

KeywordAnalysisTrendsBarContainer.defaultProps = {
    showUpperLine: true,
    volumeThreshold: 5000,
};

SWReactRootComponent(KeywordAnalysisTrendsBarContainer, "KeywordAnalysisTrendsBarContainer");
