/**
 * Created by sahar.rehani on 23-Mar-17.
 */

import angular from "angular";
import { swSettings } from "common/services/swSettings";
import { AppCategoryLeaderboardTableWidget } from "./widgets/AppCategoryLeaderboardTableWidget";
import { AppCategoryLeaderboardTableSIWidget } from "./widgets/AppCategoryLeaderboardTableSIWidget";

export class AppCategoryLeaderBoard {
    public title: string;
    public subtitle: string;
    public widgets: any;
    public state;
    private _widgetFactoryService: any;

    constructor(
        public $scope: any,
        widgetFactoryService: any,
        protected swNavigator: any,
        $filter: any,
    ) {
        const initialParams = swNavigator.getParams();
        const params = {
            ...initialParams,
            key: [
                {
                    id: initialParams.category,
                    name: initialParams.category,
                },
            ],
        };

        this.title = "rankings.topapps.page.title";
        this.subtitle = `${$filter("i18n")("topapps.lastupdated")} ${$filter("date")(
            swSettings.current.resources.SupportedDate,
            "longDate",
        )}`;
        this.state = swNavigator.current().name;
        this._widgetFactoryService = widgetFactoryService;

        // run once to init
        this.initWidgets(params);
    }

    protected initWidgets(params: any) {
        const { parent } = this.swNavigator.current();

        const widgetClass = parent.includes("salesIntelligence-appcategory")
            ? AppCategoryLeaderboardTableSIWidget
            : AppCategoryLeaderboardTableWidget;

        this.widgets = {
            table: this._widgetFactoryService.createWithConfigs(params, widgetClass, this.state),
        };
    }
}

angular
    .module("sw.common")
    .controller(
        "appCategoryLeaderBoardCtrl",
        AppCategoryLeaderBoard as ng.Injectable<ng.IControllerConstructor>,
    );
