import { IconButton } from "@similarweb/ui-components/dist/button";
import { Dropdown, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as React from "react";
import { CSSProperties, StatelessComponent } from "react";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { granularities } from "utils";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { colorsPalettes } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";

export interface ICustomSegmentAddtionalOptionsProps {
    domain: string;
    userId?: string;
    id: string;
    lastUpdated: string;
    segmentName: string;
    onExcelDownload: () => void;
    onClickDelete: (id: string) => void;
    onToggleEllipsis?: () => void;
    dropDownStyle?: CSSProperties;
}
export const ExcelLabel = styled.span`
    text-decoration: none;
    color: ${colorsPalettes.carbon["500"]};
    letter-spacing: 0.6px;
    font-size: 14px;
`;
ExcelLabel.displayName = "ExcelLabel";

export const SegmentAnalysisEllipsisButton = styled.div.attrs({
    children: <IconButton type="flat" iconName="dots-more" />,
})`
    .SWReactIcons svg {
        width: 24px;
        height: 24px;
    }
`;
SegmentAnalysisEllipsisButton.displayName = "SegmentAnalysisEllipsisButton";

export const IconContainer = styled.span`
    display: inline-block;
    margin-left: 16px;
    margin-right: 8px;
    cursor: pointer;
    @media (max-width: 1440px) and (min-width: 1024px) {
        margin-right: 0px;
        width: 32px;
        height: 32px;
    }
`;
export const SA = styled.a`
    display: flex;
    height: 48px;
    align-items: center;
    &:hover {
        background-color: rgba(42, 62, 82, 0.05);
    }
`;

const itsMyOwnSegment = (userId) => {
    return +userId === swSettings.user.id ? true : false;
};

export const CustomSegmentAddtionalOptions: StatelessComponent<ICustomSegmentAddtionalOptionsProps> = ({
    onClickDelete,
    onToggleEllipsis,
    onExcelDownload,
    domain,
    id,
    lastUpdated,
    segmentName,
    userId,
}) => {
    function createActionsMenuContent() {
        if (itsMyOwnSegment(userId)) {
            return [
                <SegmentAnalysisEllipsisButton
                    className={"ellipsis"}
                    key="SegmentAnalysisEllipsisButton"
                />,
                {
                    id: "delete",
                    iconName: "delete",
                    text: i18nFilter()("segments.module.additional.options.delete.segment"),
                    onClickFunc: () => onClickDelete(id),
                },
                <SA
                    key="SegmentAnalysisDownloadExcel"
                    onClick={onExcelDownload}
                    href={getExcelUrl(domain, id, lastUpdated, segmentName)}
                    target="_self"
                >
                    <IconContainer>
                        <SWReactIcons iconName="excel" size="sm" />
                    </IconContainer>
                    <ExcelLabel>{i18nFilter()("downloadCSV")}</ExcelLabel>
                </SA>,
            ];
        } else {
            return [
                <SegmentAnalysisEllipsisButton
                    className={"ellipsis"}
                    key="SegmentAnalysisEllipsisButton"
                />,
                <SA
                    key="SegmentAnalysisDownloadExcel"
                    onClick={onExcelDownload}
                    href={getExcelUrl(domain, id, lastUpdated, segmentName)}
                    target="_self"
                >
                    <IconContainer>
                        <SWReactIcons iconName="excel" size="sm" />
                    </IconContainer>
                    <ExcelLabel>{i18nFilter()("downloadCSV")}</ExcelLabel>
                </SA>,
            ];
        }
    }
    return (
        <div>
            <Dropdown
                dropdownPopupPlacement={"bottom-left"}
                buttonWidth="40px"
                width="230px"
                itemsComponent={EllipsisDropdownItem}
                onClick={(action) =>
                    action.onClickFunc ? action.onClickFunc(action.id) : _.noop()
                }
                onToggle={onToggleEllipsis}
            >
                {createActionsMenuContent()}
            </Dropdown>
        </div>
    );
};

const getExcelUrl = (keys, segmentId, lastUpdated, segmentName) => {
    const requestParams = (params: any): string => {
        return _.toPairs(params)
            .map(
                ([key, value]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`,
            )
            .join("&");
    };

    const params = (Injector.get("swNavigator") as any).getApiParams();

    const excelFileName = `SegmentAnalysis - ${keys} - ${segmentName} - (${params.country}) - (${params.from}) - (${params.to})`;
    const timeGran = params.isWindow ? granularities[0] : granularities[2];
    return (
        "/widgetApi/TrafficAndEngagement/FolderEngagement/Excel?" +
        requestParams({
            country: params.country,
            from: params.from,
            includeSubDomains: true,
            isWindow: params.isWindow,
            keys,
            segmentId,
            timeGranularity: timeGran,
            to: params.to,
            webSource: "Desktop",
            lastUpdated,
            FileName: excelFileName,
        })
    );
};
