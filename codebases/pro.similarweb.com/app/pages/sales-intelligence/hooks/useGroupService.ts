import React, { useEffect, useMemo, useState } from "react";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import { sortGroupsKeywords } from "../pages/find-leads/components/utils";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const useGroupService = () => {
    const [keywordGroups, setKeywordGroups] = useState([]);

    const services = useMemo(() => {
        return {
            swNavigator: Injector.get<any>("swNavigator"),
            keywordsGroupsService: keywordsGroupsService,
            i18n: i18nFilter(),
        };
    }, []);

    useEffect(() => {
        setKeywordGroups(services.keywordsGroupsService.userGroups.sort(sortGroupsKeywords));
    }, [services.keywordsGroupsService.userGroups]);

    const replaceGroup = (currentGroupIndex, modifiedGroup) => {
        const firstHalfWithoutGroup = keywordGroups.slice(0, currentGroupIndex);
        const secondHalfWithoutGroup = keywordGroups.slice(currentGroupIndex + 1);
        setKeywordGroups([...firstHalfWithoutGroup, modifiedGroup, ...secondHalfWithoutGroup]);
    };

    const mergeNewGroupIntoList = (newGroup) => {
        const groupsSortedByName = [...keywordGroups.map((group) => group), newGroup].sort(
            sortGroupsKeywords,
        );
        setKeywordGroups(groupsSortedByName);
    };

    const sharedGroupServices = () => {
        return services.keywordsGroupsService.getSharedGroups();
    };

    return {
        services,
        keywordGroups,
        replaceGroup,
        mergeNewGroupIntoList,
        sharedGroupServices,
    };
};

export default useGroupService;
