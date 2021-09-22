import datapoints from '../datapoints';
import openWindow from '../utils/openWindow';
import type WindowFeaturesOptions from '../store/schema/WindowFeaturesOptions';
import type { default as PopoutData, DeeplinkPopoutData } from '../store/schema/PopoutData';
import extractData from '../utils/extractData';
import getDeeplinkUrl from '../utils/getDeeplinkUrl';
import getProjectionUrl from '../utils/getProjectionUrl';
import { popoutLoaded } from '../utils/popoutLoaded';
import { lazyBootPopout } from '../index';
import { PerformanceDatapoint, wrapFunctionForDatapoint } from 'owa-analytics';

/**
 * Open a new popout window.
 * A popout window can be a deeplink window or a projection window, determined by
 * 1. Browser supports projection or not
 * 2. Whether a tab id for projection tab is provided
 * When both are true, popout window will use projection technology to show content, which has better performance than deeplink.
 * @param vdir mail or calendar
 * @param route the route path of the popout window, e.g. 'compose', 'read'
 * @param data data for the popout. It can be just an object, or a callback returns an object, or a PopoutData object which contains data for both deeplink and projection
 * @param options: window options, such as width, height, ...
 * @param skipOptinCheck Whether skip optIn check. When set to true, a param "minus" will be added to the url actionSource: Source of this action
 * @param actionSource Source of this action
 * @param additionalUrlParameters additional scenario-based parameters to include in the generated URL
 */
export default wrapFunctionForDatapoint(
    datapoints.PopoutAddPopout,
    function (
        vdir: 'mail' | 'calendar',
        route: string,
        data?: DeeplinkPopoutData | PopoutData,
        options?: Partial<WindowFeaturesOptions>,
        skipOptinCheck?: boolean,
        actionSource?: string,
        additionalUrlParameters?: Record<string, string>
    ) {
        const {
            deeplinkCallback,
            projectionTabId,
            projectionTargetWindow,
            projectionParentWindow,
        } = extractData(data);

        const isProjection = !!projectionTabId;

        const datapoint = new PerformanceDatapoint(
            isProjection ? 'PopoutProjectionPerf' : 'PopoutDeeplinkPerf'
        );

        const popoutUrl = isProjection
            ? getProjectionUrl(projectionTabId)
            : getDeeplinkUrl(vdir, route, {
                  skipOptinCheck,
                  urlParameters: additionalUrlParameters,
              });
        const childWindow = projectionTargetWindow
            ? projectionTargetWindow
            : openWindow(popoutUrl, options, projectionParentWindow);

        if (isProjection) {
            popoutLoaded(projectionTabId);
        }

        if (childWindow) {
            lazyBootPopout
                .import()
                .then(bootPopout =>
                    bootPopout(vdir, childWindow, projectionTabId, deeplinkCallback, datapoint)
                );
        }
    }
);
