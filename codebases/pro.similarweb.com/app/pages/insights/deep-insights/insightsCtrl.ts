import angular from "angular";
import { IController, IScope, IFilterService } from "angular";
import { I18nService } from "./../../../@types/I18nInterfaces";

export class DeepInsightsController implements IController {
    private i18n: I18nService;

    constructor(private $scope: IScope, $filter: IFilterService) {
        this.i18n = <I18nService>$filter("i18n");
    }

    $onInit() {}
}
