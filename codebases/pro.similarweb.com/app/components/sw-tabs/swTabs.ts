import angular from "angular";
import { IDirectiveFactory } from "angular";
/**
 * Created by Eran.Shain on 5/3/2016.
 */

class TabsContainer {
    private _currentIndex: string;
    private onTabSelected: any;

    public get activeTabIndex() {
        return +this._currentIndex;
    }

    public onSelect(index) {
        this._currentIndex = index;
        this.onTabSelected({ index: this._currentIndex });
    }
}

class TabHeading {
    private tabsManager: any;
    private index: number;
    private perventDefault: boolean;

    constructor(private $scope: any, private $element: any, private $attrs: any) {
        this.perventDefault = $attrs.perventDefault;
    }

    public init(tabsManager) {
        this.tabsManager = tabsManager;
        this.index = this.$element.index();
    }

    get isActive() {
        return this.index === this.tabsManager.activeTabIndex;
    }

    public onClick() {
        if (this.perventDefault) {
            return;
        }
        this.tabsManager.onSelect(this.index);
    }
}

class TabPanel {
    private tabsManager: any;

    constructor(private $scope: any, private $element: any, private $attrs: any) {}

    public init(tabsManager) {
        this.tabsManager = tabsManager;
    }

    get isActive() {
        return this.index === this.tabsManager.activeTabIndex;
    }

    get index() {
        return this.$element.siblings("sw-tabs-panel").andSelf().index(this.$element);
    }
}

angular
    .module("sw.common")
    .directive("swTabs", function () {
        return {
            templateUrl: "/app/components/sw-tabs/sw-tabs.html",
            controller: TabsContainer,
            transclude: true,
            scope: {},
            bindToController: {
                onTabSelected: "&",
                _currentIndex: "@active",
                tabClasses: "@?",
                headingsClasses: "@?",
                headingClasses: "@?",
                panelsClasses: "@?",
                panelClasses: "@?",
            },
            controllerAs: "tabs",
        };
    } as ng.Injectable<IDirectiveFactory>)
    .directive("swTabsHeadings", function () {
        return {
            restrict: "E",
            transclude: true,
            require: "^swTabs",
            templateUrl: "/app/components/sw-tabs/sw-tabs-headings.html",
            bindToController: true,
            link: ($scope: any, $element, $attr, tabs: any) => {
                $scope.headingsClasses = tabs.headingsClasses;
            },
        };
    })
    .directive("swTabsHeading", function () {
        return {
            restrict: "E",
            templateUrl: "/app/components/sw-tabs/sw-tabs-heading.html",
            transclude: true,
            scope: {
                perventDefault: "@?",
            },
            require: {
                tabsManager: "^^swTabs",
                heading: "swTabsHeading",
            },
            bindToController: true,
            controllerAs: "current",
            controller: TabHeading,
            link: ($scope, $element, $attr, controllers: any) => {
                controllers.heading.init(controllers.tabsManager);
            },
        };
    } as ng.Injectable<IDirectiveFactory>)
    .directive("swTabsPanels", function () {
        return {
            restrict: "E",
            transclude: true,
            templateUrl: "/app/components/sw-tabs/sw-tabs-panels.html",
            require: "^swTabs",
            bindToController: true,
            link: ($scope: any, $element, $attr, tabs: any) => {
                $scope.panelsClasses = tabs.panelsClasses;
            },
        };
    } as ng.Injectable<IDirectiveFactory>)
    .directive("swTabsPanel", function () {
        return {
            restrict: "E",
            transclude: true,
            scope: {},
            templateUrl: "/app/components/sw-tabs/sw-tabs-panel.html",
            require: {
                tabsManager: "^^swTabs",
                panel: "swTabsPanel",
            },
            bindToController: true,
            controller: TabPanel,
            controllerAs: "current",
            link: ($scope, $element, $attr, controllers: any) => {
                controllers.panel.init(controllers.tabsManager);
            },
            /*controller: TabsContainer,
             bindToController: true*/
        };
    } as ng.Injectable<IDirectiveFactory>);
