/* tslint:disable:no-console */
import angular from "angular";
import { Injector } from "common/ioc/Injector";
import { IHelpWidget } from "help-widget/HelpWidget";
import { HelpWidgetApiProvider } from "help-widget/react/HelpWidgetApiProvider";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import TrackProvider from "../../../../.pro-features/components/WithTrack/src/TrackProvider";
import TranslationProvider from "../../../../.pro-features/components/WithTranslation/src/TranslationProvider";
import { i18nFilter } from "filters/ngFilters";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import LocaleContext from "../LocaleContext/LocaleContext";
import SWComponents from "./SwComponents";

angular
    .module("sw.common")
    .directive("swReact", ($ngRedux, $timeout, helpWidget: IHelpWidget, swProfiler) => {
        return {
            restrict: "EA",
            scope: {
                component: "=",
                props: "=",
                watch: "=",
            },
            template: "<div></div>",
            link(scope: any, element, attrs: any) {
                const renderComponent = (target = attrs.component, props) => {
                    let Component;
                    switch (typeof target) {
                        case "function":
                            Component = target;
                            break;
                        case "string":
                            Component =
                                SWComponents[target] ||
                                Injector.getSafe(target) ||
                                console.error("missing react type: " + target);
                            break;
                        default:
                            throw new Error("unrecognized react component");
                    }
                    if (Component) {
                        // IMPORTANT: If Angular directive containing this swReact is not attached to DOM yet, scope.$applyAsync guarantees that
                        // React component will be attached into the DOM only after the parent Angular directive is being attached into the DOM.
                        const componentInteration = swProfiler.startInteraction(
                            Component.name ?? Component.displayName,
                        );
                        scope.$applyAsync(() => {
                            ReactDOM.render(
                                <Provider store={$ngRedux}>
                                    <TranslationProvider translate={i18nFilter()}>
                                        <TrackProvider
                                            track={allTrackers.trackEvent.bind(allTrackers)}
                                            trackWithGuid={TrackWithGuidService.trackWithGuid}
                                        >
                                            <LocaleContext>
                                                <HelpWidgetApiProvider helpWidget={helpWidget}>
                                                    <Component {...props} />
                                                </HelpWidgetApiProvider>
                                            </LocaleContext>
                                        </TrackProvider>
                                    </TranslationProvider>
                                </Provider>,
                                element[0],
                            );
                            if (componentInteration) {
                                swProfiler.endInteraction(componentInteration);
                            }
                        });
                    } else {
                        console.warn(`Could not find Target Component : ${target}`);
                    }
                };

                renderComponent(scope.component, scope.props);

                // re-render the component when props are changed
                const watchPropsDeep = scope.watch === "deep";
                scope.$watch(
                    "props",
                    (newVal = {}, oldVal = {}) => {
                        let arePropsEqual;
                        if (watchPropsDeep) {
                            arePropsEqual = false;
                        } else {
                            const newValKeys = Object.keys(newVal);
                            const oldValKeys = Object.keys(oldVal);
                            arePropsEqual =
                                newValKeys.length === oldValKeys.length &&
                                newValKeys.every(
                                    (key) =>
                                        oldVal.hasOwnProperty(key) && newVal[key] === oldVal[key],
                                );
                        }
                        if (!arePropsEqual) {
                            renderComponent(scope.component, newVal);
                        }
                    },
                    watchPropsDeep,
                );

                scope.$on("$destroy", () => {
                    ReactDOM.unmountComponentAtNode(element[0]);
                });
            },
        };
    });
