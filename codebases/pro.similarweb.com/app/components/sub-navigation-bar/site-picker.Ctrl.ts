/**
 * Created by olegg on 08-Jun-17.
 */
import angular from "angular";
import { i18nFilter } from "../../filters/ngFilters";
import * as _ from "lodash";
import { SwTrack } from "services/SwTrack";

export class websitePickerCtrl {
    public siteUrl;
    public site;
    public isCompare;
    public openCompare;
    public compareList;
    public removeCompareMain;
    public getBtnText;

    constructor(chosenSites, $rootScope, $modal, swNavigator) {
        const ctrl = this;

        ctrl.siteUrl = function () {
            let siteName;
            if (chosenSites.isPrimaryVirtual()) {
                siteName = "";
            } else {
                siteName = chosenSites.getPrimarySite().name || "";
            }
            return siteName && "http://" + siteName;
        };

        ctrl.site = chosenSites.getPrimarySite();
        ctrl.site.color = chosenSites.getSiteColor(ctrl.site.displayName);
        ctrl.isCompare = function () {
            return chosenSites.isCompare();
        };

        ctrl.openCompare = function () {
            SwTrack.all.trackEvent("Compare", "open", "Header");
            $modal.open({
                templateUrl: "/partials/websites/modal-compare.html",
                controller: "ModalCompareInstanceCtrl",
                controllerAs: "ctrl",
            });
        };

        ctrl.compareList = function () {
            const competitors = _.map($rootScope.global.compare.list, (competitor: string) => {
                const res = chosenSites.listInfo[competitor];
                if (res) {
                    res.color = chosenSites.getSiteColor(competitor);
                }
                return res;
                // return {
                //     ...chosenSites.listInfo[competitor],
                //     color: chosenSites.getSiteColor(competitor)
                // }
                // return chosenSites.listInfo[competitor];
            });
            return competitors;
        };

        ctrl.removeCompareMain = function (item) {
            chosenSites.removeItem(item);
            swNavigator.updateParams({ key: chosenSites.get() });
        };

        ctrl.getBtnText = function () {
            if (ctrl.compareList.length == 5) {
                return i18nFilter()("analysis.header.btn.edit");
            } else {
                return i18nFilter()("analysis.header.btn");
            }
        };
    }
}

angular
    .module("websiteAnalysis")
    .controller(
        "sitePickerController",
        websitePickerCtrl as ng.Injectable<ng.IControllerConstructor>,
    );
