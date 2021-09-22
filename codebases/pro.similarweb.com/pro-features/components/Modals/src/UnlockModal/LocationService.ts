import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import * as _ from "lodash";

export default class LocationService {
    public static getCurrentLocation(): string {
        const swNavigator = Injector.get<SwNavigator>("swNavigator");
        return LocationService.getLocation(swNavigator.current(), swNavigator.getParams());
    }

    public static getLocation(state, params): string {
        try {
            const sections = ["section", "subSection", "subSubSection"]
                .map((key) => {
                    const value = state.trackingId[key];
                    return LocationService.camelCaseToCapitalized(
                        (_.isFunction(value) ? value(params) : value) || "",
                    );
                })
                .join("/");

            return `Hook PRO/${sections}`;
        } catch (e) {
            return `Hook PRO/${state.name}`;
        }
    }

    private static camelCaseToCapitalized(str) {
        if (!str) {
            return "";
        }

        str = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, "$1 $2");

        return str
            .split(" ")
            .map((s) => {
                s.toLowerCase();
                return s.replace(s[0], s[0].toUpperCase());
            })
            .join(" ");
    }
}
