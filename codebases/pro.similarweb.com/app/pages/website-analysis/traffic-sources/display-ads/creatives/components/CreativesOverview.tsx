import { i18nFilter } from "filters/ngFilters";
import { pureNumberFilter } from "filters/numberFilter";
import { FC } from "react";
import frameStates from "components/React/widgetFrames/frameStates";
import SimpleFrame from "components/React/widgetFrames/simpleFrame";
import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { ICreativesOverview } from "pages/website-analysis/traffic-sources/display-ads/common/displayAdsTypes";
import { IconButton } from "@similarweb/ui-components/dist/button";

const i18n = i18nFilter();

const StyledIconButton = styled(IconButton)`
    flex-shrink: 0;
`;

const Wrapper = styled.div`
    background: ${rgba(colorsPalettes.carbon[25], 0.5)};
    height: 80px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
    border-top: 1px solid ${colorsPalettes.carbon[50]};
    padding-left: 51px;
    justify-content: space-between;
    padding-right: 42px;
`;

const Item = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
    padding: 0;
    margin-right: 160px;
    @media (max-width: 1480px) {
        margin-right: 100px;
    }
    @media (max-width: 1280px) {
        margin-right: 80px;
    }
`;

const Number = styled.span`
    ${setFont({ $size: 20, $color: colorsPalettes.carbon[500] })}
`;

export const ItemsWrapper = styled.div`
    display: flex;
`;

const Text = styled.div`
    ${setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 0.6) })};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
`;

export const OnLoaded: React.FC<ICreativesOverview> = ({
    totalCampaigns,
    totalCreatives,
    totalPublishers,
    totalAdNetworks,
    isLoading,
    onExcelDownload,
    excelDownloading,
}) => {
    const items = [
        {
            key: "campaigns",
            value: totalCampaigns,
            i18nKey: "traffic.sources.creatives.overview.header.campaigns",
        },
        {
            key: "creatives",
            value: totalCreatives,
            i18nKey: "traffic.sources.creatives.overview.header.creatives",
        },
        {
            key: "publishers",
            value: totalPublishers,
            i18nKey: "traffic.sources.creatives.overview.header.publishers",
        },
        {
            key: "adNetworks",
            value: totalAdNetworks,
            i18nKey: "traffic.sources.creatives.overview.header.adnetworks",
        },
    ];

    const NumberComponent = (props) => {
        const { loading, children } = props;
        return loading ? (
            <PixelPlaceholderLoader width={70} height={20} />
        ) : (
            <Number>{children === 0 ? "N/A" : pureNumberFilter(children)}</Number>
        );
    };

    return (
        <Wrapper>
            <ItemsWrapper>
                {items.map((item, index) => (
                    <Item data-automation={item.key} key={index}>
                        <NumberComponent loading={isLoading}>{item.value}</NumberComponent>
                        <Text>{i18n(item.i18nKey)}</Text>
                    </Item>
                ))}
            </ItemsWrapper>
            <StyledIconButton
                type="flat"
                iconName="excel"
                onClick={onExcelDownload}
                isLoading={excelDownloading}
            />
        </Wrapper>
    );
};

export const CreativesOverview: FC<ICreativesOverview> = (props) => (
    <SimpleFrame state={frameStates.Loaded} onError={false} onLoaded={<OnLoaded {...props} />} />
);
