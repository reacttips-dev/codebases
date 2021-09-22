import React from "react";
import classNames from "classnames";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import { compose } from "redux";
import {
    sortAdNetworksByVisits,
    getWorldwideAdNetworks,
    groupByName,
    deleteWorldWide,
} from "../../helpers";
import {
    FEED_AD_NETWORKS_NAME_COLUMN,
    FEED_AD_NETWORKS_GLOBAL_VISITS_COLUMN,
    ABOUT_AD_NETWORKS_TITLE,
    ABOUT_AD_NETWORKS_TAB1,
    ABOUT_AD_NETWORKS_TAB2,
    FEED_AD_NETWORKS_INFO_TOOLTIP,
} from "../../constants";
import {
    StyledAdNetworksListContainer,
    StyledAdNetworksListHead,
    StyledAdNetworksListBody,
    StyledAdNetworkColumnTitle,
    StyledAdNetworkFeedContainer,
} from "./styles";
import { StyledFeedTitle } from "../styles";
import { useTranslation } from "components/WithTranslation/src/I18n";
import AdNetworkFeedListItem from "../AdNetworkFeedListItem/AdNetworkFeedListItem";
import { Tab, TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import { TopGeoSubtitle, Icon } from "../AboutCards/styles";
import { TittleContainer } from "./styles";
import { getFormattedLastSnapshotDate } from "../../../../helpers";
import { AdTabs } from "../AboutCards/consts";
import { AdNetworkFeedProps, AdNetwork } from "../../types/adNetwork";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import AdNetworkFeedEmptyState from "pages/workspace/sales/sub-modules/feed/components/AdNetworkFeed/AdNetworkFeedEmptyState";

const AdNetworkFeed = ({ feed }: AdNetworkFeedProps): JSX.Element => {
    const translate = useTranslation();

    const salesSettings = useSalesSettingsHelper();

    const lastSnapshotDate = salesSettings.getLastSnapshotDate();

    const [currentTabIdx, setCurrentTabIdx] = React.useState<number>(0);
    const [expanded, setExpanded] = React.useState<number>(null);

    const tabClickHandler = (index: number): void => setCurrentTabIdx(index);

    const onlyOneWorldwideNetwork = feed[AdTabs[currentTabIdx]]?.length <= 2;

    const sortedWorldwideNetworks = (items) => {
        return compose(sortAdNetworksByVisits, getWorldwideAdNetworks)(items);
    };

    const renderAdItems = (adItems: AdNetwork[]) => {
        if (Array.isArray(adItems) && adItems.length) {
            const preparedNetworks = sortedWorldwideNetworks(adItems);
            const groupedFeed = compose(
                groupByName,
                sortAdNetworksByVisits,
                deleteWorldWide,
            )(adItems);
            return (
                <>
                    <StyledAdNetworksListHead>
                        <StyledAdNetworkColumnTitle>
                            {translate(FEED_AD_NETWORKS_NAME_COLUMN)}
                        </StyledAdNetworkColumnTitle>
                        <StyledAdNetworkColumnTitle>
                            {translate(FEED_AD_NETWORKS_GLOBAL_VISITS_COLUMN)}
                        </StyledAdNetworkColumnTitle>
                    </StyledAdNetworksListHead>
                    {preparedNetworks.map((adNetworkItem: AdNetwork, idx: number) => (
                        <AdNetworkFeedListItem
                            key={idx}
                            collapseIndex={idx}
                            adNetworkWorldwide={adNetworkItem}
                            adNetworks={groupedFeed[adNetworkItem?.name]}
                            isSingle={onlyOneWorldwideNetwork}
                            setExpanded={setExpanded}
                            expandedIndex={expanded}
                        />
                    ))}
                </>
            );
        }
        return <AdNetworkFeedEmptyState currentTabIdx={currentTabIdx} />;
    };

    const renderTabBody = () => (
        <>
            <TabPanel>{renderAdItems(feed[AdTabs[currentTabIdx]])}</TabPanel>
            <TabPanel>{renderAdItems(feed[AdTabs[currentTabIdx]])}</TabPanel>
        </>
    );

    return (
        <StyledAdNetworkFeedContainer data-automation="feed-type-ad-networks">
            <StyledFeedTitle>
                <TittleContainer>
                    <div>{translate(ABOUT_AD_NETWORKS_TITLE)}</div>
                    <PlainTooltip
                        placement="top"
                        tooltipContent={translate(FEED_AD_NETWORKS_INFO_TOOLTIP)}
                    >
                        <div>
                            <InfoIcon iconName="info" />
                        </div>
                    </PlainTooltip>
                </TittleContainer>
                <TopGeoSubtitle>
                    <Icon iconName={"daily-ranking"} size={"xs"} />
                    <span>{getFormattedLastSnapshotDate(lastSnapshotDate)}</span>
                </TopGeoSubtitle>
            </StyledFeedTitle>
            <StyledAdNetworksListContainer>
                <StyledAdNetworksListBody>
                    <Tabs selectedIndex={currentTabIdx} onSelect={tabClickHandler}>
                        <TabList>
                            <Tab>{translate(ABOUT_AD_NETWORKS_TAB1)}</Tab>
                            <Tab>{translate(ABOUT_AD_NETWORKS_TAB2)}</Tab>
                        </TabList>
                        {renderTabBody()}
                    </Tabs>
                </StyledAdNetworksListBody>
            </StyledAdNetworksListContainer>
        </StyledAdNetworkFeedContainer>
    );
};

export default React.memo(AdNetworkFeed);
