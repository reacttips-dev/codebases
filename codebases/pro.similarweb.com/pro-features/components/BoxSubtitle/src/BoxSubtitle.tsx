import { SWReactCountryIcons, SWReactIcons } from "@similarweb/icons";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import * as _ from "lodash";
import styled, { css } from "styled-components";
import { FlexRow } from "../../../styled components/StyledFlex/src/StyledFlex";
import StyledLink from "../../../styled components/StyledLink/src/StyledLink";
import { formatDate } from "../../../utils";
import CountryService from "services/CountryService";

export const IconItem: any = styled(FlexRow)`
    svg {
        position: relative;
        top: 2px;
        height: 16px; // fit to font-size height & width
        width: 16px;
        margin-right: 8px;
        margin-left: ${(props: any) => (props.first ? "0px" : "8px")};
    }
`;
IconItem.displayName = "IconItem";

export const DefaultItem: any = styled(FlexRow)`
    :before {
        content: "•";
        margin-right: 8px;
        margin-left: 8px;
    }
    ${(props: any) =>
        props.first &&
        css`
            :before {
                content: "";
                margin-right: 0px;
                margin-left: 0px;
            }
        `}
`;
DefaultItem.displayName = "DefaultItem";

export interface IBoxSubtitleProps {
    filters: any[];
    className?: string;
}

const US_COUNTRY_ID = 840;

const BoxSubtitle: StatelessComponent<IBoxSubtitleProps> = ({ className, filters }) => {
    const text = (value, href, target) =>
        href ? (
            <StyledLink href={href} target={target}>
                {value}
            </StyledLink>
        ) : (
            <span>{value}</span>
        );
    const webSourceDisplayName = (webSource) => {
        const displayNameKey = "websources." + webSource.toLowerCase();
        return i18nFilter()(displayNameKey);
    };
    const items = filters.map((item, idx) => {
        const isFirst = idx === 0;
        if (typeof item.getFilterValue === "function") {
            return item.getFilterValue({ filter: item, index: idx, isFirst, className, filters });
        }
        if (item.value) {
            if (item.filter === "lastDate") {
                return (
                    <IconItem key={idx} first={isFirst} onClick={item.onClick}>
                        <SWReactIcons iconName="daily-ranking" />
                        <span>{i18nFilter()("subtitle.last.update")}</span>&nbsp;
                        <span>{item.value}</span>
                    </IconItem>
                );
            }
            if (item.filter === "country") {
                const fixedCountryCode = CountryService.isUSState(item.countryCode)
                    ? US_COUNTRY_ID
                    : item.countryCode;
                return (
                    <IconItem key={idx} first={isFirst} onClick={item.onClick}>
                        <SWReactCountryIcons
                            countryCode={fixedCountryCode}
                            className="subtitle-country"
                        />
                        {text(item.value, item.href, item.target)}
                    </IconItem>
                );
            }
            if (item.filter === "icon") {
                return (
                    <IconItem key={idx} first={isFirst} onClick={item.onClick}>
                        <SWReactIcons iconName={item.iconName} className="subtitle-icon" />
                        {text(item.value, item.href, item.target)}
                    </IconItem>
                );
            } else if (item.filter === "date") {
                return (
                    <DefaultItem key={idx} first={isFirst} onClick={item.onClick}>
                        <IconItem first={true}>
                            <SWReactIcons iconName="daily-ranking" className="subtitle-icon" />
                            {formatDate(
                                item.value.from,
                                item.value.to,
                                item.format,
                                item.value?.useRangeDisplay,
                            )}
                        </IconItem>
                    </DefaultItem>
                );
            } else if (item.filter === "store") {
                const iconName = item.value === "Google" ? "google-play" : "i-tunes";
                const store = item.value === "Google" ? "Google Play" : "Apple";
                return (
                    <IconItem key={idx} first={isFirst} onClick={item.onClick}>
                        <SWReactIcons iconName={iconName} className="subtitle-store" />
                        {text(store, item.href, item.target)}
                    </IconItem>
                );
            } else if (item.filter === "webSource") {
                const icon = item.value === "Total" ? "combined" : item.value;
                const iconName = _.kebabCase(icon);
                const value = item.displayName
                    ? item.displayName
                    : webSourceDisplayName(item.value);
                return (
                    <IconItem key={idx} first={isFirst} onClick={item.onClick}>
                        <SWReactIcons iconName={iconName} className="subtitle-websource" />
                        {text(value, item.href, item.target)}
                    </IconItem>
                );
            } else {
                if (typeof item.value === "function") {
                    return <item.value key={idx} first={isFirst} />;
                }
                return (
                    <DefaultItem key={idx} first={isFirst} onClick={item.onClick}>
                        {text(item.value, item.href, item.target)}
                    </DefaultItem>
                );
            }
        }
    });

    return <FlexRow className={className}>{items}</FlexRow>;
};
BoxSubtitle.displayName = "BoxSubtitle";
export default BoxSubtitle;
