import angular from "angular";
/**
 * Created by Yoav_S on 10/11/2016.
 */
const GooglePlayWizardComponent: angular.IComponentOptions = {
    bindings: {
        template: "=",
    },
    templateUrl: "/app/components/google-play-wizard/templates/container.html",
    controller: function (googlePlayService) {},
};

angular.module("sw.common").component("googlePlayWizard", GooglePlayWizardComponent);
