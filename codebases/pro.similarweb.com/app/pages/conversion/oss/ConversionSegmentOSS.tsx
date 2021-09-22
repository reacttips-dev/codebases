import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import { StyledHeaderTitle } from "pages/conversion/components/benchmarkOvertime/StyledComponents";
import { BoxContainer } from "pages/conversion/components/ConversionScatterChart/StyledComponents";
import { ConversionSegmentOSSTableTop } from "pages/conversion/oss/ConversionSegmentOSSTableTop/ConversionSegmentOSSTableTop";
import { ConversionSegmentsOssTableConfigGen } from "pages/conversion/oss/ConversionSegmentsOssTableColumnGenerator";
import { NoDataLabIcon } from "pages/keyword-analysis/geo/Components/KeywordsGeoEmptyState";
import { FunctionComponent } from "react";
import * as React from "react";
import { useState } from "react";
import ConversionApiService, {
    CONVERSION_OSS_API,
    SegementOSSTableData,
} from "services/conversion/conversionApiService";
import CountryService from "services/CountryService";
import DurationService from "services/DurationService";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { ExcelButton } from "components/React/ExcelButton/ExcelButton";
import {
    OssEmptyStateContainer,
    FlexContainerCentered,
    PrimaryText,
    SecondaryText,
    StyledLink,
    StyledTitleContainer,
    StyledTitleTextContainer,
} from "./ConversionSegmentOSSStyles";
import {
    IConversionSegmentOSS,
    IOssTableSelectedFilters,
    IOssTableSelectedWordCount,
} from "./ConversionSegmentOSSTypes";

const apiService = new ConversionApiService();

export const WebsiteSegmentEmptyState = (props) => {
    const { primaryText, secondaryText, children } = props;
    return (
        <OssEmptyStateContainer>
            <FlexContainerCentered>
                <NoDataLabIcon />
            </FlexContainerCentered>
            <PrimaryText>{i18nFilter()(primaryText)}</PrimaryText>
            {secondaryText && <SecondaryText>{i18nFilter()(secondaryText)}</SecondaryText>}
            {children}
        </OssEmptyStateContainer>
    );
};

