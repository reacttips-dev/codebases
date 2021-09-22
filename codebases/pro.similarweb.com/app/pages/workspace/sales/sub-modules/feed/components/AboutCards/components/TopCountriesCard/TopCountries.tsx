import React, { useState, useEffect } from "react";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { Tab, TabList, Tabs, TabPanel } from "@similarweb/ui-components/dist/tabs";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import {
    CardContainer,
    TopGeoSubtitle,
    WebSource,
    Icon,
    InnerTabTittle,
    TitleWrapper,
} from "../../styles";
import { TitleContainer } from "../SiteInfo/styles";
import { commonWebSources } from "../../../../../../../../../../app/components/filters-bar/utils";
import { PrimaryBoxTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import {
    TOP_COUNTRIES_PAGE_SIZE,
    topCountriesCols,
    HEADER_TOOLTIPS,
    NO_DATA_ICON,
    INFO_ICON,
    TAB_PANEL_CLASS,
    EMPTY_TOP_COUNTRY_CLASS,
    TOP_COUNTRIES_CLASS,
    DAILY_RANKING_ICON,
} from "./consts";
import {
    TOP_COUNTRIES_TITLE,
    TOP_COUNTRIES_TAB_GROWTH,
    TOP_COUNTRIES_TAB_SHARE,
    TOP_COUNTRIES_EMPTY_SUBTITLE,
    TOP_COUNTRIES_EMPTY_TITLE,
} from "../../../../constants";
import { TopTabs } from "../../consts";
import { prepareDateTopCountriesLastSnapshotDate } from "../../../../../../helpers";
import { TTopCountries, TopCountriesProps } from "../../../../types/topCountries";
import EmptyState from "../../../../../benchmarks/components/BenchmarksEmptyState/BenchmarksEmptyState";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import useRightSidebarTrackingService from "pages/sales-intelligence/hooks/useRightSidebarTrackingService";
import { TOPICS_TRANSLATION_KEY } from "pages/workspace/sales/sub-modules/benchmarks/constants";
import { TopCountriesPagination } from "./WrappedPagination";
import { prepareCountries } from "./utils";
import { mapOnObjectKeys } from "pages/workspace/sales/utils/object";

export const TopCountries = ({ topCountries, topic }: TopCountriesProps): JSX.Element => {
    const translate = useTranslation();

    const [currentTabIdx, setCurrentTabIdx] = useState(0);
    const [data, setData] = useState<TTopCountries[]>([]);

    const salesSettings = useSalesSettingsHelper();
    const sidebarTrackingService = useRightSidebarTrackingService();
    const lastSnapshotDate = salesSettings.getLastSnapshotDate();

    const { desktop } = commonWebSources;
    const { icon, text } = desktop();

    useEffect(() => {
        // Setting current tab to prepare correct data next
        const currentTabName = TopTabs[currentTabIdx];

        if (topCountries && Object.keys(topCountries).length) {
            const preparedCountries = topCountries[currentTabName].map((type) =>
                prepareCountries[currentTabName](type, translate),
            );
            setData(preparedCountries);
        }
    }, [currentTabIdx, topCountries]);

    const tabClickHandler = (index: number) => {
        sidebarTrackingService.trackAboutTopCountriesTabChanged(
            index === 0 ? translate(TOP_COUNTRIES_TAB_SHARE) : translate(TOP_COUNTRIES_TAB_GROWTH),
            translate(`${TOPICS_TRANSLATION_KEY}.${topic}`),
        );

        setCurrentTabIdx(index);
    };

    const [startDate, endDate] = prepareDateTopCountriesLastSnapshotDate(lastSnapshotDate);

    const renderTabData = mapOnObjectKeys(topCountriesCols, (columnConfig: string) => {
        return (
            <TabPanel className={TAB_PANEL_CLASS}>
                {data.length ? (
                    <MiniFlexTable
                        pagination
                        data={data}
                        columns={topCountriesCols[columnConfig]}
                        pageSize={TOP_COUNTRIES_PAGE_SIZE}
                        paginationComponent={TopCountriesPagination}
                    />
                ) : (
                    <EmptyState
                        className={EMPTY_TOP_COUNTRY_CLASS}
                        title={translate(TOP_COUNTRIES_EMPTY_TITLE)}
                        subtitle={translate(TOP_COUNTRIES_EMPTY_SUBTITLE)}
                        iconName={NO_DATA_ICON}
                    />
                )}
            </TabPanel>
        );
    });

    const renderTabHeader = mapOnObjectKeys(HEADER_TOOLTIPS, (item: string) => (
        <Tab>
            <InnerTabTittle>
                <div>{translate(item)}</div>
                <PlainTooltip placement="top" tooltipContent={translate(HEADER_TOOLTIPS[item])}>
                    <div>
                        <InfoIcon iconName={INFO_ICON} />
                    </div>
                </PlainTooltip>
            </InnerTabTittle>
        </Tab>
    ));

    return (
        <CardContainer className={TOP_COUNTRIES_CLASS}>
            <TitleWrapper>
                <TitleContainer>
                    <PrimaryBoxTitle>{translate(TOP_COUNTRIES_TITLE)}</PrimaryBoxTitle>
                </TitleContainer>
                <TopGeoSubtitle>
                    <Icon iconName={DAILY_RANKING_ICON} size="xs" />
                    <span>
                        {startDate}
                        {" - "}
                        {endDate}
                    </span>
                    <WebSource alignItems="center">
                        <Icon iconName={icon} size="xs" />
                        <span>{text}</span>
                    </WebSource>
                </TopGeoSubtitle>
            </TitleWrapper>
            {topCountries ? (
                <Tabs selectedIndex={currentTabIdx} onSelect={tabClickHandler}>
                    <TabList>{renderTabHeader}</TabList>
                    {renderTabData}
                </Tabs>
            ) : (
                <></>
            )}
        </CardContainer>
    );
};
