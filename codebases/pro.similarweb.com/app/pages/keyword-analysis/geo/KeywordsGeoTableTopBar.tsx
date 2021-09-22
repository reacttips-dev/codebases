import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import { ISource } from "pages/keyword-analysis/geo/KeywordsGeoTableConfig";
import React from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import { KeywordsGeoExcelDownload } from "./Components/KeywordsGeoExcelDownload";

interface IKeywordsGeoTableTopBarProps {
    selectedItem: any;
    allSources: ISource[];
    onSourceSelect: any;
    queryParams: any;
    isDownloadExcel: boolean;
}

const ChipDownWrapper = styled.div`
    width: auto;
    display: inline-flex;
`;

const KeywordsGeoTableTopBarStyle = styled.div`
    height: 56px;
    padding: 12px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e9ebed;
`;

export const KeywordsGeoTableTopBar = ({
    selectedItem,
    allSources,
    onSourceSelect,
    queryParams,
    isDownloadExcel,
}: IKeywordsGeoTableTopBarProps) => {
    const selectedText = selectedItem.id === "both" ? null : selectedItem?.text;
    const buttonText = (selectedItem ?? allSources[0])?.text;

    const onFilterReset = () => {
        onSourceSelect(allSources[0]);
    };

    const onFilterClick = ({ id }) => {
        const newSelectedSource = _.find(allSources, (Source: any) => Source.id == id);
        TrackWithGuidService.trackWithGuid("keywordAnalysis.geography.filter", "click", {
            filter: newSelectedSource.id,
        });
        onSourceSelect(newSelectedSource);
    };

    return (
        <KeywordsGeoTableTopBarStyle>
            <ChipDownWrapper>
                <ChipDownContainer
                    selectedIds={selectedItem.id === "both" ? {} : { [selectedItem.id]: true }}
                    selectedText={i18nFilter()(selectedText)}
                    onClick={onFilterClick}
                    onCloseItem={onFilterReset}
                    buttonText={i18nFilter()(buttonText)}
                    width={320}
                    tooltipDisabled={true}
                >
                    {_.filter(allSources, (item) => {
                        return item.id !== selectedItem.id;
                    }).map(({ id, text }) => (
                        <EllipsisDropdownItem key={id} id={id}>
                            {i18nFilter()(text)}
                        </EllipsisDropdownItem>
                    ))}
                </ChipDownContainer>
            </ChipDownWrapper>
            {isDownloadExcel && <KeywordsGeoExcelDownload queryParams={queryParams} />}
        </KeywordsGeoTableTopBarStyle>
    );
};
