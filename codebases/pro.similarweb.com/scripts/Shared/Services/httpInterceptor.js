import angular from "angular";

angular.module("shared").factory("sw_httpInterceptor", function ($q) {
    return {
        responseError: function (rejection) {
            var redirect = rejection.headers("SGRedirect");
            if (rejection.status === 403) {
                if (redirect === "Reload") {
                    window.location.reload();
                    return;
                } else {
                    window.location = redirect || similarweb.settings.swsites.login_handler;
                    return;
                }
            }
            return $q.reject(rejection);
        },
    };
});
