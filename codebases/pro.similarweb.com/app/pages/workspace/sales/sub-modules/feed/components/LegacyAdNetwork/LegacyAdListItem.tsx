import React from "react";
import { compose } from "redux";
import classNames from "classnames";
import { SWReactIcons } from "@similarweb/icons";
import { Collapsible } from "@similarweb/ui-components/dist/collapsible";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { abbrNumberFilter } from "filters/ngFilters";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    StyledAdNetworkListItem,
    StyledAdNetworkName,
    StyledAdNetworkNameContainer,
    StyledAdNetworkVisits,
    StyledAdNetworkItemInner,
    StyledInfoIconContainer,
} from "./styles";
import {
    sortAdNetworksByVisits,
    getAdNetworksMatchingId,
    getAllButWorldwideAdNetworks,
} from "../../helpers";
import { AdNetwork } from "../../types/adNetwork";
import { FEED_AD_NETWORKS_INFO_TOOLTIP } from "../../constants";
import AdNetworkDetails from "./AdNetworkDetails";
import feedTrackingService from "../../services/feedTrackingService";

type AdNetworkFeedListItemProps = {
    index: number;
    expanded: boolean;
    isSingle: boolean;
    adNetworks: AdNetwork[];
    adNetworkWorldwide: AdNetwork;
    onToggle(id: AdNetwork["id"] | null): void;
};

const AdNetworkFeedListItem: React.FC<AdNetworkFeedListItemProps> = (props) => {
    const t = useTranslation();
    const { adNetworkWorldwide, adNetworks, expanded, isSingle, index, onToggle } = props;

    /**
     * Find and sort all ad networks with the same id excluding worldwide
     */
    const restAdNetworks = React.useMemo(() => {
        const adNetworksMatchingId = compose(
            getAdNetworksMatchingId,
            getAllButWorldwideAdNetworks,
        )(adNetworks)(adNetworkWorldwide.id);

        return sortAdNetworksByVisits(adNetworksMatchingId);
    }, [adNetworkWorldwide, adNetworks]);

    const expandable = restAdNetworks.length > 0;

    const handleToggle = React.useCallback(() => {
        if (isSingle) {
            return;
        }

        if (expandable) {
            if (expanded) {
                onToggle(null);
                feedTrackingService.trackAdNetworkCollapse();
            } else {
                onToggle(adNetworkWorldwide.id);
                feedTrackingService.trackAdNetworkExpand(index + 1, adNetworkWorldwide.name);
            }
        }
    }, [onToggle, index, isSingle, adNetworkWorldwide, expanded, expandable]);

    function renderContent() {
        if (expandable || isSingle) {
            return (
                <Collapsible isActive={expanded || (isSingle && expandable)}>
                    <AdNetworkDetails
                        adNetwork={adNetworkWorldwide}
                        restAdNetworks={restAdNetworks}
                    />
                </Collapsible>
            );
        }

        return null;
    }

    return (
        <StyledAdNetworkListItem
            expanded={expanded}
            expandable={expandable}
            data-expanded={expanded}
            data-automation="ad-network-item-global"
            className={classNames({
                "single-item": isSingle && expandable,
                "single-not-expandable": isSingle && !expandable,
            })}
        >
            <StyledAdNetworkItemInner onClick={handleToggle}>
                <StyledAdNetworkNameContainer>
                    {!isSingle && (
                        <SWReactIcons
                            size="sm"
                            className="toggle-icon"
                            iconName={expanded ? "chev-up" : "chev-down"}
                        />
                    )}
                    <StyledAdNetworkName>{adNetworkWorldwide.name}</StyledAdNetworkName>
                    {!expandable && (
                        <PlainTooltip
                            placement="top"
                            tooltipContent={t(FEED_AD_NETWORKS_INFO_TOOLTIP)}
                        >
                            <StyledInfoIconContainer>
                                <SWReactIcons size="xs" iconName="info" />
                            </StyledInfoIconContainer>
                        </PlainTooltip>
                    )}
                </StyledAdNetworkNameContainer>
                {!(expanded || (isSingle && expandable)) && (
                    <StyledAdNetworkVisits>
                        {abbrNumberFilter()(adNetworkWorldwide.visits)}
                    </StyledAdNetworkVisits>
                )}
            </StyledAdNetworkItemInner>
            {renderContent()}
        </StyledAdNetworkListItem>
    );
};

export default React.memo(AdNetworkFeedListItem);
