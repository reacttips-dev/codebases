import { Injector } from "common/ioc/Injector";

export const addToDashboard = ({
    webSource,
    type,
    metric,
    filters,
    onOpen = () => null,
    modelType = undefined,
    overrideAddToDashboardParams = {},
}: {
    type: string;
    metric: string;
    webSource?: string;
    filters?: Record<string, any> & { filter?: string };
    onOpen?: (modalRef) => void;
    modelType?: "fromKeyword" | "fromWebsite" | "fromMobile" | undefined;
    overrideAddToDashboardParams?: Record<string, any>;
}) => {
    const $widgetModelAdapterService = Injector.get<any>("widgetModelAdapterService");
    const $modal = Injector.get<any>("$modal");
    const $rootScope = Injector.get<any>("$rootScope");

    const getCustomModel = () => {
        const model = modelType
            ? $widgetModelAdapterService[modelType](metric, type, webSource, undefined, filters)
            : {
                  metric,
                  type,
                  webSource,
                  filters,
              };
        return {
            ...model,
            ...overrideAddToDashboardParams,
        };
    };

    const addToDashboardModal = $modal.open({
        animation: true,
        controller: "widgetAddToDashboardController as ctrl",
        templateUrl: "/app/components/widget/widget-add-to-dashboard-modal.html",
        windowClass: "add-to-dashboard-modal",
        resolve: {
            widget: () => null,
            customModel: getCustomModel,
        },
        scope: $rootScope.$new(true),
    });
    onOpen(addToDashboardModal);
    return addToDashboardModal;
};
