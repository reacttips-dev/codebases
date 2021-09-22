"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates a SplitIO.IClient. Use SplitIOService to get the userKey and the config.
 * It requires a factory to be setup. This factory can be the SplitFactory from @splitsoftware/splitio
 * if it's used with a bundler or the global window.splitio object if a script tag is used.
 */
var SplitIOClientBuilder = /** @class */ (function () {
    function SplitIOClientBuilder() {
        return this;
    }
    SplitIOClientBuilder.prototype.setFactory = function (splitFactory) {
        this.splitFactory = splitFactory;
        return this;
    };
    SplitIOClientBuilder.prototype.setApiKey = function (apiKey) {
        this.apiKey = apiKey;
        return this;
    };
    SplitIOClientBuilder.prototype.setUserKey = function (userKey) {
        this.userKey = userKey;
        return this;
    };
    SplitIOClientBuilder.prototype.setConfig = function (config) {
        this.config = config;
        return this;
    };
    SplitIOClientBuilder.prototype.build = function () {
        if (!this.splitFactory) {
            throw new Error("splitFactory is required!");
        }
        if (!this.config || !this.config.core || !this.apiKey || !this.userKey) {
            throw new Error("Builder is missing required data");
        }
        var configuration = Object.assign({}, this.config);
        configuration.core.authorizationKey = this.apiKey;
        configuration.core.key = this.userKey;
        var localFactory = this.splitFactory(configuration);
        return localFactory.client();
    };
    return SplitIOClientBuilder;
}());
exports.default = SplitIOClientBuilder;
//# sourceMappingURL=index.js.map