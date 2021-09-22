const config = {
    grow: {
        abstract: true,
        parent: "sw",
        templateUrl: "/app/pages/grow-homepage/index.html",
    },
    growHomepage: {
        parent: "sw",
        url: "/tools",
        templateUrl: "/app/pages/grow-homepage/grow-homepage.html",
        data: {
            menuKbItems: null,
        },
        pageId: {
            section: "tools",
            subSection: "home",
        },
        trackingId: {
            section: "tools",
            subSection: "home",
        },
        pageTitle: "tools.homepage.title",
    },
};
export default config;
