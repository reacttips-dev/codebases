import { IPromise } from "angular";
import { ICategoriesResponse } from "pages/lead-generator/lead-generator-new/components/filters/TechnographicsBoxFilter";
import React from "react";
import { IWorkspaceContainerProps } from "../../../../app/pages/workspace/common/types";
import { ICountryObject } from "../../../../app/services/CountryService";

interface ITranslationMapper {
    [key: string]: string;
}

export type workspaceContextType = IWorkspaceContainerProps & {
    getCountryById: (country: number) => ICountryObject;
    onFetchRecommendations: () => void;
    translate: (key: string, mapper?: ITranslationMapper) => string;
    getTeLink: (site: string, country: number) => string;
    getMcLink: (site: string, country: number) => string;
    setFeedback: (id: string, type: string, text: string) => void;
    getAssetsUrl: (img: string) => string;
    fetchTechnologies(): IPromise<ICategoriesResponse>;
    isFeatureEnabled: (feature: string) => boolean;
};

export const WorkspaceContext = React.createContext({
    getCountryById: (id) => {
        switch (id) {
            case 999:
                return "WorldWide";
            case 840:
                return "United States";
        }
    },
    translate: (key, obj = {}) => {
        let val = "";
        switch (key) {
            case "workspace.feed_sidebar.total_monthly_visits_spiked":
                val =
                    "Traffic for %domain% in <b>%country%</b> has spiked by <b>%change% in the past month</b>";
                break;
            case "workspace.feed_sidebar.total_monthly_visits_dropped":
                val =
                    "Traffic for %domain% in <b>%country%</b> has dropped by <b>%change% in the past month</b>";
                break;
            case "workspace.feed_sidebar_wa_link_text":
                val = "see website analysis";
                break;
        }
        return val.replace(/%(.+?)%/g, (fullMatch, subMatch) => obj[subMatch] || "");
    },
    getTeLink: (site, country) =>
        `https://pro.similarweb.com/#/website/audience-overview/${site}/*/${country}/3m?webSource=Total`,
    getMcLink: (site, country) =>
        `https://pro.similarweb.com/#/website/traffic-overview/${site}/*/${country}/3m?category=no-category`,
    setFeedback: (id, type, text) => null,
    fetchTechnologies: () => Promise.resolve({ categories: null }),
    isFeatureEnabled: (feature) => false,
} as any);
