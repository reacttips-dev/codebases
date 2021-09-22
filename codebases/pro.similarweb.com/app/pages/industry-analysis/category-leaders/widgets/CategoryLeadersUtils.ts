import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

/**
 * Resolves the target state that should be used as a link when clicking
 * a domain in the table widget.
 */
export const getTableWidgetDomainUrl = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const currentPackage = swNavigator.getPackageName(swNavigator.current());
    switch (currentPackage) {
        case "marketresearch":
            return "companyresearch_website_websiteperformance";
        default:
            return "websites-worldwideOverview";
    }
};
