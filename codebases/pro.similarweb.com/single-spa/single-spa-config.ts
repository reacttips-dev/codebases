/* eslint:disable */
import "./webpack-set-public-path";
import "whatwg-fetch";

export * from "babel-polyfill";
export * from "../src/polyfills/remove";
import { registerApplication, start, navigateToUrl } from "single-spa";
import { bootstrap } from "./bootstrap";
import { tryGetInitialUrl } from "./insights-hub-setup/common/InsightsHubSetupHelpers";

// Prepare dayjs with all needed plugins globally
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import MinMax from "dayjs/plugin/minMax";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isBetween from "dayjs/plugin/isBetween";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(MinMax);
dayjs.extend(customParseFormat);
dayjs.extend(dayOfYear);
dayjs.extend(isoWeek);
dayjs.extend(isBetween);

const matchesRegex = (regex) => {
    return (location) => {
        return regex.test(location.hash);
    };
};

const getInitialUrl = (userData) => {
    const marketingOnbpardingUrl = tryGetInitialUrl(userData);
    return marketingOnbpardingUrl;
};

const run = async (): Promise<void> => {
    const commonEnv = await bootstrap();
    registerApplication(
        "angularjs",
        () => import(/* webpackChunkName: "angular" */ "./angularjs/angularjs.app"),
        matchesRegex(/^(?!.*(ripng|sspa|onboarding))/),
        commonEnv,
    );
    registerApplication(
        "react",
        () => import(/* webpackChunkName: "react" */ "./react/react.app"),
        matchesRegex(/sspa/),
        commonEnv,
    );
    // This will be uncommented when insights hub page will be ready
    // registerApplication(
    //     "insights-hub-setup",
    //     () => import(/* webpackChunkName: "insights-hub" */ "./insights-hub-setup/app"),
    //     matchesRegex(/onboarding/),
    //     commonEnv,
    // );
    // const url = getInitialUrl(commonEnv?.startup?.userData);
    // if (url) {
    //     navigateToUrl(url);
    // }
    start();
};

run();
