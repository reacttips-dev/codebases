import { SWReactCountryIcons } from "@similarweb/icons";
import { TrendCell } from "components/React/Table/cells";
import { countryTextByIdFilter, i18nFilter } from "filters/ngFilters";
import React from "react";
import {
    CategoriesTableDomainContainer,
    CountriesTableHeaderContainer,
    CountriesTableRowContainer,
    CountryIcon,
    Text,
    TopCountriesCountryContainer,
    TopCountriesTrendCellContainer,
    TrafficShareText,
    TrafficShareTopCategoriesContainer,
} from "../../pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";

const ColumnHeaderSize = 12;

export const TopCountriesTable = (props) => {
    const countriesTopShow = props.data.slice(0, 5);
    const i18n = i18nFilter();

    const TableRow = (row, index) => {
        const { Country: country, TrafficTrend: trafficTrend } = row;
        const trendData = trafficTrend.map((item) => {
            return {
                key: item.Yearmonth,
                Value: item.Traffic,
            };
        });
        return (
            <CountriesTableRowContainer key={index}>
                <TopCountriesCountryContainer>
                    <CountryIcon>
                        <SWReactCountryIcons countryCode={country} size={"xs"} />
                    </CountryIcon>
                    <Text>{countryTextByIdFilter()(country)}</Text>
                </TopCountriesCountryContainer>
                <TopCountriesTrendCellContainer>
                    <TrendCell value={trendData} row={{ filed: undefined }} />
                </TopCountriesTrendCellContainer>
            </CountriesTableRowContainer>
        );
    };

    const CountriesTableInner = () => {
        return (
            <>
                <CountriesTableHeaderContainer>
                    <CategoriesTableDomainContainer>
                        <Text fontSize={ColumnHeaderSize}>
                            {i18n("keyword.analysis.overview.topCountries.Country.column")}
                        </Text>
                    </CategoriesTableDomainContainer>
                    <TrafficShareTopCategoriesContainer>
                        <TrafficShareText fontSize={ColumnHeaderSize}>
                            {i18n("keyword.analysis.overview.topCountries.TrafficTrend.column")}
                        </TrafficShareText>
                    </TrafficShareTopCategoriesContainer>
                </CountriesTableHeaderContainer>
                {countriesTopShow.map(TableRow)}
            </>
        );
    };

    return (
        <div>
            <CountriesTableInner />
        </div>
    );
};
