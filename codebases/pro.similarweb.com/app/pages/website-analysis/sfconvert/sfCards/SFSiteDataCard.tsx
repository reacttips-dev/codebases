import { InfoCardWebsite } from "@similarweb/ui-components/dist/info-card";
import { abbrNumberFilter, i18nFilter, prettifyCategoryFilter } from "filters/ngFilters";
import { sfConvertPageContext } from "pages/website-analysis/sfconvert/SfConvertPage";
import { useContext } from "react";
import * as React from "react";
import { AssetsService } from "services/AssetsService";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    & > :first-child {
        box-shadow: none;
        border: 1px solid #e5e7ea;
    }
`;
export const SFSiteDataCard = () => {
    const sfConvertPageState = useContext(sfConvertPageContext);
    const { site, webSource, siteInfo } = sfConvertPageState;
    const getImageSrc = (data) => {
        if (data.category === "Adult") {
            return AssetsService.assetUrl("/images/new-adult-large.png");
        } else {
            return data.image || AssetsService.assetUrl("/images/new-no-image.png");
        }
    };
    return (
        <Container>
            <InfoCardWebsite
                imgSrc={getImageSrc(siteInfo)}
                isLoadingData={false}
                icon={siteInfo.icon ? siteInfo.icon : "/images/autocomplete-default.png"}
                category={prettifyCategoryFilter()(siteInfo.category)}
                websiteName={site}
                countryId={siteInfo.highestTrafficCountry}
                description={
                    siteInfo.description === ""
                        ? i18nFilter()("salesforce.site_header.missing_description")
                        : siteInfo.description
                }
                globalRankingLabel={i18nFilter()("salesforce.site_header.global_rank")}
                globalRanking={
                    siteInfo.globalRanking === 0 ? "-" : abbrNumberFilter()(siteInfo.globalRanking)
                }
                highestTrafficCountryRankingLabel={i18nFilter()(
                    "salesforce.site_header.country_rank",
                )}
                highestTrafficCountryRanking={
                    siteInfo.highestTrafficCountryRanking === 0
                        ? "-"
                        : abbrNumberFilter()(siteInfo.highestTrafficCountryRanking)
                }
                foundedLabel={"Founded"}
                foundedValue={siteInfo.yearFounded}
                monthlyVisits={
                    siteInfo.monthlyVisits === 0 ? "-" : abbrNumberFilter()(siteInfo.monthlyVisits)
                }
                monthlyVisitsLabel={i18nFilter()("salesforce.site_header.visits")}
                employees={siteInfo.employeeRange}
                countryOfVisits={siteInfo.country}
                platform={
                    webSource === "desktop"
                        ? "desktop"
                        : webSource === "mobileWeb"
                        ? "mobile-web"
                        : "combined"
                }
            />
        </Container>
    );
};
