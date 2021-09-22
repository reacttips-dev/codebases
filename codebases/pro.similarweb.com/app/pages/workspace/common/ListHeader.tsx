import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { Title } from "@similarweb/ui-components/dist/title";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { allTrackers } from "services/track/track";
import styled from "styled-components";
import { FlexRow } from "../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { CountryFilter } from "../../../components/filters-bar/country-filter/CountryFilter";
import { commonWebSources } from "../../../components/filters-bar/utils";
import { IOpportunityListItem } from "./types";
import { hasMobileWeb } from "./workspacesUtils";
export interface IListHeaderProps {
    activeList: IOpportunityListItem;
    lastSnapshotDate: Dayjs;
    countries: any[];

    onCountryChange(country);

    onClick();
}

const Container = styled.div`
    ${Title} {
        display: flex;
        align-items: center;
        button {
            margin-left: 5px;
        }
    }
`;

const Subtitle = styled.div`
    font-size: 14px;
    color: ${colorsPalettes.carbon["500"]};
    font-weight: 400;
    && svg {
        width: 16px;
        height: 16px;
    }
`;

const ListTitle = styled(Title)`
    margin-bottom: 14px;
    display: flex;
    align-items: center;
`;

export const MarketingWorkspaceFilterWrapper = styled.div`
    height: 40px;
    border: 1px #eceef0 solid;
    .CountryFilter-dropdownButton,
    .DropdownButton-text,
    .WebSourceFilter-dropdownButton {
        font-size: 14px;
        color: ${colorsPalettes.carbon["500"]};
        font-weight: 400;
    }
    margin-right: 8px;
`;

const WebsourceLabel = styled(FlexRow)`
    width: 150px;
    height: 40px;
    box-sizing: border-box;
    padding: 9px 0;
    align-items: center;
    margin-left: 17px;
    user-select: none;
`;
const Text = styled.span``;

const Icon = styled(SWReactIcons)`
    display: flex;
    margin-right: 13px;
`;

const DateLabel = styled(WebsourceLabel)`
    width: 172px;
    height: 40px;
`;
const Name = styled.span`
    margin-right: 8px;
`;

const Header: React.FunctionComponent<IListHeaderProps> = ({
    activeList,
    lastSnapshotDate,
    onClick,
    onCountryChange,
    countries,
}) => {
    let { country } = activeList;
    if (!countries.some((c) => c.id === country)) {
        country = countries[0].id;
    }
    const { [hasMobileWeb(country) ? "total" : "desktop"]: webSourceFn } = commonWebSources;
    const { icon, text } = webSourceFn();
    const onToggle = (isOpen) => {
        allTrackers.trackEvent("Drop down", isOpen ? "Open" : "Close", "Header/Country Filter");
    };
    const onChange = (country) => {
        allTrackers.trackEvent(
            "Drop down",
            "Click",
            `Header/Country Filter/${country?.children || ""}`,
        );
        onCountryChange(country);
    };
    return (
        !!activeList && (
            <Container>
                <ListTitle>
                    <Name>{activeList.friendlyName}</Name>
                    <IconButton
                        onClick={onClick}
                        type="flat"
                        iconName="settings"
                        dataAutomation="list-header-settings-button"
                    />
                </ListTitle>
                <Subtitle>
                    <FlexRow>
                        <MarketingWorkspaceFilterWrapper>
                            <CountryFilter
                                height={40}
                                availableCountries={countries}
                                changeCountry={onChange}
                                onToggle={onToggle}
                                selectedCountryIds={{
                                    [country]: true,
                                }}
                                dropdownPopupPlacement="ontop-left"
                            />
                        </MarketingWorkspaceFilterWrapper>
                        <MarketingWorkspaceFilterWrapper>
                            <WebsourceLabel>
                                <Icon iconName={icon} />
                                <Text>{text}</Text>
                            </WebsourceLabel>
                        </MarketingWorkspaceFilterWrapper>
                        <MarketingWorkspaceFilterWrapper>
                            <DateLabel>
                                <Icon iconName={"daily-ranking"} />
                                <Text>{dayjs.utc(lastSnapshotDate).format("MMMM YYYY")}</Text>
                            </DateLabel>
                        </MarketingWorkspaceFilterWrapper>
                    </FlexRow>
                </Subtitle>
            </Container>
        )
    );
};
export const ListHeader = Header;
