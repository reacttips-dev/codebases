import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { setFont } from "@similarweb/styles/src/mixins";
import { colorsPalettes, rgba } from "@similarweb/styles";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter, percentageFilter } from "filters/ngFilters";
import React from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import styled from "styled-components";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const Text = styled.label<{ marginRight?: string }>`
    display: inline-block;
    margin-right: 6px;
    overflow: hidden;
    margin-top: auto;
    margin-bottom: auto;
    white-space: nowrap;
    cursor: inherit;
    width: fit-content;
    ${({ marginRight }) => marginRight && `margin-right:${marginRight};`};
    ${setFont({ $size: 16, $color: rgba(colorsPalettes.carbon[500], 0.8) })}
`;

const FlexBox = styled.div`
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
`;

const InfoIconContainer = styled.div`
    margin-top: "1px";
`;

const Circle = styled.span`
    border-radius: 50%;
    text-align: center;
    margin-top: inherit;
    margin-right: 5px;
    width: 10px;
    height: 10px;
    ${({ color }) => `background-color:${color};`};
`;

const OrganicSearchZeroClicksContainer = styled.div<{ visibilityValue: string }>`
    ${({ visibilityValue }) => `visibility:${visibilityValue};`};
    margin-bottom: 46px;
`;

const InfoTooltip: React.FunctionComponent<{ infoText: string }> = ({ infoText }) => {
    return (
        <PlainTooltip tooltipContent={infoText}>
            <InfoIconContainer>
                <SWReactIcons iconName="info" size="xs" />
            </InfoIconContainer>
        </PlainTooltip>
    );
};

interface IOrganicSearchZeroClicksProps {
    text: string;
    value: string;
    toolTipInfoText?: string;
    bulletColor?: string;
}

const OrganicSearchZeroClicksInner: React.FunctionComponent<IOrganicSearchZeroClicksProps> = ({
    text,
    value,
    toolTipInfoText,
    bulletColor,
}) => {
    return (
        <FlexBox>
            <FlexBox>
                {bulletColor && <Circle color={bulletColor} />}
                <Text data-automation-text>{text}</Text>
                {toolTipInfoText && (
                    <>
                        <InfoTooltip infoText={toolTipInfoText} />
                    </>
                )}
            </FlexBox>
            <Text data-automation-value>{value}</Text>
        </FlexBox>
    );
};

const isGroupContext = (keys) => typeof keys !== "undefined" && keys.substring(0, 1) === "*";

export const getZeroClickRatio = (queryParams) => {
    const apiParams = queryParams;
    const fetchService = DefaultFetchService.getInstance();
    // if it's a group context
    if (isGroupContext(queryParams.keys)) {
        const groupId = queryParams.keys.substring(1);
        const groupHash = keywordsGroupsService.userGroups.find((group) => group.Id === groupId)
            ?.GroupHash;
        apiParams.groupHash = groupHash;
    } else {
        delete apiParams.groupHash;
    }
    return fetchService.get(
        `widgetApi/KeywordAnalysisOP/KeywordAnalysisGroupOrganic/SingleMetric`,
        apiParams,
    );
};

const getZeroClicksValue = (val) => (val === 0 || val === 100 ? "N/A" : val + "%");

export const OrganicSearchZeroClicks = ({ params, zeroClickRatio }) => {
    const i18n = i18nFilter();
    const percentageFormatter = percentageFilter();
    const zeroClicksValue = percentageFormatter(zeroClickRatio, 0);
    const zeroClickText = i18n("keyword.analysis.organic.search.volume.zero.click");
    const zeroClickTooltip = i18n("keyword.analysis.organic.search.volume.zero.click.tooltip.info");

    const organicSearchItems = (
        <OrganicSearchZeroClicksContainer
            visibilityValue={zeroClickRatio === undefined ? "hidden" : "visible"}
        >
            <OrganicSearchZeroClicksInner
                toolTipInfoText={zeroClickTooltip}
                text={zeroClickText}
                value={getZeroClicksValue(parseInt(zeroClicksValue, 10))}
            />
        </OrganicSearchZeroClicksContainer>
    );
    return organicSearchItems;
};
export const OrganicSearchZeroClicksPlaceholder = styled.div`
    height: 60px;
`;
export const OrganicDataRows = ({ items }) => {
    const rows = items.map((item, index) => (
        <OrganicSearchZeroClicksInner
            key={index}
            text={item.text}
            value={item.value}
            bulletColor={item.color}
        />
    ));
    return <>{rows}</>;
};

const mapStateToProps = (state, ownProps) => {
    const {
        routing: { params },
    } = state;
    return {
        params: {
            ...params,
            ...ownProps,
        },
    };
};
const OrganicSearchZeroClicksDal = ({ params }) => {
    const [zeroClickRatio, setZeroClickRatio] = React.useState(undefined);
    const { duration, timeGranularity = "Monthly", country, includeSubDomains = true } = params;
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const keys = params.keyword.startsWith("*") ? params.keyword.substring(1) : params.keyword;
    const apiParams = {
        duration,
        timeGranularity,
        country,
        includeSubDomains,
        from,
        to,
        isWindow,
        keys,
        groupHash: undefined,
    };
    React.useEffect(() => {
        getZeroClickRatio(apiParams).then(({ Data }) => setZeroClickRatio(Object.values(Data)));
    }, []);
    return <OrganicSearchZeroClicks params={params} zeroClickRatio={zeroClickRatio} />;
};

export const OrganicSearchZeroClicksConnected = connect(
    mapStateToProps,
    null,
)(OrganicSearchZeroClicksDal);
SWReactRootComponent(OrganicSearchZeroClicksConnected, "OrganicSearchZeroClicks");
