/**
 * Created by sahar.rehani on 07-Feb-17.
 */
import angular from "angular";
import * as _ from "lodash";
import { GooglePlayKeywordAnalysisGraphWidget } from "./widgets/GooglePlayKeywordAnalysisGraphWidget";
import { GooglePlayKeywordsTableWidget } from "./widgets/GooglePlayKeywordsTableWidget";

export class GooglePlayKeywordAnalysisCtrl {
    public title: string;
    public subtitle: string;
    public widgets: any;
    public state;
    private _widgetFactoryService: any;

    constructor(public $scope: any, widgetFactoryService: any, protected swNavigator: any) {
        const initialParams = swNavigator.getParams();
        const params = {
            ...initialParams,
            key: [
                {
                    id: initialParams.keyword,
                    name: initialParams.keyword,
                },
            ],
        };

        // this.title = 'googleplaykeyword.analysis.title';
        this.title = "keywordcompetitors.organic.title";
        this.subtitle = "appstorekeywords.analysis.subtitle";
        this.state = swNavigator.current().name;
        this._widgetFactoryService = widgetFactoryService;

        // run once to init
        this.initWidgets(params);

        $scope.$on("$destroy", () => {
            _.forEach(this.widgets, (widget) => {
                if (typeof widget.clearAllSelectedRows == "function") {
                    widget.clearAllSelectedRows();
                }
            });
        });
    }

    protected initWidgets(params: any) {
        this.widgets = {
            graph: this._widgetFactoryService.createWithConfigs(
                params,
                GooglePlayKeywordAnalysisGraphWidget,
                this.state,
            ),
            table: this._widgetFactoryService.createWithConfigs(
                params,
                GooglePlayKeywordsTableWidget,
                this.state,
            ),
        };
    }
}

angular
    .module("sw.common")
    .controller(
        "googlePlayKeywordAnalysisCtrl",
        GooglePlayKeywordAnalysisCtrl as ng.Injectable<ng.IControllerConstructor>,
    );
