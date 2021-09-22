import { IRootScopeService } from "angular";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { getCountries } from "components/filters-bar/utils";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { MonitorPartnersStartPage } from "pages/digital-marketing/monitor-lists/partners/MonitorPartnersStartPage";
import {
    getPartnerTypeLists,
    IPartnerList,
    ListsType,
    removeUnnecessaryFieldsFromGroups,
    sortGroupsByCreationDate,
    trackSeeListClick,
} from "pages/digital-marketing/monitor-lists/utils";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import CountryService from "services/CountryService";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import categoryService from "common/services/categoryService";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";

const MonitorPartnersStartPageContainer: FC = () => {
    const services = useMemo(() => {
        return {
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            categoryService,
            fetchService: DefaultFetchService.getInstance(),
            translate: i18nFilter(),
            trackWithGuid: TrackWithGuidService.trackWithGuid,
            durationService: DurationService,
            countryService: CountryService,
            swSettings: swSettings,
            rootScope: Injector.get<IRootScopeService>("$rootScope"),
            modalService: Injector.get<any>("$modal"),
        };
    }, []);

    const [partnerLists, setPartnerLists] = useState<IPartnerList[]>(
        sortGroupsByCreationDate(
            removeUnnecessaryFieldsFromGroups(
                getPartnerTypeLists(UserCustomCategoryService.getCustomCategoriesRecords()),
                ListsType.PARTNERS,
            ),
        ),
    );
    const [defaultCountry, setDefaultCountry] = useState(null);

    useEffect(() => {
        const availableCountries = getCountries();
        if (availableCountries && availableCountries.length > 0) {
            setDefaultCountry(availableCountries[0].id);
        }
    }, []);

    const onSeeGroupClick = (partnerList) => () => {
        trackSeeListClick(
            services.trackWithGuid,
            "partner list",
            partnerList?.Name,
            partnerList?.Domains?.length,
        );
        services.swNavigator.go("monitorpartners", {
            partnerListId: partnerList.Id,
            duration: "3m",
            webSource: "Desktop",
            keywordsType: "both",
            isWWW: "*",
            country: defaultCountry,
        });
    };

    const fetchTableData = useCallback(
        (partnerListId: string, params) => {
            return services.fetchService.get(
                `api/MonitorPartnerList/${partnerListId}/table`,
                params,
            );
        },
        [services],
    );

    return (
        defaultCountry && (
            <MonitorPartnersStartPage
                partnerLists={partnerLists}
                onSeeGroupClick={onSeeGroupClick}
                fetchTableData={fetchTableData}
                service={services}
                partnerListsUpdater={setPartnerLists}
                defaultCountry={defaultCountry}
            />
        )
    );
};

export default SWReactRootComponent(
    connect(null, null)(MonitorPartnersStartPageContainer),
    "MonitorPartnersStartPageContainer",
);
