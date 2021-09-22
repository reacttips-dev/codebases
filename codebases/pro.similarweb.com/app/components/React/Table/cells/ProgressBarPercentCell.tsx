import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { ProgressBar } from "components/React/ProgressBar";
import { percentageFilter } from "filters/ngFilters";
import { Text } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import styled from "styled-components";

const NA = "N/A";

const ProgressBarWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: end;
`;

const ProgressContainer = styled(Text)`
    width: 100%;
    ${setFont({ $size: 13, $color: rgba(colorsPalettes.carbon[500], 0.8) })};
`;

const TextValue = styled.span`
    display: inline-block;
    min-width: 36px;
`;

export const ProgressBarPercentCell = ({ value }: { value: number }) => {
    const width = value ? value * 100 : 0;
    const valuePercents = value ? percentageFilter()(value || 0, 0) + "%" : NA;
    return (
        <ProgressBarWrapper>
            <ProgressContainer>
                <div className="swTable-progressBar">
                    <TextValue>{valuePercents}</TextValue>
                    <div className="u-full-width">
                        {valuePercents !== NA && <ProgressBar width={width} />}
                    </div>
                </div>
            </ProgressContainer>
        </ProgressBarWrapper>
    );
};
