import { SWReactIcons } from "@similarweb/icons";
import { SearchKeywordCell, TrafficShare } from "components/React/Table/cells";
import { i18nFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import {
    CloseIconButton,
    ToggleIconButton,
} from "pages/website-analysis/incoming-traffic/StyledComponents";
import CountryService from "services/CountryService";
import styled from "styled-components";
import { buttonTypes } from "UtilitiesAndConstants/Constants/ButtonTypes";
import { iconTypes } from "UtilitiesAndConstants/Constants/IconTypes";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import {
    GOOGLE_TRENDS_DATE_FORMAT,
    GoogleTrends,
} from "UtilitiesAndConstants/UtilitiesComponents/GoogleTrends";

const TitleComponentsContainer = styled.div`
    display: grid;
    grid-template-columns: 3% 30% 63% 5%;
    padding: 10px 20px;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;

const SubTitleComponentsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;

const TrafficShareContainer = styled.div`
    width: 100px;
`;

const Text = styled.span`
    ${mixins.setFont({ $size: 12, $weight: 500, $color: rgba(colorsPalettes.carbon[500], 0.6) })};
`;

const KeywordContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const Header = styled.span`
    ${mixins.setFont({ $size: 16, $weight: 500, $color: rgba(colorsPalettes.carbon[500], 1) })};
`;
const A = styled.a`
    ${setFont({ $size: 14, $weight: 500 })};
    text-transform: uppercase;
    cursor: pointer;
`;
const Icon = styled(SWReactIcons)`
    svg {
        height: 16px;
        width: 16px;
        path {
            fill: ${colorsPalettes.blue[400]};
        }
    }
    padding-right: 4px;
    padding-top: 2px;
    cursor: pointer;
`;

const GoogleTrendsContainer = styled.div`
    height: 472px;
    padding: 22px;
`;

export const SeasonalKeywordsEnrichedRow = (props) => {
    const clickOutsideXButton = () => document.body.click();
    const { row, countryId } = props;
    const { TotalShare: totalShare, SearchTerm: keyword } = row;
    const i18n = i18nFilter();
    const TRAFFIC_SHARE_HEADER_KEY = "keywords.seasonality.table.enrich.traffic.share";
    const GOOGLE_TRENDS_TITLE_KEY = "keywords.seasonality.table.enrich.google.trends.title";
    const GOOGLE_TRENDS_LINK_KEY = "keywords.seasonality.table.enrich.google.trends.link";
    const googleCountryCode = CountryService.getGoogleCountryCodeById(countryId);
    const fourYearsAgo = dayjs.utc(new Date()).subtract(4, "year");
    const today = dayjs.utc(new Date());
    const googleTrendsDateRange = `${fourYearsAgo.format(GOOGLE_TRENDS_DATE_FORMAT)} ${today.format(
        GOOGLE_TRENDS_DATE_FORMAT,
    )}`;
    const googleTrendsLink = `https://trends.google.com/trends/explore?q=${keyword}&geo=${googleCountryCode}&date=${googleTrendsDateRange}`;
    return (
        <>
            <TitleComponentsContainer>
                <div onClick={clickOutsideXButton}>
                    <ToggleIconButton iconName={iconTypes.CHEV_UP} type={buttonTypes.FLAT} />
                </div>
                <KeywordContainer>
                    <SearchKeywordCell {...props} value={keyword} />
                </KeywordContainer>
                <div>
                    <Text>{i18n(TRAFFIC_SHARE_HEADER_KEY)}</Text>
                    <TrafficShareContainer>
                        <TrafficShare {...props} value={totalShare} />
                    </TrafficShareContainer>
                </div>
                <CloseIconButton
                    type={buttonTypes.FLAT}
                    onClick={clickOutsideXButton}
                    iconName={iconTypes.CLEAR}
                />
            </TitleComponentsContainer>
            <SubTitleComponentsContainer>
                <Header>{i18n(GOOGLE_TRENDS_TITLE_KEY)}</Header>
                <a
                    style={{ display: "flex" }}
                    target="_blank"
                    rel="noreferrer"
                    href={googleTrendsLink}
                >
                    <Icon iconName={iconTypes.LINK_OUT} />
                    <A>{i18n(GOOGLE_TRENDS_LINK_KEY)}</A>
                </a>
            </SubTitleComponentsContainer>
            <GoogleTrendsContainer>
                <GoogleTrends
                    keyword={keyword}
                    countryId={countryId}
                    dateRange={{ from: fourYearsAgo, to: today }}
                />
            </GoogleTrendsContainer>
        </>
    );
};
