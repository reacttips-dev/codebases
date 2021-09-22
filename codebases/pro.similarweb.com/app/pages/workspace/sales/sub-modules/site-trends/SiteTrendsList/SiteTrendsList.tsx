import React from "react";
import { connect } from "react-redux";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledLink, StyledSiteTrendsList, StyledSiteTrendsLoadingContainer } from "./styles";
import SiteTrendsItem from "../SiteTrendsItem/SiteTrendsItem";
import {
    selectSiteTrends,
    selectSiteTrendsLoading,
} from "pages/workspace/sales/sub-modules/site-trends/store/selectors";
import { RootState } from "store/types";
import { SiteTrends } from "../types";
import { CircularLoader } from "components/React/CircularLoader";
import { ICountryObject } from "services/CountryService";
import { SITE_TRENDS_TRANSLATION_KEY } from "../constants";

type SiteTrendsListProps = {
    siteTrends: SiteTrends[];
    selectedCountry: ICountryObject;
    linkToBenchmark(): void;
    loading: boolean;
};

//TODO temprary solution before Shany look at
export const circularLoaderOptions = {
    svg: {
        stroke: "#dedede",
        strokeWidth: "4",
        r: 21,
        cx: "50%",
        cy: "50%",
    },
    style: {
        width: 46,
        height: 46,
    },
};

const SiteTrendsList: React.FC<SiteTrendsListProps> = (props) => {
    const { siteTrends, selectedCountry, loading, linkToBenchmark } = props;
    const translate = useTranslation();

    const renderContent = () => {
        if (loading) {
            return (
                <StyledSiteTrendsLoadingContainer>
                    <CircularLoader options={circularLoaderOptions} />
                </StyledSiteTrendsLoadingContainer>
            );
        }
        return (
            <>
                {siteTrends.map(({ metric, trend, webSource, units }) => (
                    <SiteTrendsItem
                        key={metric}
                        metric={metric}
                        trend={trend}
                        units={units}
                        webSource={webSource}
                        country={selectedCountry}
                    />
                ))}
                <StyledLink>
                    <a onClick={linkToBenchmark} target="_blank">
                        <IconButton type="flat" iconName="arrow-right" placement="right">
                            {translate(`${SITE_TRENDS_TRANSLATION_KEY}.button.link_to_benchmark`)}
                        </IconButton>
                    </a>
                </StyledLink>
            </>
        );
    };

    return <StyledSiteTrendsList>{renderContent()}</StyledSiteTrendsList>;
};

const mapStateToProps = (state: RootState) => ({
    siteTrends: selectSiteTrends(state),
    loading: selectSiteTrendsLoading(state),
});

export default connect(mapStateToProps)(React.memo(SiteTrendsList));
