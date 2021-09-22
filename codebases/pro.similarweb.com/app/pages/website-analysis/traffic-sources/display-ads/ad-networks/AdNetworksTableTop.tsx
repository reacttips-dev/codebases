import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import * as React from "react";
import { FunctionComponent } from "react";
import styled from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { colorsPalettes } from "@similarweb/styles";

const DownloadExcelContainer = styled.a`
    margin: 0 8px 0 16px;
`;

const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 16px 8px 0;
    height: 40px;
    .SearchInput-container {
        flex-grow: 1;
    }
    .SearchInput {
        height: 34px;
        background-color: ${colorsPalettes.carbon[0]};
        border: none;
        width: 100%;
        box-sizing: border-box;
        padding: 9px 2px 5px 50px;
        box-shadow: none;
        margin-bottom: 0;
        :focus {
            box-shadow: none !important;
            border: none;
        }
    }
`;

export const AdNetworksTableTop: FunctionComponent<any> = (props) => {
    const {
        isLoadingData,
        tableColumns,
        onClickToggleColumns,
        downloadExcelPermitted,
        excelLink,
        searchValue,
        onChange,
        a2d,
        i18n,
    } = props;

    const getColumnsPickerLiteProps = (): IColumnsPickerLiteProps => {
        const columns = tableColumns.reduce((res, col, index) => {
            if (!col.fixed) {
                return [
                    ...res,
                    {
                        key: index.toString(),
                        displayName: col.displayName,
                        visible: col.visible,
                    },
                ];
            }
            return res;
        }, []);
        return {
            columns,
            onColumnToggle,
            onPickerToggle: () => null,
            maxHeight: 264,
            width: "auto",
        };
    };
    const onColumnToggle = (key) => {
        if (tableColumns[key].visible) {
            TrackWithGuidService.trackWithGuid(
                "display_ads.ad_networks.table.excel.remove.column",
                "remove",
                {
                    column_name: tableColumns[key].displayName,
                },
            );
        } else {
            TrackWithGuidService.trackWithGuid(
                "display_ads.ad_networks.table.excel.add.column",
                "add",
                {
                    column_name: tableColumns[key].displayName,
                },
            );
        }
        onClickToggleColumns(parseInt(key, 10));
    };
    const excelDownloadUrl = downloadExcelPermitted ? excelLink : "";
    let excelLinkHref = {};
    if (excelDownloadUrl !== "") {
        excelLinkHref = { href: excelDownloadUrl };
    }
    const trackExcelDownload = () => {
        TrackWithGuidService.trackWithGuid(
            "display_ads.ad_networks.table.excel.click",
            "submit-ok",
        );
    };
    return !isLoadingData ? (
        <SearchContainer>
            <SearchInput
                disableClear={true}
                defaultValue={searchValue}
                debounce={400}
                onChange={onChange}
                placeholder={i18n("forms.search.placeholder")}
            />
            <Right>
                <FlexRow>
                    <DownloadExcelContainer {...excelLinkHref}>
                        <DownloadButtonMenu
                            Excel={true}
                            downloadUrl={excelDownloadUrl}
                            exportFunction={trackExcelDownload}
                            excelLocked={!downloadExcelPermitted}
                        />
                    </DownloadExcelContainer>
                    <div>
                        <ColumnsPickerLite {...getColumnsPickerLiteProps()} withTooltip />
                    </div>
                    <div>
                        <AddToDashboardButton onClick={a2d} />
                    </div>
                </FlexRow>
            </Right>
        </SearchContainer>
    ) : null;
};
