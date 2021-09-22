import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { ChangeValue } from "@similarweb/ui-components/dist/change-value";
import { i18nFilter } from "filters/ngFilters";
import * as numeral from "numeral";
import * as React from "react";
import styled from "styled-components";

export const AudienceInterestsOverlapTableTooltipStyled = styled.div`
    ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
`;

export const AudienceInterestsOverlapTableTooltipStyledTitle = styled.div`
    margin-bottom: 12px;
`;
export const AudienceInterestsOverlapTableTooltipStyledValues = styled.div`
    display: flex;
    & > div:first-child {
        margin-right: 12px;
    }
`;
export const AudienceInterestsOverlapTableTooltipStyledValue = styled.div`
    ${mixins.setFont({ $size: 20 })};
    line-height: 1.2;
`;
export const AudienceInterestsOverlapTableTooltipStyledChange = styled.div`
    .ChangeValue {
        ${mixins.setFont({ $size: 20 })};
    }
`;
export const AudienceInterestsOverlapTableTooltipFooter = styled.div`
    ${mixins.setFont({ $size: 10, $color: rgba(colorsPalettes.carbon[500], 0.6) })};
`;
const formatPercent = (value) => numeral(value).format("0.00%");

export const AudienceInterestsOverlapTableTooltip = ({
    valueHorizontal,
    valueVertical,
    value,
    changeValue,
}) => {
    const i18n = i18nFilter();
    const changeValueProps = {
        descriptionText: "",
    } as any;
    if (changeValue < 0.01 && changeValue > -0.01) {
        changeValueProps.unsigned = true;
        changeValueProps.value = "--";
    } else {
        changeValueProps.value = formatPercent(changeValue);
        changeValueProps.isDecrease = changeValue < 0;
    }
    return (
        <AudienceInterestsOverlapTableTooltipStyled>
            <AudienceInterestsOverlapTableTooltipStyledTitle
                dangerouslySetInnerHTML={{
                    __html: i18n("analysis.audience.interests.overlap.table.tootlip.title", {
                        valueHorizontal,
                        valueVertical,
                    }),
                }}
            />
            <AudienceInterestsOverlapTableTooltipStyledValues>
                <div>
                    <AudienceInterestsOverlapTableTooltipStyledValue>
                        {formatPercent(value)}
                    </AudienceInterestsOverlapTableTooltipStyledValue>
                    <AudienceInterestsOverlapTableTooltipFooter>
                        {i18n("analysis.audience.interests.overlap.table.tootlip.overlap")}
                    </AudienceInterestsOverlapTableTooltipFooter>
                </div>
                {changeValue && (
                    <div>
                        <AudienceInterestsOverlapTableTooltipStyledChange>
                            <ChangeValue {...changeValueProps} />
                        </AudienceInterestsOverlapTableTooltipStyledChange>
                        <AudienceInterestsOverlapTableTooltipFooter>
                            {i18n("analysis.audience.interests.overlap.table.tootlip.change")}
                        </AudienceInterestsOverlapTableTooltipFooter>
                    </div>
                )}
            </AudienceInterestsOverlapTableTooltipStyledValues>
        </AudienceInterestsOverlapTableTooltipStyled>
    );
};
