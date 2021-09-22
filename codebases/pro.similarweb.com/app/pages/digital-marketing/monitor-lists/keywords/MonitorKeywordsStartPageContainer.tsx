import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { getCountries } from "components/filters-bar/utils";
import { NT_SEARCH_MARKETING_PRODUCT_KEY } from "constants/ntProductKeys";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { MonitorKeywordsStartPage } from "pages/digital-marketing/monitor-lists/keywords/MonitorKeywordsStartPage";
import {
    getSharedGroupsWithOwnerName,
    IKeywordGroup,
    sortGroupsByCreationDate,
    ISharedKeywordGroup,
    trackSeeListClick,
} from "pages/digital-marketing/monitor-lists/utils";
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import CountryService from "services/CountryService";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { IAccountUser, SharingService } from "sharing/SharingService";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

interface IMonitorKeywordsStartPageContainerProps {}

const MonitorKeywordsStartPageContainer: FC<IMonitorKeywordsStartPageContainerProps> = (props) => {
    const services = useMemo(() => {
        return {
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            sharingService: SharingService,
            fetchService: DefaultFetchService.getInstance(),
            translate: i18nFilter(),
            trackWithGuid: TrackWithGuidService.trackWithGuid,
            durationService: DurationService,
            countryService: CountryService,
            swSettings: swSettings,
            keywordsGroupsService: keywordsGroupsService,
        };
    }, []);

    const [keywordGroups, setKeywordGroups] = useState<IKeywordGroup[]>([]);
    const [sharedKeywordGroups, setSharedKeywordGroups] = useState<ISharedKeywordGroup[]>([]);
    const [users, setUsers] = useState<IAccountUser[]>([]);
    const usersDefaultCountryRef = useRef();
    const hasGroupSharingPermissions = useRef(
        services.swSettings.components?.ProductClaims?.resources?.ProductKey !==
            NT_SEARCH_MARKETING_PRODUCT_KEY,
    );

    useEffect(() => {
        const availableCountries = getCountries();
        if (availableCountries && availableCountries.length > 0) {
            usersDefaultCountryRef.current = availableCountries[0]?.id;
        }
        setKeywordGroups(sortGroupsByCreationDate(keywordsGroupsService.userGroups));
        async function getSharedGroups() {
            const sharedGroups = keywordsGroupsService.getSharedGroups();
            const { users } = await SharingService.getAccountUsers();
            const groupsWithUser = getSharedGroupsWithOwnerName(sharedGroups, users);
            setSharedKeywordGroups(groupsWithUser);
            setUsers(users);
        }
        getSharedGroups();
    }, []);

    const onSeeGroupClick = (keywordGroup) => () => {
        trackSeeListClick(
            services.trackWithGuid,
            "keyword list",
            keywordGroup?.Name,
            keywordGroup?.Keywords?.length,
        );
        services.swNavigator.go("monitorkeywords", {
            keywordGroupId: keywordGroup.Id,
            duration: "3m",
            webSource: "Desktop",
            keywordsType: "both",
            isWWW: "*",
            country: usersDefaultCountryRef.current,
        });
    };

    const fetchTableData = useCallback((params) => {
        return services.fetchService.get(
            `/widgetApi/MonitorKeywordGroup/KeywordGroupTraffic/Table`,
            params,
        );
    }, []);

    return (
        <MonitorKeywordsStartPage
            keywordGroups={keywordGroups}
            sharedKeywordGroups={sharedKeywordGroups}
            users={users}
            onSeeGroupClick={onSeeGroupClick}
            fetchTableData={fetchTableData}
            service={services}
            keywordGroupsUpdater={setKeywordGroups}
            defaultCountry={usersDefaultCountryRef.current}
            hasGroupSharingPermissions={hasGroupSharingPermissions.current}
        />
    );
};

export default SWReactRootComponent(
    connect(null, null)(MonitorKeywordsStartPageContainer),
    "MonitorKeywordsStartPageContainer",
);
