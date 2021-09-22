import angular from "angular";
import * as _ from "lodash";

export class ChannelTranslationService {
    constructor() {}
    getKey(channel) {
        return `utils.${this._normalizeChannel(channel)}`;
    }
    private _normalizeChannel(channel) {
        return _.camelCase(channel);
    }
}
function ChannelTranslationServiceFactory() {
    return new ChannelTranslationService();
}

angular.module("sw.common").factory("channelTranslationService", ChannelTranslationServiceFactory);
