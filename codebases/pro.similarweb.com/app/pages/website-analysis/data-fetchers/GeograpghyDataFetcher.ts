import angular from "angular";
import { DefaultDataFetcher } from "components/widget/widget-fetchers/DefaultDataFetcher";
import { IDataFetcherFactory } from "components/widget/widget-fetchers/IDataFetcher";
import { IWidget } from "components/widget/widget-types/Widget";
/**
 * Created by liorb on 1/18/2017.
 */

class GeographyDataFetcher extends DefaultDataFetcher<any> {
    public $promise = null;
    private deferred;

    constructor(private resource, widget: IWidget<any>, private $q) {
        super(resource, widget);
        this.deferred = $q.defer();
        this.$promise = this.deferred.promise;
    }

    public fetch(): angular.IPromise<any> {
        const promise = super.fetch("");
        promise.then((data) => {
            this.deferred.resolve(data);
        });
        return promise;
    }
}

class GeographyDataFetcherFactory implements IDataFetcherFactory<any> {
    constructor(private widgetResource, private $q) {}

    public Instance: GeographyDataFetcher;

    create(widget: IWidget<any>) {
        this.Instance = new GeographyDataFetcher(this.widgetResource, widget, this.$q);
        return this.Instance;
    }
}

angular
    .module("websiteAnalysis")
    .factory(
        "geographyFetcherFactory",
        (widgetResource, $q) => new GeographyDataFetcherFactory(widgetResource, $q),
    );
