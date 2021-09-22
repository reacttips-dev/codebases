import angular from "angular";
class WidgetCacheService {
    static $inject = ["$cacheFactory"];
    static cacheId: string = "WidgetCache";
    private _cache: any;
    constructor($cacheFactory) {
        this._cache = $cacheFactory(WidgetCacheService.cacheId);
    }

    public put(id: string, value: any) {
        this._cache.put(id, value);
    }

    public get(id: string): any {
        return this._cache.get(id);
    }

    public remove(id: string) {
        this._cache.remove(id);
    }

    public removeAll() {
        this._cache.removeAll();
    }

    public destroy() {
        this._cache.destroy();
    }
}

angular.module("sw.common").service("widgetCacheService", WidgetCacheService);
