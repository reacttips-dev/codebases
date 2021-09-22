import angular from "angular";

export interface IAppSelectionResourceService {
    saveAppSelectedAndCompetingApps: (payload) => angular.IPromise<any>;
}

angular
    .module("sw.common")
    .factory("appSelectionResourceService", function ($resource): IAppSelectionResourceService {
        const appSelectionUrl = "/connectgoogleplayaccount/save-selected-apps";

        const service: IAppSelectionResourceService = {
            saveAppSelectedAndCompetingApps: function (payload) {
                return $resource(appSelectionUrl, {}, {}).save(payload).$promise;
            },
        };

        return service;
    });
