import React from "react";
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
import { AdNetwork } from "../../types/adNetwork";
import { FEED_AD_NETWORKS_INFO_TOOLTIP } from "../../constants";
import AdNetworkDetails from "../AdNetworkDetails/AdNetworkDetails";

import feedTrackingService from "../../services/feedTrackingService";
type AdNetworkFeedListItemProps = {
    collapseIndex: number;
    isSingle: boolean;
    adNetworks: AdNetwork[];
    adNetworkWorldwide: AdNetwork;
    expandedIndex: number;
    setExpanded(a: number);
};
const AdNetworkFeedListItem: React.FC<AdNetworkFeedListItemProps> = (props) => {
    const translate = useTranslation();
    const {
        adNetworkWorldwide,
        adNetworks,
        isSingle,
        collapseIndex,
        expandedIndex,
        setExpanded,
    } = props;

    const [isCurrentExpanded, setisCurrentExpanded] = React.useState(false);
    const expandable = adNetworks?.length > 0;

    React.useEffect(() => {
        if (!(collapseIndex === expandedIndex) && isCurrentExpanded) {
            setisCurrentExpanded(false);
        }
    }, [expandedIndex]);

    const handleToggle = React.useCallback(() => {
        if (isSingle) {
            return;
        }
        if (expandable) {
            setisCurrentExpanded(!isCurrentExpanded);
            const expanded = collapseIndex === expandedIndex;
            setExpanded(collapseIndex);
            !expanded
                ? feedTrackingService.trackAdNetworkExpand(
                      collapseIndex + 1,
                      adNetworkWorldwide.name,
                  )
                : feedTrackingService.trackAdNetworkCollapse();
        }
    }, [collapseIndex, isSingle, adNetworkWorldwide, expandable, isCurrentExpanded]);

    const renderVisits = () => {
        if (!(isCurrentExpanded || (isSingle && expandable))) {
            return (
                <StyledAdNetworkVisits>
                    {abbrNumberFilter()(adNetworkWorldwide.visits)}
                </StyledAdNetworkVisits>
            );
        }
        return null;
    };

    return (
        <StyledAdNetworkListItem
            expanded={isCurrentExpanded}
            expandable={expandable}
            data-expanded={isCurrentExpanded}
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
                            iconName={isCurrentExpanded ? "chev-up" : "chev-down"}
                        />
                    )}
                    <StyledAdNetworkName>{adNetworkWorldwide.name}</StyledAdNetworkName>
                    {!expandable && (
                        <PlainTooltip
                            placement="top"
                            tooltipContent={translate(FEED_AD_NETWORKS_INFO_TOOLTIP)}
                        >
                            <StyledInfoIconContainer>
                                <SWReactIcons size="xs" iconName="info" />
                            </StyledInfoIconContainer>
                        </PlainTooltip>
                    )}
                </StyledAdNetworkNameContainer>
                {renderVisits()}
            </StyledAdNetworkItemInner>
            {expandable || isSingle ? (
                <Collapsible isActive={isCurrentExpanded || (isSingle && expandable)}>
                    <AdNetworkDetails adNetwork={adNetworkWorldwide} restAdNetworks={adNetworks} />
                </Collapsible>
            ) : (
                <></>
            )}
        </StyledAdNetworkListItem>
    );
};
export default React.memo(AdNetworkFeedListItem);
