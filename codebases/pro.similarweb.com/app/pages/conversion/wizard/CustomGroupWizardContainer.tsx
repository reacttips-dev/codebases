import React, { useState } from "react";
import { connect } from "react-redux";

import { fetchSegmentsdata } from "actions/conversionModuleActions";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import CountryService, { ICountryObject } from "services/CountryService";
import DurationService from "services/DurationService";
import { showErrorToast, showSuccessToast } from "../../../actions/toast_actions";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { i18nFilter } from "../../../filters/ngFilters";
import ConversionApiService from "../../../services/conversion/conversionApiService";
import { ISegmentsData } from "../../../services/conversion/ConversionSegmentsService";
import { allTrackers } from "../../../services/track/track";
import { ConversionSegmentsUtils } from "../ConversionSegmentsUtils";
import {
    CustomGroupWizard,
    IWizardCountries,
    IWizardCountry,
    IWizardMarkets,
} from "./CustomGroupWizard";

const DEFAULT_DURATION = "6m";
const DEFAULT_COUNTRY = "840";

declare const window;

export interface IStartupSegments {
    [id: string]: IStartupSegment;
}

export interface IStartupSegment {
    countries: number[];
    creationType: string;
    domain: string;
    id: string;
    isSingleLob: boolean;
    segmentName: string;
}

export interface ICountryHashData {
    [id: number]: ICountryObject;
}

export interface IStartupSegmentIndustry {
    id: string;
    name: string;
    groups: string[];
}

export interface IStartupSegmentGroups {
    [id: string]: {
        creationType: string;
        id: string;
        name: string;
        segments: string[];
    };
}

export interface ICustomGroupWizardContainerProps {
    params: { gid: string; country: string };
    segments: ISegmentsData;
    fetchSegments: () => void;
    showErrorToast: (text?: string) => void;
    showSuccessToast: (text?: string) => void;
}

/**
 * Collect available countries based on countries data and available under segments
 *
 * @param {IStartupSegments} segments
 * @param {ICountryHashData} countries
 *
 * @returns {ICountryData}
 */
function gatherAvailableCountries(
    segments: IStartupSegments,
    countries: ICountryHashData,
): IWizardCountries {
    return Object.keys(segments).reduce((result, segmentId: string) => {
        const segment = segments[segmentId];

        segment.countries.forEach((countryId) => {
            if (!result[countryId]) {
                result[countryId] = {
                    ...countries[countryId],
                    markets: [],
                };
            }
        });

        return result;
    }, {});
}

function gatherAvailableMarkets(
    segmentsData: ISegmentsData,
    allAvailableCountries: IWizardCountries,
) {
    // const industries: IStartupSegmentIndustry[] = segmentsData.segmentIndustries || [];
    const groups: IStartupSegmentGroups = segmentsData.segmentGroups || {};
    const toUppercaseFirstLetters = (str: string) => {
        return str
            .trim()
            .split(" ")
            .reduce((result, word) => {
                result += `${word.charAt(0).toUpperCase()}${word.slice(1)} `;

                return result;
            }, "")
            .trim();
    };
    const buildCountryData = (countries: IWizardCountry[]): IWizardCountries => {
        return countries.reduce((countriesAcc, { id, text }) => {
            countriesAcc = {
                ...countriesAcc,
                [id]: {
                    id,
                    text,
                },
            };

            return countriesAcc;
        }, {});
    };

    const result = {
        all: {
            text: i18nFilter()("conversion.wizard.markets.allMarketsLabel"),
            countries: allAvailableCountries,
            id: "all",
        },
    };

    Object.keys(groups).forEach((groupId) => {
        const name = groups[groupId].name || "";
        result[groupId] = {
            id: groupId,
            gid: groupId,
            creationType: groups[groupId].creationType,
            text: toUppercaseFirstLetters(name),
            countries: buildCountryData(
                ConversionSegmentsUtils.getSegmentGroupCountries(segmentsData, groupId),
            ),
        };
    });

    return result;
}

