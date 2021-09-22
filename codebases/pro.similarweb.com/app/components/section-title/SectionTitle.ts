/**
 * Created by liorb on 4/3/2017.
 */
import angular from "angular";
class sectionTitle implements angular.IComponentOptions {
    public bindings = {
        title: "@",
    };
    public template = `<div class="widgets-section-title" ng-cloak>{{ctrl._title}}<div class="divider" ng-if="ctrl._title"></div>`;
    public controllerAs = "ctrl";
    public controller = function (i18nFilter) {
        this._title = i18nFilter(this.title);
    };
}

class halfSectionTitle extends sectionTitle {
    public template = `<div class="widgets-section-title u-full-width" ng-cloak>{{ctrl._title}}<div class="divider" ng-if="ctrl._title"></div></div>`;
}

angular.module("sw.common").component("sectionTitle", new sectionTitle());
angular.module("sw.common").component("halfSectionTitle", new halfSectionTitle());
