import angular from "angular";
import swLog from "@similarweb/sw-log";
import { icons } from "@similarweb/icons";

angular.module("sw.common").directive("swTitelize", function ($filter) {
    var titalizeTooltiped = function (el, title, toolTipKey, toolTip, attrs) {
        var toolTipEl = `<span class="swHeader-tooltip scss-tooltip scss-tooltip--s" data-scss-tooltip="${toolTip}"><span class="fixed-icon-height">${icons["info"]}</span></span>`;

        if ("swTitelizeTooltipOnly" in attrs) {
            if (toolTip && toolTip !== toolTipKey) {
                el.append(toolTipEl);
            }
        } else {
            var contentSuffix = toolTip && toolTip !== toolTipKey ? toolTipEl : "";
            el.html(title + contentSuffix);
        }
    };

    return {
        restrict: "A",
        link: function (scope, el, attrs) {
            var keyAndParams, key, params, obj;

            var parseParams = function () {
                keyAndParams = attrs.swTitelize.split(",");
                key = keyAndParams.shift();
                params = keyAndParams;
                obj = {};

                if (params) {
                    angular.forEach(params, function (val, index) {
                        var keyVal = val.split("=");
                        obj[keyVal[0]] = decodeURIComponent(keyVal[1]);
                    });
                }
            };
            parseParams();

            var run = function () {
                if (!key) {
                    swLog.error("%c missing key ", "color: #fff; background: red;", el[0]);
                }
                var toolTipKey = key + ".tooltip";
                var title = $filter("i18n")(key, obj);
                var toolTip = $filter("i18n")(toolTipKey, obj);
                var tabIcon = attrs.swTitelizeTabIcon;
                var opt = [el, title, toolTipKey, toolTip, attrs];
                var options = {
                    icon: {
                        test: function () {
                            return el.is("h1,h2,h3,h4,h5");
                        },
                        action: function () {
                            titalizeTooltiped.apply(this, opt);
                        },
                    },
                    noIcon: {
                        test: function () {
                            return el.is('input[type="text"]');
                        },
                        action: function () {
                            el.attr("title", title);
                        },
                    },
                    button: {
                        test: function () {
                            return el.is("button");
                        },
                        action: function () {
                            el.text(title);
                            if (toolTipKey !== toolTip) {
                                el.attr("title", toolTip);
                            }
                        },
                    },
                    span: {
                        test: function () {
                            return el.is("span") && el.find("input").length;
                        },
                        action: function () {
                            if (toolTipKey !== toolTip) {
                                toolTipKey = attrs.swTitelizeFallback + ".tooltip";
                                toolTip = $filter("i18n")(attrs.swTitelizeFallback + ".tooltip");
                            }

                            if (toolTipKey !== toolTip) {
                                el.attr("title", title);
                            }
                        },
                    },
                    tableHeader: {
                        test: function () {
                            return el.is("span.sw-header-title, div.sw-header-title");
                        },
                        action: function () {
                            var titleElement = 1;
                            opt[titleElement] =
                                '<span class="sw-header-text">' + opt[titleElement] + "</span>";
                            titalizeTooltiped.apply(this, opt);
                        },
                    },
                    mainHeader: {
                        test: function () {
                            return el.is("th.sw-main-header");
                        },
                        action: function () {
                            titalizeTooltiped.apply(this, opt);
                        },
                    },
                };

                for (var k in options) {
                    if (options[k].test()) {
                        options[k].action();
                        break;
                    }
                }

                if (tabIcon) {
                    el.prepend('<i class="tab-icon sw-icon-' + tabIcon + '"></i>');
                }
            };

            run();
            scope.$watch("query.key", function (value, oldValue) {
                if (value !== oldValue) {
                    obj.site = value;
                    run();
                }
            });

            scope.$watch(
                function (scope) {
                    return attrs.swTitelize;
                },
                function () {
                    parseParams();
                    run();
                },
            );
        },
    };
});
