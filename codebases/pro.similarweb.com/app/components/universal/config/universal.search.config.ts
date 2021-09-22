import { PageId } from "userdata";
export type AutoCompleteRelatedPages = {
    websitePageIds: PageId[];
    appGooglePageIds: PageId[];
    appApplePageIds: PageId[];
};

var pages: AutoCompleteRelatedPages = {
    websitePageIds: [
        {
            section: "website",
            subSection: "traffic",
            subSubSection: "overview",
        },
        {
            section: "website",
            subSection: "audience",
            subSubSection: "interests",
        },
        {
            section: "website",
            subSection: "destination",
            subSubSection: "outgoing",
        },
        {
            section: "website",
            subSection: "competitors",
            subSubSection: "similarsites",
        },
    ],
    appGooglePageIds: [
        {
            section: "apps",
            subSection: "audience",
            subSubSection: "affinity",
        },
        {
            section: "apps",
            subSection: "engagement",
            subSubSection: "retention",
        },
        {
            section: "apps",
            subSection: "storepage",
            subSubSection: "instorekeywords",
        },
    ],
    appApplePageIds: [
        {
            section: "apps",
            subSection: "storepage",
            subSubSection: "instorekeywords",
        },
    ],
};
export const RELATED_SEARCH = pages;
