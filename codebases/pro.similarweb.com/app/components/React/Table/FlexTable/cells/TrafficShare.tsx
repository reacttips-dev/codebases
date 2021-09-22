import styled from "styled-components";
import { percentageFilter } from "filters/ngFilters";
import { ProgressBar } from "components/React/ProgressBar";
import { FlexWithSpace } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { Text } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";

const FractionLength = 2;

const TrafficShareContainer = styled(FlexWithSpace)`
    align-items: center;
    height: 36px;
    width: 108px;
    font-size: 14px;
`;

const ProgressCellContainer = styled.div`
    width: 46px;
`;

const TrafficShare = ({
    totalShare,
    hideZeroValue = true,
}: {
    totalShare: number;
    hideZeroValue?: boolean;
}) => {
    const isZeroShare = totalShare === 0;
    const shouldHideValue = isZeroShare && hideZeroValue;
    const width = totalShare ? totalShare * 100 : 0;
    return (
        <TrafficShareContainer>
            <Text>
                {shouldHideValue ? "N/A" : percentageFilter()(totalShare, FractionLength) + "%"}
            </Text>
            {!shouldHideValue && (
                <ProgressCellContainer>
                    <ProgressBar width={width} />
                </ProgressCellContainer>
            )}
        </TrafficShareContainer>
    );
};

export default TrafficShare;
