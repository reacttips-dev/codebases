import { colorsPalettes } from "@similarweb/styles";
import * as React from "react";
import * as _ from "lodash";
import { Injector } from "common/ioc/Injector";
import {
    ShareBar,
    ShareBarChart,
    ShareBarContainer,
} from "@similarweb/ui-components/dist/share-bar";
import {
    Dropdown,
    EllipsisDropdownButton,
    SimpleNoSelectionDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { i18nFilter } from "filters/ngFilters";
import { CHART_NAME } from "../FolderAnalysisDefaults";
import { SwTrack } from "services/SwTrack";

export const ExpandedHeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 32px;
    border-bottom: solid 1px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    :hover {
      background-color: rgba(233, 235, 237, 0.3)};
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
    }
    @media (max-width: 420px) {
        padding: 42px 32px;
        position: relative;
        top: -24px;
    }
    ${ShareBarContainer} {
        flex: 1 0 240px;
        max-width: 435px;
    }
`;
ExpandedHeaderContainer.displayName = "ExpandedHeaderContainer";

export const RowInfo = styled.div`
    display: flex;
    width: calc(100% - 124px);
    flex-direction: row;
    justify-content: space-between;
    @media (max-width: 420px) {
        flex-direction: column;
        height: 40px;
        width: calc(100% - 70px);
    }
    ${ShareBarContainer} {
        @media (max-width: 420px) {
            width: calc(100% - 10px);
            top: 10px;
            position: relative;
        }
        ${ShareBarChart} {
            @media (max-width: 420px) {
                display: block;
                width: 100%;
            }
        }
    }
`;
RowInfo.displayName = "RowInfo";

const CloseBtn = styled(SWReactIcons).attrs({
    iconName: "close",
})`
    svg {
        height: 14px;
        width: 14px;
        cursor: pointer;
        path {
            fill: #1b2653;
        }
    }
`;
CloseBtn.displayName = "CloseBtn";

export const StyledShareBarContainer = styled.div`
    flex: 1 0 240px;
    display: flex;
    max-width: 435px;
    align-items: center;
`;
StyledShareBarContainer.displayName = "StyledShareBarContainer";

const StyledEllipsisDropdown = styled.div`
    width: 40px;
    position: absolute;
    right: 86px;
    @media (max-width: 420px) {
        right: 56px;
    }
`;
StyledEllipsisDropdown.displayName = "StyledEllipsisDropdown";

export const ExcelBtn = styled.div`
    color: ${colorsPalettes.carbon["400"]};
`;
ExcelBtn.displayName = "ExcelBtn";

export const getExcelUrl = (keys, timeGranularity) => {
    const requestParams = (params: any): string => {
        return _.toPairs(params)
            .map(
                ([key, value]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`,
            )
            .join("&");
    };

    const params = (Injector.get("swNavigator") as any).getApiParams();

    return (
        "/widgetApi/TrafficAndEngagement/FolderEngagement/Excel?" +
        requestParams({
            country: params.country,
            from: params.from,
            includeSubDomains: !params.isWWW,
            isWindow: params.isWindow,
            keys,
            timeGranularity,
            to: params.to,
            webSource: params.webSource,
        })
    );
};

export const ExpandedHeader = ({ folder, value, timeGranularity, hideDD = false }) => {
    const clickOutside = (e) => {
        if (Array.from(e.target.classList).indexOf("DropdownButton") !== -1) {
            e.stopPropagation();
        } else {
            document.body.click();
        }
    };
    const onDropdownToggle = (isOpen, isOutsideClick, e) => {
        if (isOpen) {
            SwTrack.all.trackEvent("Drop Down", "open", `${CHART_NAME}/Download`);
        }
    };
    const onItemClick = ({}) => {
        SwTrack.all.trackEvent("Download", "submit-ok", `${CHART_NAME}/Excel`);
    };

    return (
        <ExpandedHeaderContainer onClick={clickOutside}>
            <RowInfo>
                <span>{folder}</span>
                <StyledShareBarContainer>
                    <ShareBar value={value} hideChangeValue />
                </StyledShareBarContainer>
            </RowInfo>
            {hideDD ? null : (
                <StyledEllipsisDropdown>
                    <Dropdown width={148} onClick={onItemClick} onToggle={onDropdownToggle}>
                        <EllipsisDropdownButton />
                        <SimpleNoSelectionDropdownItem id="csv">
                            <a href={getExcelUrl(folder, timeGranularity)} target="_self">
                                <ExcelBtn>
                                    <i className="icon sw-icon-download-excel DropdownItem-icon"></i>
                                    {i18nFilter()("downloadCSV")}
                                </ExcelBtn>
                            </a>
                        </SimpleNoSelectionDropdownItem>
                    </Dropdown>
                </StyledEllipsisDropdown>
            )}
            <CloseBtn />
        </ExpandedHeaderContainer>
    );
};
