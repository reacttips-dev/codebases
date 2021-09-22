import * as React from "react";
import { TrafficShare } from "../../../TrafficShare/src/TrafficShare";
import { RowLoadingContainer } from "../../MarketingMixTable/src/MarketingMixTableStyled";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { IGroupRowProps } from "./GroupRow.types";
import { ChangeCell } from "../../TableCells/ChangeCell";
import {
    GroupRowCell,
    GroupRowColText,
    GroupRowInnerCell,
    GroupRowFlexContainer,
    GroupRowSplitCell,
    GroupRowSubTitle,
    GroupRowTitle,
    GroupRowTitleCell,
    GroupRowBlockNoPaddingContainer,
} from "./GroupRow.styled";
import { NoDataLandscape, NoDataRow } from "../../../NoData/src/NoData";
import { MinNumberCell } from "../../TableCells/MinNumberCell";
import { TrafficShareWithTooltip } from "../../../TrafficShare/src/TrafficShareWithTooltip";

const SHARE_TOTAL_THRESHOLD = 5000;

export const GroupRow: React.StatelessComponent<IGroupRowProps> = ({
    titles,
    data,
    loading,
    error,
}) => {
    const isData = data && Object.keys(data).length > 0;
    return (
        <GroupRowFlexContainer isClickable={isData}>
            {isData && [
                <GroupRowTitleCell key="GroupRowTitleCell">
                    <GroupRowTitle data-automation-group-row-title>
                        {titles.groupRowTitle}
                    </GroupRowTitle>
                    <GroupRowSubTitle data-automation-group-row-subtitle>
                        {titles.groupRowSubTitle}
                    </GroupRowSubTitle>
                </GroupRowTitleCell>,
                <GroupRowCell key="GroupRowCell1">
                    <GroupRowColText data-automation-group-row-groupshare>
                        {titles.groupShare}
                    </GroupRowColText>
                    <GroupRowInnerCell>
                        <MinNumberCell
                            data-automation-group-row-grouptotal
                            value={data.groupShareTotal}
                        />
                        {data.groupShareTotal > SHARE_TOTAL_THRESHOLD && data.groupShareChange ? (
                            <ChangeCell
                                data-automation-group-row-groupchange
                                value={data.groupShareChange}
                            />
                        ) : null}
                    </GroupRowInnerCell>
                </GroupRowCell>,
                <GroupRowCell key="GroupRowCell2">
                    <GroupRowColText data-automation-group-row-myshare>
                        {titles.myShare}
                    </GroupRowColText>
                    <GroupRowInnerCell>
                        <MinNumberCell
                            data-automation-group-row-mytotal
                            value={data.myShareTotal}
                        />
                        {data.myShareTotal > SHARE_TOTAL_THRESHOLD && data.myShareChange ? (
                            <ChangeCell
                                data-automation-group-row-mychange
                                value={data.myShareChange}
                            />
                        ) : null}
                    </GroupRowInnerCell>
                </GroupRowCell>,
                <GroupRowSplitCell key="GroupRowSplitCell">
                    <GroupRowColText>{titles.groupSplit}</GroupRowColText>
                    <TrafficShareWithTooltip
                        data-automation-group-row-split
                        data={data.groupSplit}
                        title="workspaces.marketing.trafficshare.tooltip.title"
                    />
                </GroupRowSplitCell>,
            ]}

            {data &&
                Object.keys(data).length === 0 && [
                    <GroupRowTitleCell key="GroupRowTitleCell">
                        <GroupRowTitle>{titles.groupRowTitle}</GroupRowTitle>
                        <GroupRowSubTitle>{titles.groupRowSubTitle}</GroupRowSubTitle>
                    </GroupRowTitleCell>,
                    <NoDataRow
                        key="NoDataRow"
                        description={"workspaces.marketing.seo.error.description"}
                    />,
                ]}

            {error && (
                <GroupRowBlockNoPaddingContainer>
                    <NoDataLandscape
                        title={"workspaces.marketing.seo.error.title"}
                        subtitle={"workspaces.marketing.seo.error.subtitle"}
                    />
                </GroupRowBlockNoPaddingContainer>
            )}

            {loading && (
                <GroupRowBlockNoPaddingContainer>
                    {Array.from(Array(2)).map((item, index) => (
                        <RowLoadingContainer key={`RowLoadingContainer-${index}`}>
                            <PixelPlaceholderLoader width={191} height={17} />
                            <PixelPlaceholderLoader width={96} height={17} />
                            <PixelPlaceholderLoader width={96} height={17} />
                            <PixelPlaceholderLoader width={323} height={17} />
                        </RowLoadingContainer>
                    ))}
                </GroupRowBlockNoPaddingContainer>
            )}
        </GroupRowFlexContainer>
    );
};
