import angular from "angular";
import * as _ from "lodash";

angular.module("sw.common").factory("appStores", function () {
    var stores = [
        {
            name: "Google Play Store",
            key: "google",
            id: 0,
        },
        {
            name: "Apple App Store",
            key: "apple",
            id: 1,
        },
    ];

    return {
        byId: function (id) {
            return stores[id];
        },
        byKey: function (key) {
            return _.find(stores, { key: key });
        },
        all: function () {
            return stores;
        },
    };
});
