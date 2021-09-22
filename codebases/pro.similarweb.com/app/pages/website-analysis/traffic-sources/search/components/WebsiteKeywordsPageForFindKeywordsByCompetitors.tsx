import SWReactRootComponent from "decorators/SWReactRootComponent";
import { WebsiteKeywordsPage } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPage";
import { WebsiteKeywordsPageForFindKeywordsByCompetitorsTableTop } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageForFindKeywordsByCompetitorsTableTop";
import { mapStateToProps } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageUtillities";
import React from "react";
import { connect } from "react-redux";

export const WebsiteKeywordsPageForFindKeywordsByCompetitors = (props) => {
    return (
        <WebsiteKeywordsPage
            tableTopComponent={WebsiteKeywordsPageForFindKeywordsByCompetitorsTableTop}
        />
    );
};

SWReactRootComponent(
    connect(mapStateToProps)(WebsiteKeywordsPageForFindKeywordsByCompetitors),
    "WebsiteKeywordsPageForFindKeywordsByCompetitors",
);
