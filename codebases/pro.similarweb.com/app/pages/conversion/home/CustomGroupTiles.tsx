import { SWReactCountryIcons, SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import * as _ from "lodash";
import { default as React, StatelessComponent } from "react";
import { CoreWebsiteCell } from "../../../../.pro-features/components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import ComponentsProvider from "../../../../.pro-features/components/WithComponent/src/ComponentsProvider";
import WithAllContexts from "../../../../.pro-features/pages/app performance/src/common components/WithAllContexts";
import {
    CustomGroupButtonContainer,
    TilesContainer,
} from "../../../../.pro-features/pages/conversion/Homepage/src/StyledComponents";
import {
    CardListEmptyContainer,
    ListCardBullet,
    ListCardCountryIcon,
    ListCardHeaderContainer,
    ListCardSubtitle,
    ListCardTableContainer,
    ListCardTitle,
} from "../../../../.pro-features/pages/workspace/common components/OverviewPage/StyledComponents";
import { ChangePercentage } from "../../../components/React/Table/cells/ChangePercentage";
import { TrendCell } from "../../../components/React/Table/cells/TrendCell";
import { DefaultCellHeader } from "../../../components/React/Table/headerCells/DefaultCellHeader";
import { DefaultCellHeaderRightAlign } from "../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import { WebsiteTooltip } from "../../../components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { NewCustomGroupImage } from "./NewCustomGroupImage";
import { HomepageNewCustomGroup, TileWrapper } from "./StyledComponents";
import { ISegmentsData } from "../../../services/conversion/ConversionSegmentsService";
import { ConversionSegmentsUtils } from "../ConversionSegmentsUtils";

const TOP_SEGMENTS_COUNT = 3;

export interface IGroup {
    GroupName: string;
    GroupId: string;
    Country: number;
    country: { id: number; text: string };
    TotalSegments: number;
    TopSegments: any[];
    onGroupClick: () => void;
}

export interface ICustomGroupTilesProps {
    customGroups: IGroup[];
    onCreate: () => void;
    segments?: ISegmentsData;
}

export const getCustomGroupsColumnsConfig = (translate, track, segments) => {
    return [
        {
            field: "Domain",
            displayName: translate("conversion.home.customgroup.column.segments.title"),
            type: "string",
            format: "None",
            cellComponent: ({ value, row }) => {
                const segmentData = ConversionSegmentsUtils.getSegmentById(segments, row.SegmentId);
                const subtitleFilters = [];
                if (!segmentData.isSingleLob) {
                    subtitleFilters.push({
                        filter: "text",
                        value: segmentData.segmentName,
                    });
                }

                return (
                    <ComponentsProvider components={{ WebsiteTooltip }}>
                        <CoreWebsiteCell
                            icon={row.Favicon}
                            domain={value}
                            internalLink={row.domainHref}
                            subtitleFilters={subtitleFilters.length > 0 ? subtitleFilters : null}
                            trackInternalLink={() =>
                                track(
                                    "Internal link",
                                    "click",
                                    `My custom groups/Analyze website/${value}`,
                                )
                            }
                        />
                    </ComponentsProvider>
                );
            },
            headerComponent: DefaultCellHeader,
            minWidth: 240,
        },
        {
            field: "ConvertedVisits",
            displayName: translate("conversion.homepage.customgroup.column.convertedvisits.title"),
            headerComponent: DefaultCellHeader,

            cellComponent: ({ value, row }) => {
                const colors =
                    row.Change > 0
                        ? {
                              stop1Color: colorsPalettes.green["100"],
                              stop2Color: rgba(colorsPalettes.green["100"], 0.2),
                              fillColor: colorsPalettes.green.s100,
                          }
                        : {
                              stop1Color: colorsPalettes.red["100"],
                              stop2Color: rgba(colorsPalettes.red["100"], 0.2),
                              fillColor: colorsPalettes.red.s100,
                          };

                return <TrendCell value={value} row={row} params={colors} />;
            },
            tooltip: translate("conversion.homepage.customgroup.column.convertedvisits.tooltip"),
            minWidth: 96,
        },
        {
            field: "Change",
            displayName: translate("conversion.homepage.customgroup.column.change.title"),
            type: "double",
            format: "percentagesign",
            cellComponent: ChangePercentage,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: translate("conversion.homepage.customgroup.column.change.tooltip"),
            minWidth: 96,
        },
    ];
};

export const CustomGroupTiles: StatelessComponent<ICustomGroupTilesProps> = ({
    customGroups,
    onCreate,
    segments,
}) => (
    <WithAllContexts>
        {({ translate, track }) => {
            const onCreateNewGroup = (e) => {
                track("Internal link", "click", `My custom groups/Create new group`);
                onCreate();
                e.stopPropagation();
            };

            return (
                <TilesContainer>
                    <HomepageNewCustomGroup
                        onClick={onCreateNewGroup}
                        key={"tilehomepagecustomgroup"}
                    >
                        <CardListEmptyContainer>
                            <NewCustomGroupImage />
                            <Button
                                type="flat"
                                width={200}
                                dataAutomation={`conversion-homepage-customgroup-create-button`}
                                onClick={() => {
                                    /* container will trigger onCreateNewGroup function*/
                                }}
                            >
                                {translate("conversion.homepage.customgroup.create")}
                            </Button>
                        </CardListEmptyContainer>
                    </HomepageNewCustomGroup>
                    {customGroups.map((group, index) => {
                        const groupName = group.GroupName || "";
                        return (
                            <TileWrapper key={"tile" + index}>
                                <ListCardHeaderContainer>
                                    <ListCardTitle>
                                        {(
                                            groupName.charAt(0).toUpperCase() + groupName.slice(1)
                                        ).replace(/_/g, " ")}
                                    </ListCardTitle>
                                    <ListCardSubtitle data-automation="data-automation-box-subtitle">
                                        {`${group.TotalSegments} `}
                                        {translate("conversion.homepage.customgroup.segment")}
                                        <ListCardBullet />
                                        {translate("conversion.homepage.customgroup.duration")}
                                        <ListCardBullet />
                                        <ListCardCountryIcon>
                                            <SWReactIcons iconName={"desktop"} />
                                        </ListCardCountryIcon>
                                        {translate("toggler.title.desktop")}
                                        <ListCardBullet />
                                        <ListCardCountryIcon>
                                            <SWReactCountryIcons
                                                countryCode={_.get(group, "country.id")}
                                            />
                                        </ListCardCountryIcon>
                                        {_.get(group, "country.text")}
                                    </ListCardSubtitle>
                                </ListCardHeaderContainer>
                                <ListCardTableContainer>
                                    <MiniFlexTable
                                        data={_.get(group, "TopSegments", [])
                                            .slice(0, TOP_SEGMENTS_COUNT)
                                            .map((segment) => ({
                                                ...segment,
                                                GroupId: group.GroupId,
                                            }))}
                                        columns={getCustomGroupsColumnsConfig(
                                            translate,
                                            track,
                                            segments,
                                        )}
                                    />
                                </ListCardTableContainer>
                                <CustomGroupButtonContainer>
                                    <Button
                                        type={"flat"}
                                        onClick={() => {
                                            track(
                                                "Internal link",
                                                "click",
                                                `My custom groups/Analyze group/${groupName}`,
                                            );
                                            group.onGroupClick();
                                        }}
                                    >
                                        {translate("conversion.homepage.customgraoup.analyze")}
                                    </Button>
                                </CustomGroupButtonContainer>
                            </TileWrapper>
                        );
                    })}
                </TilesContainer>
            );
        }}
    </WithAllContexts>
);
