import { SWReactCountryIcons, SWReactIcons } from "@similarweb/icons";
import dayjs from "dayjs";
import React from "react";
import { commonWebSources } from "../../../../../app/components/filters-bar/utils";
import { ICountryObject } from "../../../../../app/services/CountryService";
import {
    CountryIconWithText,
    NewsBadgeCategory,
    NewsBadgeText,
} from "../RecommendationsSidebar/RecommendationsSidebar";
import { CardsBadgeLine, ChangeBadge, CountryBadge, NewsBadge, WebSourceBadge } from "./elements";
import { formatChange } from "./utils";

interface IFeedCardBadgesProps {
    country: ICountryObject;
    change: number;
    webSource: string;
}

export const FeedCardBadges = ({ country, change, webSource }: IFeedCardBadgesProps) => {
    const { text: webSourceText, icon: webSourceIcon } = commonWebSources[webSource]();
    return (
        <CardsBadgeLine>
            <CountryBadge>
                <SWReactCountryIcons countryCode={country.id} size={"xs"} />
                <CountryIconWithText>{country.text}</CountryIconWithText>
            </CountryBadge>
            <ChangeBadge change={change}>
                {Math.abs(change) > 0 && (
                    <SWReactIcons iconName={change > 0 ? "trend-up" : "trend-down"} size={"xs"} />
                )}
                <CountryIconWithText>{formatChange(change)}</CountryIconWithText>
            </ChangeBadge>
            <WebSourceBadge>
                <SWReactIcons iconName={webSourceIcon} size="xs" />
                <CountryIconWithText>{webSourceText}</CountryIconWithText>
            </WebSourceBadge>
        </CardsBadgeLine>
    );
};
export const NewsCardBadges = ({ site, category, publishDate }) => {
    return (
        <CardsBadgeLine>
            <NewsBadge>
                <SWReactIcons iconName={"daily-ranking"} size={"xs"} />
                <NewsBadgeText>{dayjs(publishDate).format("MMM, D YYYY")}</NewsBadgeText>
            </NewsBadge>
            {category && (
                <NewsBadge>
                    <SWReactIcons iconName={"category"} size={"xs"} />
                    <NewsBadgeCategory>{category}</NewsBadgeCategory>
                </NewsBadge>
            )}
        </CardsBadgeLine>
    );
};
