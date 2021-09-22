import angular from "angular";
import { swSettings } from "common/services/swSettings";

/**
 * Created by Eyal.Albilia on 12/11/2016.
 */

export interface IConnectedAssetsService {
    isShowEstimationsVsGaToggle: (domains: string) => boolean;
}

abstract class AbstractConnectedAssetsService implements IConnectedAssetsService {
    constructor(
        protected swSettings: any,
        protected swNavigator,
        protected sitesResource,
        protected $q,
    ) {}

    private getDomainsGAStatus(domains: string) {
        //Helper function to get domains data from server in Order to decide if ga is available per domain
        let domainsGaStatus = [];
        var deffered = this.$q.defer();
        if (domains == undefined) {
            deffered.resolve(domainsGaStatus);
        }
        let domainsArr = domains.split(",");
        this.sitesResource.getSiteInfo({ keys: domains }, (data) => {
            domainsArr.forEach((domain) => {
                if (data[domain]) {
                    domainsGaStatus.push({
                        domain: domain,
                        privacyStatus: data[domain].privacyStatus,
                        hasGaToken: data[domain].hasGaToken,
                    });
                }
            });
            deffered.resolve(domainsGaStatus);
        });
        return deffered;
    }

    isShowEstimationsVsGaToggle(domains: string) {
        let currentPageGASupported = !!this.swNavigator.current().data.gaSupport;
        var deffered = this.$q.defer();
        if (currentPageGASupported) {
            this.getDomainsGAStatus(domains).promise.then((domainsStatus) => {
                for (var i = 0; i < domainsStatus.length; i++) {
                    let currentStatus = domainsStatus[i];
                    if (currentStatus && currentStatus.hasGaToken) {
                        deffered.resolve(true);
                    }
                }
                deffered.resolve(false);
            });
        } else {
            deffered.resolve(currentPageGASupported);
        }
        return deffered;
    }
}

class ConnectedAssetsService extends AbstractConnectedAssetsService {
    constructor(public swSettings: any, public swNavigator, public sitesResource, protected $q) {
        super(swSettings, swNavigator, sitesResource, $q);
    }
}

angular
    .module("sw.common")
    .factory("swConnectedAssetsService", function (swNavigator, $q, sitesResource) {
        var service = new ConnectedAssetsService(swSettings, swNavigator, sitesResource, $q);
        return service;
    });
