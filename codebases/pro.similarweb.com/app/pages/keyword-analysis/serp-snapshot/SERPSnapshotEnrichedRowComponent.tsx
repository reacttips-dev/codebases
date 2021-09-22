import { FC } from "react";
import { i18nFilter, pureNumberFilterWithZeroCount } from "filters/ngFilters";
import * as React from "react";
import { allTrackers } from "services/track/track";
import { SERP_MAP } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTypes";
import { UrlCell } from "components/React/Table/cells";
import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import classNames from "classnames";
import {
    CloseIconButton,
    DataGridContainer,
    DataGridHeaderItem,
    DataGridItem,
    DataGridRightAlignedHeaderItem,
    DataGridRightAlignedItem,
    HeaderTitle,
    NewPosition,
    PositionChangeContainer,
    SERPSnapshotEnrichedRowComponentContainer,
    TopSectionContainer,
} from "pages/keyword-analysis/serp-snapshot/StyledComponents";

const i18n = i18nFilter();

const getHeaders = () => {
    return (
        <>
            <DataGridRightAlignedHeaderItem>
                {i18n("keyword.research.serp.snapshot.enriched.component.column.title.position")}
            </DataGridRightAlignedHeaderItem>
            <DataGridRightAlignedHeaderItem>
                {i18n("keyword.research.serp.snapshot.enriched.component.column.title.change")}
            </DataGridRightAlignedHeaderItem>
            <DataGridHeaderItem>
                {i18n("keyword.research.serp.snapshot.enriched.component.column.title.domain")}
            </DataGridHeaderItem>
            <DataGridHeaderItem>
                {i18n("keyword.research.serp.snapshot.enriched.component.column.title.url")}
            </DataGridHeaderItem>
        </>
    );
};

const getChangeText = (currentPosition, previousPosition) => {
    if (Number.isInteger(previousPosition)) {
        const value = previousPosition - currentPosition;
        const signClass = value < 0 ? "down2 negative" : value > 0 ? "up2 positive" : "";
        return (
            <PositionChangeContainer>
                <div className="text-right changePercentage">
                    <span className={`sw-icon-arrow-${signClass}`}>
                        {" "}
                        {pureNumberFilterWithZeroCount(Math.abs(value), 2)}
                    </span>
                </div>
            </PositionChangeContainer>
        );
    } else {
        return (
            <PositionChangeContainer>
                <NewPosition>{i18n("New")}</NewPosition>
            </PositionChangeContainer>
        );
    }
};

const getRows = (rowItems) => {
    return rowItems.map((item, index) => {
        const { currentPosition, previousPosition, site, favicon, url } = item;
        const className = classNames({ ["last-row"]: index === rowItems.length - 1 });
        return (
            <>
                <DataGridRightAlignedItem key={currentPosition + 1} className={className}>
                    {index + 1}
                </DataGridRightAlignedItem>
                <DataGridRightAlignedItem key={currentPosition + 2} className={className}>
                    {previousPosition ? getChangeText(currentPosition, previousPosition) : "-"}
                </DataGridRightAlignedItem>
                <DataGridItem key={currentPosition + 3} className={className}>
                    {site ? <CoreWebsiteCell domain={site} icon={favicon} /> : "-"}
                </DataGridItem>
                <DataGridItem key={currentPosition + 4} className={className}>
                    {url ? <UrlCell site={url} /> : "-"}
                </DataGridItem>
            </>
        );
    });
};

export const SERPSnapshotEnrichedRowComponent: FC<any> = (props) => {
    const { records, serpFeature } = props.row;
    const { icon, name, id } = SERP_MAP[serpFeature];

    const clickOutsideXButton = () => {
        document.body.click();
    };

    const filteredRecords = records.filter(
        (record) => Boolean(record.currentPosition) && Boolean(record.url),
    );

    const headers = getHeaders();
    const rows = getRows(filteredRecords);
    return (
        <SERPSnapshotEnrichedRowComponentContainer>
            <TopSectionContainer>
                <HeaderTitle>
                    {i18n("keyword.research.serp.snapshot.enriched.component.title", {
                        serpType: name,
                    })}
                </HeaderTitle>
                <CloseIconButton
                    type="flat"
                    onClick={clickOutsideXButton}
                    iconName="clear"
                    placement="left"
                />
            </TopSectionContainer>
            <DataGridContainer>
                {headers}
                {rows}
            </DataGridContainer>
        </SERPSnapshotEnrichedRowComponentContainer>
    );
};