export const ConversionSegmentOSS: FunctionComponent<IConversionSegmentOSS> = (props) => {
    const { pageFilters, ossSupportedCountries } = props;
    const swNavigator = Injector.get<any>("swNavigator");
    const { duration, tab } = swNavigator.getParams();
    const durationData = DurationService.getDurationData(
        duration,
        pageFilters.comparedDuration,
        swSettings.current.componentId,
    );

    const initialTableParams = {
        ...pageFilters,
        comparedDuration: undefined,
        compareFrom: durationData.forAPI.compareFrom,
        compareTo: durationData.forAPI.compareTo,
        pageSize: 100,
    };
    const subtitleFilters = [
        {
            filter: "date",
            value: {
                from: pageFilters.from,
                to: pageFilters.to,
            },
        },
        {
            filter: "webSource",
            value: "Desktop",
        },
    ];
    const [sortByCol, setSortByCol] = useState({ sortbyField: "Upv", sortDirection: "desc" });
    const [tableColumns, setTableColumns] = useState(
        ConversionSegmentsOssTableConfigGen(sortByCol, pageFilters.comparedDuration),
    );
    const [availableWordCount, setAvailableWordCount] = useState([]);
    const [ossTableSelectedFilters, setOssTableSelectedFilters] = useState<
        IOssTableSelectedFilters
    >();
    const [ossTableSelectedWordCount, setOssTableSelectedWordCount] = useState<
        IOssTableSelectedWordCount
    >();

    const updateOssTableFilters = (selectedFilters?: IOssTableSelectedFilters) => {
        setOssTableSelectedFilters(selectedFilters);
    };

    const updateOssTableWordCount = (wordsCount?: IOssTableSelectedWordCount) => {
        setOssTableSelectedWordCount(wordsCount);
    };

    const isHighConfidence = (num) => {
        if (num) {
            return num > 0 && num < 1;
        }
        return false;
    };

    const transformData = (data: SegementOSSTableData) => {
        if (pageFilters.comparedDuration) {
            return {
                ...data,
                Data: data.Data.map((datapoint) => {
                    const {
                        ConfidenceLevel,
                        CompareConfidenceLevel,
                        Cv,
                        CvCompare,
                        Cvr,
                        CvDelta,
                        CvrDelta,
                        CvrCompare,
                    } = datapoint;
                    return {
                        ...datapoint,
                        Cv: isHighConfidence(ConfidenceLevel) ? Cv : null,
                        CvCompare: isHighConfidence(CompareConfidenceLevel) ? CvCompare : null,
                        CvDelta:
                            isHighConfidence(ConfidenceLevel) &&
                            isHighConfidence(CompareConfidenceLevel)
                                ? CvDelta
                                : null,
                        Cvr: isHighConfidence(ConfidenceLevel) ? Cvr : null,
                        CvrCompare: isHighConfidence(CompareConfidenceLevel) ? CvrCompare : null,
                        CvrDelta:
                            isHighConfidence(ConfidenceLevel) &&
                            isHighConfidence(CompareConfidenceLevel)
                                ? CvrDelta
                                : null,
                    };
                }),
                TotalCount: data.Header.TotalCount,
            };
        }
        return {
            ...data,
            Data: data.Data.map((datapoint) => {
                const { ConfidenceLevel, Cv, CvGrowth, CvrGrowth, Cvr } = datapoint;
                return {
                    ...datapoint,
                    Cv: isHighConfidence(ConfidenceLevel) ? Cv : null,
                    CvGrowth: isHighConfidence(ConfidenceLevel) ? CvGrowth : null,
                    Cvr: isHighConfidence(ConfidenceLevel) ? Cvr : null,
                    CvrGrowth: isHighConfidence(ConfidenceLevel) ? CvrGrowth : null,
                };
            }),
            TotalCount: data.Header.TotalCount,
        };
    };
    const onGetData = (data: SegementOSSTableData) => {
        setAvailableWordCount(_.get(data, "[Filters][WordCount]", []));
    };

    const onSort = ({ field, sortDirection }) => {
        setSortByCol({ sortbyField: field, sortDirection });
    };
    const renderEmptyState = () => {
        return (
            <WebsiteSegmentEmptyState primaryText={"conversion.analysis.oss.invalid.country.title"}>
                <FlexContainerCentered>
                    <SecondaryText>
                        {i18nFilter()("conversion.analysis.oss.invalid.country.subtitle")}
                    </SecondaryText>
                    {ossSupportedCountries.map((country, index) => {
                        if (
                            ossSupportedCountries.length > 1 &&
                            index === ossSupportedCountries.length - 1
                        ) {
                            return (
                                <>
                                    <SecondaryText>
                                        &nbsp;
                                        {i18nFilter()(
                                            "conversion.analysis.oss.invalid.country.subtitle.or",
                                        )}
                                    </SecondaryText>
                                    <StyledLink
                                        key={country}
                                        href={swNavigator.href("conversion-customsegement", {
                                            ...pageFilters,
                                            country,
                                            tab,
                                        })}
                                    >
                                        {CountryService.getCountryById(country).text}
                                    </StyledLink>
                                </>
                            );
                        } else {
                            return (
                                <>
                                    {index > 0 && index <= ossSupportedCountries.length - 2 && (
                                        <SecondaryText>,</SecondaryText>
                                    )}
                                    <StyledLink
                                        key={country}
                                        href={swNavigator.href("conversion-customsegement", {
                                            ...pageFilters,
                                            country,
                                            tab,
                                        })}
                                    >
                                        {CountryService.getCountryById(country).text}
                                    </StyledLink>
                                </>
                            );
                        }
                    })}
                </FlexContainerCentered>
            </WebsiteSegmentEmptyState>
        );
    };

    const getExcelUrlParams = () => {
        const {
            pageFilters: { sid, country, to, from, isWindow },
        } = props;

        const {
            forAPI: { compareFrom, compareTo },
        } = durationData;

        const { includeTerms = "", excludeTerms = "" } = ossTableSelectedFilters || {};

        const { value: wordCount = undefined } = ossTableSelectedWordCount || {};

        const params = {
            sid,
            country,
            to,
            from,
            isWindow,
            compareFrom,
            compareTo,
            includeTerms,
            excludeTerms,
            wordCount,
        };

        return params;
    };

    const generateExcelDownloadLink = () => {
        const urlParams = getExcelUrlParams();
        const excelUrl = apiService.getOssExcelUrl(urlParams);
        return excelUrl;
    };

    const SegmentOssHeader = ({ subtitleFilters }) => {
        return (
            <StyledTitleContainer>
                <StyledTitleTextContainer>
                    <StyledHeaderTitle>
                        <BoxTitle tooltip={i18nFilter()("conversion.segment.oss.title.tooltip")}>
                            {i18nFilter()("conversion.segment.oss.title")}
                        </BoxTitle>
                    </StyledHeaderTitle>
                    <StyledBoxSubtitle>
                        <BoxSubtitle filters={subtitleFilters} />
                    </StyledBoxSubtitle>
                </StyledTitleTextContainer>
                <PlainTooltip tooltipContent={i18nFilter()("downloadCSV")}>
                    <ExcelButton url={generateExcelDownloadLink()} trackName="category oss" />
                </PlainTooltip>
            </StyledTitleContainer>
        );
    };

    return (
        <BoxContainer data-automation-sites-vs-category={true}>
            <SegmentOssHeader subtitleFilters={subtitleFilters} />
            {ossSupportedCountries.includes(pageFilters.country) ? (
                <SWReactTableWrapper
                    serverApi={CONVERSION_OSS_API}
                    initialFilters={initialTableParams}
                    tableColumns={tableColumns}
                    tableOptions={{ metric: "ConversionSegmentOSSTable" }}
                    transformData={transformData}
                    getDataCallback={onGetData}
                    recordsField="Data"
                    totalRecordsField="TotalCount"
                    onSort={onSort}
                    pageIndent={0}
                    rowsPerPage={100}
                >
                    {(topComponentProps) => (
                        <ConversionSegmentOSSTableTop
                            availableWordCount={availableWordCount}
                            selectedFilters={ossTableSelectedFilters}
                            selectedWordCount={ossTableSelectedWordCount}
                            updateSelectedFilters={updateOssTableFilters}
                            updateSelectedWordCount={updateOssTableWordCount}
                            {...topComponentProps}
                        />
                    )}
                </SWReactTableWrapper>
            ) : (
                renderEmptyState()
            )}
        </BoxContainer>
    );
};
