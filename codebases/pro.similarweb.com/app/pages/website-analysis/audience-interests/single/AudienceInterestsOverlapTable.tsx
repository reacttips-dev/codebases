import { colorsPalettes, rgba } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { OverlapTableStyled } from "@similarweb/ui-components/dist/overlap-table";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { Pill, PillStyled } from "components/Pill/Pill";
import { i18nFilter } from "filters/ngFilters";
import { overlapTableDataFetcher } from "pages/website-analysis/audience-interests/single/AudienceInterestsOverlapTableService";
import { AudienceInterestsOverlapTableTooltip } from "pages/website-analysis/audience-interests/single/AudienceInterestsOverlapTableTooltip";
import {
    Separator,
    Title,
} from "pages/website-analysis/audience-interests/single/AudienceInterestsTableTop/AudienceInterestsTableTopStyles";
import * as React from "react";
import { useEffect, useState } from "react";
import { PrimaryBoxTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";

const AudienceInterestsOverlapTableWrapper = styled.div`
    border-radius: 6px;
    background-color: ${colorsPalettes.carbon["0"]};
    box-shadow: 0 3px 6px 0 ${rgba(colorsPalettes.midnight[600], 0.08)};
    margin-bottom: 16px;
    ${PillStyled} {
        margin-left: 10px;
        margin-top: 4px;
        background-color: ${colorsPalettes.orange["400"]};
        font-size: 8px;
    }
`;
const OverlapTableContainer = styled.div<{ withButton: boolean }>`
    padding: ${({ withButton }) => (withButton ? "32px 32px 8px 32px" : "32px")};
`;
const AudienceInterestsOverlapTableFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 8px 0 0;
`;
export const AudienceInterestsOverlapTable = (props) => {
    const i18n = i18nFilter();
    const [overlapTableData, setOverlapTableData] = useState({ tableData: [], changeData: {} });
    const {
        chosenSites,
        getCountryById,
        country,
        duration,
        isWWW,
        onOverlapTableSelect,
        openCompareModal,
        webSource,
    } = props;
    const { from, to, isWindow } = duration;
    const icons = {};
    const keysForApi = chosenSites
        .map((x) => {
            icons[x.name] = x.icon; // Hijacking the loop to populate icons object. Sorry.
            return x.name;
        })
        .join(",");
    const fetcherParams = {
        key: keysForApi,
        isWWW: isWWW !== "*",
        country,
        to,
        from,
        isWindow,
    };

    const transformResults = (results) => {
        const changeData = {};
        const tableData = Object.keys(results).map((domain) => {
            const items = {};
            changeData[domain] = {};
            Object.keys(results).forEach((item) => {
                changeData[domain][item] = results[domain][item]
                    ? results[domain][item].OverlapChange
                    : null;
                items[item] = results[domain][item] ? results[domain][item].Overlap : NaN;
            });
            return { items, value: domain };
        });
        return { tableData, changeData };
    };
    useEffect(() => {
        overlapTableDataFetcher({ params: fetcherParams }).then((results) => {
            setOverlapTableData(transformResults(results));
        });
    }, []);
    const subtitleFilters = [
        {
            filter: "date",
            value: { from, to },
        },
        {
            filter: "country",
            countryCode: country,
            value: getCountryById(country).text,
        },
        {
            filter: "webSource",
            value: webSource,
        },
    ];
    const onItemClick = (item) => {
        onOverlapTableSelect(item.name);
    };

    return (
        <AudienceInterestsOverlapTableWrapper>
            <Title>
                <PrimaryBoxTitle
                    tooltip={i18n("analysis.audience.interests.overlap.table.tooltip")}
                >
                    {i18n("analysis.audience.interests.overlap.table.title")}
                </PrimaryBoxTitle>
            </Title>
            <Separator />
            <OverlapTableContainer withButton={overlapTableData.tableData.length < 5}>
                {overlapTableData.tableData.length > 0 ? (
                    <>
                        <OverlapTableStyled
                            data={overlapTableData.tableData}
                            onItemClick={onItemClick}
                            icons={icons}
                            horizontalTitle={i18n(
                                "analysis.audience.interests.overlap.table.horizontalTitle",
                            )}
                            verticalTitle={i18n(
                                "analysis.audience.interests.overlap.table.verticalTitle",
                            )}
                            getTooltipComponent={({
                                valueHorizontal,
                                valueVertical,
                                value,
                            }) => () => (
                                <AudienceInterestsOverlapTableTooltip
                                    valueHorizontal={valueHorizontal}
                                    valueVertical={valueVertical}
                                    value={value}
                                    changeValue={
                                        overlapTableData.changeData[valueVertical][valueHorizontal]
                                    }
                                />
                            )}
                        />
                        {overlapTableData.tableData.length < 5 && (
                            <AudienceInterestsOverlapTableFooter>
                                <Button type="flat" onClick={openCompareModal}>
                                    {i18n(
                                        "analysis.audience.interests.overlap.table.add.more.button",
                                    )}
                                </Button>
                            </AudienceInterestsOverlapTableFooter>
                        )}
                    </>
                ) : (
                    <PixelPlaceholderLoader width={"100%"} height={"324px"} />
                )}
            </OverlapTableContainer>
        </AudienceInterestsOverlapTableWrapper>
    );
};