const onGroupConfirmCbCreator = (
    api,
    isEdit,
    fetchSegments,
    swNavigator,
    showErrorToast,
    showSuccessToast,
    state,
    setIsFetching,
) => async ({ name, segmentIds, groupId }) => {
    let response;
    setIsFetching(true);
    try {
        response = isEdit
            ? await api.updateSegmentGroup(groupId, name, segmentIds)
            : await api.createSegmentGroup(name, segmentIds);

        showSuccessToast(
            i18nFilter()(`conversion.wizard.toast.success.${isEdit ? "edit" : "create"}`),
        );
        fetchSegments();
        allTrackers.trackEvent(
            "Button",
            "Click",
            `${isEdit ? "Confirm edit" : "Confirm create"}/${response.segments.length}/${
                response.id
            }`,
        );
        window.setTimeout(() => {
            setIsFetching(false);
            swNavigator.go(
                "conversion-customgroup",
                {
                    gid: response.id,
                    country: DEFAULT_COUNTRY,
                    duration: DEFAULT_DURATION,
                },
                { reload: true },
            );
        }, 1500);
    } catch (e) {
        showErrorToast(i18nFilter()("conversion.wizard.toast.fail"));
        setIsFetching(false);
    }
};

// to add markets to countries
function enrichCountriesWithMarkets(
    countries: IWizardCountries,
    markets: IWizardMarkets,
): IWizardCountries {
    const result = { ...countries };

    Object.keys(markets).forEach((marketId) => {
        const marketData = markets[marketId];

        Object.keys(marketData.countries).forEach((countryId) => {
            result[countryId].markets.push(marketData.id);
        });
    });

    return result;
}

export const CustomGroupWizardContainer: React.FunctionComponent<ICustomGroupWizardContainerProps> = ({
    showErrorToast,
    showSuccessToast,
    fetchSegments,
    segments: segmentsData,
    params: { gid, country },
}) => {
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const state = swNavigator.current();
    const segments = segmentsData.segments || {};
    let countries = gatherAvailableCountries(segments, CountryService.countriesById);
    const markets = gatherAvailableMarkets(segmentsData, countries);
    countries = enrichCountriesWithMarkets(countries, markets);
    const { from, to } = DurationService.getDurationData("1m").forAPI;
    const pageFilters: any = {
        gid,
        country,
        from,
        to,
    };
    const api = new ConversionApiService();
    const isEdit = !!pageFilters.gid;
    const selectedGroup = isEdit
        ? ConversionSegmentsUtils.getSelectedGroupEnrichedWithSegmentsData(
              segmentsData,
              pageFilters.gid,
          )
        : undefined;
    const title = isEdit
        ? i18nFilter()("conversion.wizard.pageTitle.edit", {
              groupName: selectedGroup.name,
          })
        : i18nFilter()("conversion.wizard.pageTitle.create");
    const subtitle = i18nFilter()("conversion.wizard.pageSubtitle");
    const onGroupConfirm = onGroupConfirmCbCreator(
        api,
        isEdit,
        fetchSegments,
        swNavigator,
        showErrorToast,
        showSuccessToast,
        state,
        setIsFetching,
    );

    return (
        <CustomGroupWizard
            title={title}
            subtitle={subtitle}
            pageFilters={pageFilters}
            translate={i18nFilter()}
            selectedGroup={selectedGroup}
            markets={markets}
            countries={countries}
            segments={segments}
            segmentsData={segmentsData}
            trackingKey={state.trackingId.subSubSection}
            onConfirm={onGroupConfirm}
            isFetching={isFetching}
            track={allTrackers.trackEvent.bind(allTrackers)}
        />
    );
};

function mapStateToProps({ routing: { params }, conversionModule: { segments } }) {
    return {
        segments,
        params,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchSegments: () => dispatch(fetchSegmentsdata()),
        showErrorToast: (text?: string) => dispatch(showErrorToast(text)),
        showSuccessToast: (text?: string) => dispatch(showSuccessToast(text)),
    };
}

export default SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(CustomGroupWizardContainer),
    "CustomGroupWizardContainer",
);
