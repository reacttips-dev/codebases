import angular from "angular";
/**
 * Created by YoavS on 12/1/2016.
 */
const widgetMenuComponent: angular.IComponentOptions = {
    bindings: {
        widget: "=",
    },
    template: `
            <button class="widget-list-height-toggle" ng-click="$ctrl.resize()">{{$ctrl.title}}</button>
        `,
    controller: function (i18nFilter) {
        let ctrl = this;
        if (!ctrl.widget.pos) return;
        let i18n = {
            more: i18nFilter("widget.table.resize.more"),
            less: i18nFilter("widget.table.resize.less"),
        };
        ctrl.height = ctrl.widget.pos.sizeY || 1;
        ctrl.title = ctrl.height == 1 ? i18n.more : i18n.less;
        ctrl.resize = function () {
            if (ctrl.height == 1) {
                ctrl.title = i18n.less;
                ctrl.height = 2;
            } else {
                ctrl.title = i18n.more;
                ctrl.height = 1;
            }
            setTimeout(function () {
                let layoutElement = $(".layout-stage");
                if (!layoutElement.hasClass("presentation-mode")) {
                    let widgetElement = $("#" + ctrl.widget.id),
                        distance = layoutElement.scrollTop() + widgetElement.offset().top - 115,
                        delay = distance / 10;
                    layoutElement.animate(
                        {
                            scrollTop: distance,
                        },
                        delay < 700 ? 700 : delay,
                    ); //speed is dependant on the distance from the top
                }
            }, 1);
            Object.assign(ctrl.widget.pos, { sizeY: ctrl.height });
        };
    },
};

angular.module("sw.common").component("swWidgetResize", widgetMenuComponent);
