import { FC } from "react";
import { i18nFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { AdNetworksTableSingle } from "pages/website-analysis/traffic-sources/display-ads/ad-networks/AdNetworksTableSingle";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { AdNetworksTableCompare } from "pages/website-analysis/traffic-sources/display-ads/ad-networks/AdNetworksTableCompare";
import { I18NFilter } from "filters/ngFilters.types";

export interface IAdNetworksTableProps {
    i18n: I18NFilter;
    applyUpdateParams: any;
    params: any;
    rootScopeNew: any;
    openModal: any;
    widgetModelAdapterServiceFromWebsite: any;
}

const AdNetworksContainer: FC = () => {
    const i18n = i18nFilter();
    const swNavigator = Injector.get<any>("swNavigator");
    const params = swNavigator.getParams();
    const $modal = Injector.get<any>("$modal");
    const $rootScope = Injector.get<any>("$rootScope");
    const widgetModelAdapterService = Injector.get<any>("widgetModelAdapterService");
    const isCompare = params.key.split(",").length > 1;

    const commonProps = {
        i18n,
        applyUpdateParams: swNavigator.applyUpdateParams.bind(swNavigator),
        rootScopeNew: $rootScope.$new.bind($rootScope),
        params,
        openModal: $modal.open.bind($modal),
        widgetModelAdapterServiceFromWebsite: widgetModelAdapterService.fromWebsite.bind(
            widgetModelAdapterService,
        ),
    };

    return isCompare ? (
        <AdNetworksTableCompare {...commonProps} />
    ) : (
        <AdNetworksTableSingle {...commonProps} />
    );
};

export default SWReactRootComponent(AdNetworksContainer, "AdNetworksContainer");
