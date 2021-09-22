import angular from "angular";
import * as _ from "lodash";
import * as queryString from "querystring";
import { CHART_COLORS } from "constants/ChartColors";
const createChosenItemsService = () => {
    var isFavorite = false;

    function onChange() {
        var first = collection.$first();
        if (first.Term) {
            // keywords
            isFavorite = first.IsFavorite;
        } else if (first.AppStore != null) {
            // apps
            var appsKey = collection.map(function (app) {
                return app.Id;
            });
            var store = first.AppStore === "Google" ? 0 : 1;
            if (appsKey.length) {
            }
        }
    }

    //////////////////////////////////////////////
    // Model
    //////////////////////////////////////////////

    /**
     * @param data
     * @returns {Model}
     * @constructor
     */
    var Model = function (data) {
        //this.$$callbacks = {};
        if (data) {
            if (data instanceof Model) {
                return data;
            }
            this.$set(data);
        }
    };

    /**
     * Model.$set()
     * @param data
     * @param reset
     * @returns {Model}
     */
    Model.prototype.$set = function (data, reset) {
        var self = this;
        _.each(
            !data || reset === true ? _.union(_.keys(data || {}), _.keys(self)) : _.keys(data),
            function (k) {
                self[k] = _.get(data, k, "");
            },
        );
        this.Color = CHART_COLORS.compareMainColors[0];
        this.paletteColor = CHART_COLORS.compareMainColors[0];
        this.Index = 0;
        onChange();
        return this;
    };

    /**
     * Model.$get()
     * @param attr
     * @returns {*}
     */
    Model.prototype.$get = function (attr) {
        if (attr) {
            return this[attr];
        }
        return _.omit(this, _.keys(Model.prototype));
    };

    //////////////////////////////////////////////
    // Collection
    //////////////////////////////////////////////

    /**
     * @returns {Collection}
     * @constructor
     */
    const Collection = function () {
        this.similarApps = [];
        this.positionApps = "";
        this.keywords = "";
    };

    /**
     * inherit Array
     * @type {Object|Function|Array}
     */
    Collection.prototype = Object.create(Array.prototype);
    Collection.prototype.constructor = Collection;

    /**
     * Collection.$add()
     * @param items
     * @returns {Collection}
     */
    Collection.prototype.$add = function (items) {
        if (items) {
            if (items instanceof Array) this.push.apply(this, items);
            else this.push(items);
        }
        onChange();
        return this;
    };

    /**
     * Collection.$first()
     * @returns {*}
     */
    Collection.prototype.$first = function () {
        var item = _.head(this);
        if (!item) {
            // @ts-ignore
            item = new Model(null);
            this.push(item);
        }
        return item;
    };

    /**
     * Collection.$tail()
     * @param items
     * @returns {*}
     */
    Collection.prototype.$tail = function (items?) {
        var self = this;
        if (items && items instanceof Array) {
            this.splice(1, this.length - 1);
            angular.forEach(items, function (item, index) {
                if (item) {
                    item.Color = CHART_COLORS.compareMainColors[index + 1];
                    item.paletteColor = CHART_COLORS.compareMainColors[index + 1];
                    item.Index = index + 1;
                    self.splice(index + 1, 0, item);
                }
            });
            onChange();
        }
        return _.tail(this);
    };

    /**
     * Collection.$all()
     * @returns {*}
     */
    Collection.prototype.$all = function () {
        return _.slice(this);
    };

    /**
     * Collection.$remove()
     * @param itemId
     */
    Collection.prototype.$remove = function (itemId) {
        var arr = _.map(this, "Id"),
            index = _.indexOf(arr, itemId);
        this.splice(index, 1);
        onChange();
    };

    /**
     * Collection.$clear()
     */
    Collection.prototype.$clear = function () {
        this.splice(0, this.length);
        onChange();
    };

    /**
     * Collection.searchApps()
     * @param query
     * @param all
     * @returns {*}
     */
    Collection.prototype.searchApps = async function (query, all) {
        var self = this;
        const params = {
            term: encodeURIComponent(query.toLowerCase()),
            store: all ? "" : self.$first().AppStore,
        };
        const url = `/autocomplete/apps?${queryString.stringify(params)}`;
        const response = await fetch(url);
        const { data } = await response.json();
        return _.take(data, 10);
    };

    /**
     * Collection.appIdUrlParam()
     * @returns {string}
     */
    Collection.prototype.appIdUrlParam = function () {
        return _.map(this, "Id").join(",");
    };

    /**
     * is the current app/apps favorite
     * Collection.isFavorite()
     * @returns {boolean}
     */
    Collection.prototype.isFavorite = function () {
        return isFavorite;
    };

    /**
     * Collection.getById()
     * @param appId
     * @returns {*}
     */
    Collection.prototype.getById = function (appId) {
        return _.find(this, { Id: appId });
    };

    Collection.prototype.isCompare = function () {
        return this.length > 1;
    };

    const collection = new Collection();
    return collection;
};

export const chosenItems = createChosenItemsService();
export const chosenItemFactory = () => {
    return createChosenItemsService();
};
