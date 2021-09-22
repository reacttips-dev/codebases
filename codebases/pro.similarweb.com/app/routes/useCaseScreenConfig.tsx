export const useCaseScreenConfig = {
    useCase: {
        abstract: true,
        parent: "sw-empty",
        template: `<div ui-view class="sw-layout-scrollable-element"></div>`,
    },
    "useCase-list": {
        parent: "useCase",
        url: "/usecase",
        template: `
      <sw-react
        component="UseCaseListPage"
      >
      </sw-react>
    `,
        pageId: {
            section: "useCase",
            subSection: "list",
        },
    },
    "useCase-input": {
        parent: "useCase",
        url:
            "/usecase/input?backUrl&websiteTitle&websiteSubtitle&websiteCta&competitorsTitle&competitorsSubTitle&competitorsCta",
        controller: "useCaseInputController",
        template: `
      <sw-react
        component="UseCaseInputPage"
        props="{ routeParams: routeParams }"
      >
      </sw-react>
    `,
        pageId: {
            section: "useCase",
            subSection: "input",
        },
    },
};
