import React, { FC } from "react";
import * as queryString from "querystring";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { allTrackers } from "services/track/track";
import { ISERPRecord } from "pages/keyword-analysis/serp-snapshot/types.ts";
import {
    DownloadExcelContainer,
    SearchContainer,
    TitleContainer,
} from "pages/keyword-analysis/serp-snapshot/StyledComponents";
import { SERPSnapshotTableTopWidgets } from "pages/keyword-analysis/serp-snapshot/SERPSnapshotTableTopWidgets";
import { i18nFilter } from "filters/ngFilters";
import {
    onChipAdd,
    onChipRemove,
} from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageUtillities";
import { EBooleanSearchActions } from "pages/website-analysis/traffic-sources/search/BooleanSearchWithBothKeywordsAndWebsite";
import { BooleanSearchWithBothKeywordsAndWebsiteWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchWithBothKeywordsAndWebsiteWrapper";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import CountryService from "services/CountryService";
import dayjs from "dayjs";

interface ISERPSnapshotTableTop {
    serpRecords: Record<string, ISERPRecord>;
    lastScrapeDate: string;
    excelAllowed: boolean;
    excelDownloadUrl: string;
    booleanSearchTerms?: string;
    tableColumns: Record<string, any>;
    filtersStateObject: any;
    isLoadingData: boolean;
    sort: string;
    noSerpRecords: boolean;
    asc: string;
    onClickToggleColumns(index: number): void;
    onFilterChange(value: Record<string, string>): void;
}

const DEFAULT_SORT = "position";

export const SERPSnapshotTableTop: FC<ISERPSnapshotTableTop> = (props) => {
    const {
        filtersStateObject,
        excelDownloadUrl,
        excelAllowed,
        serpRecords,
        noSerpRecords,
        lastScrapeDate,
        isLoadingData,
        sort = DEFAULT_SORT,
        asc = false,
    } = props;
    const queryParams = { ...filtersStateObject, sort, asc };
    const excelLink = `${excelDownloadUrl}?${queryString.stringify(queryParams)}`;
    const countryObject = CountryService.getCountryById(queryParams.country);
    const laseDateFormat = () => {
        if (lastScrapeDate) {
            return dayjs(lastScrapeDate).format("MMM DD, YYYY");
        }
    };

    const subtitleFilters = [
        {
            filter: "lastDate",
            value: laseDateFormat(),
        },
        {
            filter: "webSource",
            value: queryParams.webSource,
        },
        {
            filter: "country",
            countryCode: countryObject.id,
            value: countryObject.text,
        },
    ];

    const onBooleanSearchChange = (params) => {
        props.onFilterChange({ ExcludeUrls: params.ExcludeUrls, IncludeUrls: params.IncludeUrls });
    };

    const trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Excel");
    };

    return (
        <React.Fragment>
            <TitleContainer>
                <div>
                    <StyledPrimaryTitle>
                        <BoxTitle>{i18nFilter()("serp.top.table.title")}</BoxTitle>
                    </StyledPrimaryTitle>
                    <StyledBoxSubtitle>
                        <BoxSubtitle filters={subtitleFilters} />
                    </StyledBoxSubtitle>
                </div>
                <DownloadExcelContainer href={excelLink}>
                    <DownloadButtonMenu
                        Excel={true}
                        downloadUrl={excelLink}
                        exportFunction={trackExcelDownload}
                        excelLocked={!excelAllowed}
                    />
                </DownloadExcelContainer>
            </TitleContainer>
            <SearchContainer>
                <React.Fragment>
                    <BooleanSearchWithBothKeywordsAndWebsiteWrapper
                        placeholder={i18nFilter()("serp.boolean.search.placeholder")}
                        onChipAdd={onChipAdd}
                        onChipRemove={onChipRemove}
                        filtersStateObject={filtersStateObject}
                        booleanSearchAction={EBooleanSearchActions.WEBSITES}
                        onApplyChanges={onBooleanSearchChange}
                    />
                </React.Fragment>
            </SearchContainer>
            <SERPSnapshotTableTopWidgets
                isLoadingData={isLoadingData}
                serpRecords={serpRecords}
                noSerpRecords={noSerpRecords}
                lastScrapeDate={lastScrapeDate}
            />
        </React.Fragment>
    );
};
