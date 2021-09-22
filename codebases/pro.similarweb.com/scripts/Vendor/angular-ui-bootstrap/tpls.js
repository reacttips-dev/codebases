import angular from "angular";
import * as _ from "lodash";

angular.module("ui.bootstrap.tpls", [
    "template/accordion/accordion-group.html",
    "template/accordion/accordion.html",
    "template/modal/backdrop.html",
    "template/modal/window.html",
    "template/tabs/tab.html",
    "template/tabs/tabset-titles.html",
    "template/tabs/tabset.html",
    "template/typeahead/typeahead-popup-presets.html",
    "template/typeahead/typeahead-match.html",
    "template/typeahead/typeahead-popup.html",
    "template/popover/popover.html",
    "template/popover/popover-window.html",
    "template/popover/popover-template.html",
    "template/tooltip/tooltip-html-popup.html",
    "template/tooltip/tooltip-popup.html",
    "template/tooltip/tooltip-html-unsafe-popup.html",
    "template/tooltip/tooltip-template-popup.html",
]);

angular.module("template/modal/backdrop.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/modal/backdrop.html",
            '<div class="modal-backdrop"' +
                'modal-animation-class="fade"' +
                'modal-in-class="in"' +
                "ng-style=\"{'z-index': 1140 + (index && 1 || 0) + index*10}\">" +
                "</div>",
        );
    },
]);

angular.module("template/modal/window.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/modal/window.html",
            '<div modal-render="{{$isRendered}}" tabindex="-1" role="dialog" class="modal"' +
                'modal-animation-class="fade"' +
                'modal-in-class="in"' +
                "ng-style=\"{'z-index': 1150 + index*10, display: 'block'}\">" +
                "<div class=\"modal-dialog\" ng-class=\"size ? 'modal-' + size : ''\">" +
                '<div class="modal-content" modal-transclude></div></div>' +
                "</div>",
        );
    },
]);

angular.module("template/accordion/accordion-group.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/accordion/accordion-group.html",
            '<div class="accordion-group">\n' +
                '  <div class="accordion-heading" ><a class="accordion-toggle" ng-click="isOpen = !isOpen" accordion-transclude="heading">{{heading}}</a></div>\n' +
                '  <div class="accordion-body" collapse="!isOpen">\n' +
                '    <div class="accordion-inner" ng-transclude></div>  </div>\n' +
                "</div>",
        );
    },
]);

angular.module("template/accordion/accordion.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/accordion/accordion.html",
            '<div class="accordion" ng-transclude></div>',
        );
    },
]);

angular.module("template/tabs/tab.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/tabs/tab.html",
            '<li ng-class="{active: active, disabled: disabled}">\n' +
                '  <a ng-if="!href" href ng-click="select()" uib-tab-heading-transclude>{{heading}}</a>\n' +
                '  <a ng-if="href" ng-href="{{href}}" uib-tab-heading-transclude>{{heading}}</a>\n' +
                "</li>\n" +
                "",
        );
    },
]);

angular.module("template/tabs/tabset-titles.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/tabs/tabset-titles.html",
            "<ul class=\"nav {{type && 'nav-' + type}}\" ng-class=\"{'nav-stacked': vertical}\">\n" +
                "</ul>\n" +
                "",
        );
    },
]);

angular.module("template/tabs/tabset.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/tabs/tabset.html",
            "\n" +
                "<div>" +
                "<ul class=\"nav nav-{{type || 'tabs'}}\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\n" +
                '<div class="tab-content">\n' +
                '     <div class="tab-pane" ng-repeat="tab in tabs" ng-class="{active: tab.active}" uib-tab-content-transclude="tab">\n' +
                "     </div>\n" +
                " </div>\n" +
                "</div>\n" +
                "",
        );
    },
]);

angular.module("template/typeahead/typeahead-match.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/typeahead/typeahead-match.html",
            '<a tabindex="-1" bind-html-unsafe="match.label | typeaheadHighlight:query"></a>',
        );
    },
]);

// SW addition
angular.module("template/typeahead/typeahead-popup.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/typeahead/typeahead-popup.html",
            "<ul class=\"typeahead dropdown-menu\" ng-style=\"{display: isOpen()&&'block' || 'none', top: position.top+'px', left: position.left+'px'}\">\n" +
                '    <li ng-repeat="match in matches" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)">\n' +
                '        <div typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n' +
                "    </li>\n" +
                "</ul>",
        );
    },
]);

