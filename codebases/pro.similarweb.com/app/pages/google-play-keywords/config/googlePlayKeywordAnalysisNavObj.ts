import { applyNavItemPermissions } from "../../workspace/common/workspacesUtils";

export const navObj = () => ({
    navList: [
        {
            name: "keywords",
            title: "sidebar.keywordcompetitors.title",
            // title: 'sidebar.keywords.title',
            subItems: [
                {
                    name: "analysis",
                    title: "sidebar.keywordcompetitors.organic.title",
                    // title: 'sidebar.keywords-analysis.title',
                    state: "keywords-analysis",
                },
            ],
        },
    ].map(applyNavItemPermissions),
});
