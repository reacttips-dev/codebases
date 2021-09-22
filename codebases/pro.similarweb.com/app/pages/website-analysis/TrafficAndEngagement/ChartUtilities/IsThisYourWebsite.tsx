import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { Injector } from "common/ioc/Injector";
import { IsThisYourWebsiteButton } from "pages/website-analysis/TrafficAndEngagement/Components/StyledComponents";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { allTrackers } from "services/track/track";

export const IsThisYourWebsite = () => {
    const onClick = () => {
        const $modal = Injector.get<any>("$modal");
        allTrackers.trackEvent("Connect GA", "open", `Connect GA`);
        $modal.open({
            templateUrl: "/app/components/GA-verify/ga-wizard.html",
            controller: "gaVerifyModalCtrl",
            windowClass: "ga-modal",
        });
    };
    const i18n = i18nFilter();
    return (
        <PlainTooltip tooltipContent={i18n(`analysis.ga.badge.verify.tooltip`)}>
            <div>
                <IsThisYourWebsiteButton onClick={onClick}>
                    {i18n("analysis.ga.badge.verify")}
                </IsThisYourWebsiteButton>
            </div>
        </PlainTooltip>
    );
};