// SW addition
angular.module("template/typeahead/typeahead-popup-presets.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/typeahead/typeahead-popup-presets.html",
            "<ul class=\"typeahead dropdown-menu\" ng-show=\"isOpen()\" ng-style=\"{top: position.top+'px', left: position.left+'px', overflowY: 'auto', maxHeight: '220px'}\">\n" +
                '   <li class="sw-similar-seperator sitesAppsSimilar"><span>{{ popupTitle }}</span></li>' +
                '   <li ng-repeat="match in matches" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)">\n' +
                '        <div typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n' +
                "    </li>\n" +
                "</ul>",
        );
    },
]);

//angular.module("template/popover/popover.html", []).run(["$templateCache", function ($templateCache) {
//    $templateCache.put("template/popover/popover.html",
//      "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">" +
//      "  <div class=\"arrow\"></div>" +
//      "  <div class=\"popover-inner\">" +
//      "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>" +
//      "      <div class=\"popover-content\" ng-bind=\"content\"></div>" +
//      "  </div>" +
//      "</div>" +
//      "");
//}]);

angular.module("template/popover/popover-template.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/popover/popover-template.html",
            '<div class="popover"\n' +
                '  tooltip-animation-class="fade"\n' +
                "  tooltip-classes\n" +
                '  ng-class="{ in: isOpen() }">\n' +
                '  <div class="arrow"></div>\n' +
                "\n" +
                '  <div class="popover-inner">\n' +
                '      <h3 class="popover-title" ng-bind="title" ng-if="title"></h3>\n' +
                '      <div class="popover-content"\n' +
                '        tooltip-template-transclude="contentExp()"\n' +
                '        tooltip-template-transclude-scope="originScope()"></div>\n' +
                "  </div>\n" +
                "</div>\n" +
                "",
        );
    },
]);

angular.module("template/popover/popover-window.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/popover/popover-window.html",
            '<div class="popover {{placement}}" ng-class="{ in: isOpen, fade: animation }">\n' +
                '  <div class="arrow"></div>\n' +
                "\n" +
                '  <div class="popover-inner">\n' +
                '      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n' +
                '      <div class="popover-content" tooltip-template-transclude></div>\n' +
                "  </div>\n" +
                "</div>\n" +
                "",
        );
    },
]);

angular.module("template/popover/popover.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/popover/popover.html",
            '<div class="popover"\n' +
                '  tooltip-animation-class="fade"\n' +
                "  tooltip-classes\n" +
                '  ng-class="{ in: isOpen() }">\n' +
                '  <div class="arrow"></div>\n' +
                "\n" +
                '  <div class="popover-inner">\n' +
                '      <h3 class="popover-title" ng-bind="title" ng-if="title"></h3>\n' +
                '      <div class="popover-content" ng-bind="content"></div>\n' +
                "  </div>\n" +
                "</div>\n" +
                "",
        );
    },
]);

angular.module("template/tooltip/tooltip-html-unsafe-popup.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/tooltip/tooltip-html-unsafe-popup.html",
            '<div class="tooltip" tooltip-animation-class="fade" tooltip-classes ng-class="{ in: isOpen() }">' +
                '<div class="tooltip-arrow"></div>' +
                '<div class="tooltip-inner" bind-html-unsafe="content"></div>' +
                "</div>",
        );
    },
]);

angular.module("template/tooltip/tooltip-html-popup.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/tooltip/tooltip-html-popup.html",
            '<div class="tooltip" tooltip-animation-class="fade" tooltip-classes ng-class="{ in: isOpen() }">' +
                '<div class="tooltip-arrow"></div>' +
                '<div class="tooltip-inner" ng-bind-html="contentExp()"></div>' +
                "</div>",
        );
    },
]);
angular.module("template/tooltip/tooltip-popup.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/tooltip/tooltip-popup.html",
            '<div class="tooltip" tooltip-animation-class="fade" tooltip-classes ng-class="{ in: isOpen() }">' +
                '<div class="tooltip-arrow"></div>' +
                '<div class="tooltip-inner" ng-bind="content"></div>' +
                "</div>",
        );
    },
]);

angular.module("template/tooltip/tooltip-template-popup.html", []).run([
    "$templateCache",
    function ($templateCache) {
        $templateCache.put(
            "template/tooltip/tooltip-template-popup.html",
            '<div class="tooltip" tooltip-animation-class="fade" tooltip-classes ng-class="{ in: isOpen() }">' +
                '<div class="tooltip-arrow"></div>' +
                '<div class="tooltip-inner" tooltip-template-transclude="contentExp()" tooltip-template-transclude-scope="originScope()"></div>' +
                "</div>",
        );
    },
]);
