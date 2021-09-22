import angular from "angular";
import * as _ from "lodash";

angular.module("websiteAnalysis").service("columnsMutator", function ($rootScope, chosenSites) {
    return {
        proccess: function (rawCols) {
            var sites = chosenSites.get(),
                sitesCount = sites.length,
                result = [];

            angular.forEach(rawCols, function (col) {
                if (
                    sitesCount >= (col._minSites || -1) &&
                    sitesCount <= (col._maxSites === undefined ? Infinity : col._maxSites)
                ) {
                    if (col._repeat) {
                        angular.forEach(sites, function (site) {
                            var c = {};
                            angular.forEach(col, function (val, key) {
                                c[key] = val === "%site" ? site : val;
                            });
                            result.push(c);
                        });
                    } else {
                        result.push(col);
                    }
                }
            });

            return result;
        },
    };
});
