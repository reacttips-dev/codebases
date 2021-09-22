import * as React from "react";
import {Redirect, Route} from "react-router";
import * as patternUtils from "react-router/lib/PatternUtils";
import * as url from "url";
import {Redirect as MyRedirect, Route as MyRoute, Routes} from "../../models";
import {Key, routeManager as globalRouteManager} from "@bbyca/apex-components";
import appRoutes from "./routes";

interface RoutesByKey {
    [key: string]: MyRoute;
}

class RouteManager {
    private routesByKey: RoutesByKey = {};

    constructor(routes: Routes) {
        this.initRoutesByKey(routes);
    }

    public buildRoute(lang: Language) {
        return <Route>{this.buildRoutes(lang, appRoutes)}</Route>;
    }

    public getParams<T>(lang: Language, path: string): T {
        return globalRouteManager.getParams(lang, path) as T;
    }

    public getKeyByPath(lang: Language, path: string): Key {
        /**
         * Warning:
         * If using this method for non-routing purposes (e.g. constructing component props),
         * getKeyByPath() has potential to throw an error if no match can be found.
         * Ensure you handle this correctly to avoid unnecassary 500 pages being triggered
         */
        return globalRouteManager.getKeyByPath(lang, path);
    }

    public getPathByKey(lang: Language, key: Key, ...params: string[]): string {
        try {
            return globalRouteManager.getPathByKey(lang, key, ...params);
        } catch (error) {
            return undefined;
        }
    }

    public getPathByKeyWithQueryParams(
        lang: Language,
        key: Key,
        queryParamString: string,
        ...params: string[]
    ): string {
        try {
            const pathByKey = globalRouteManager.getPathByKey(lang, key, ...params);
            return pathByKey + queryParamString;
        } catch (error) {
            return undefined;
        }
    }

    public getAnalyticVariableByPath(lang: Language, path: string): string {
        for (const analyticVariable in this.routesByKey) {
            if (this.routesByKey.hasOwnProperty(analyticVariable)) {
                const route = this.routesByKey[analyticVariable];
                const pattern = route.paths[lang];
                const match = (patternUtils as any).matchPattern(pattern, path);

                if (match && !match.remainingPathname) {
                    return route.analyticVariable;
                }
            }
        }

        throw new Error("No variable found for path: " + path);
    }

    public isServerSideRenderEnabledByPath(lang: Language, path: string): boolean {
        for (const key in this.routesByKey) {
            if (this.routesByKey.hasOwnProperty(key)) {
                const route = this.routesByKey[key];
                const pattern = route.paths[lang];
                const match = (patternUtils as any).matchPattern(pattern, path);

                if (match && !match.remainingPathname) {
                    return route.isServerSideRenderEnabled !== false;
                }
            }
        }

        throw new Error("No key found for path: " + path);
    }

    public isServerSideRenderEnabledByKey(key: Key): boolean {
        return this.routesByKey[key].isServerSideRenderEnabled !== false;
    }

    public getCanonicalUrlByKey(lang: Language, key: Key, ...params: string[]): string {
        return this.getDomain() + this.getPathByKey(lang, key, ...params).toLowerCase();
    }

    public getRelLinksByKey(lang: Language, key: Key, relType: string, page: number, ...params: string[]): string {
        const links = this.routesByKey[key].links;

        if (!links) {
            return null;
        }

        const relLinkType = links[relType];

        if (!relLinkType) {
            return null;
        }

        const pattern = relLinkType[lang];

        const matches = pattern.match(/:\w+/g);

        if (matches && params.length !== matches.length) {
            return null;
        }

        const urlPattern = params.reduce((result, element) => result.replace(/:\w+/, element), pattern);

        const relationURL = url.parse(urlPattern);
        relationURL.query = {
            page,
        };

        return url.format(relationURL);
    }

    public getAltLangPathByKey(lang: Language, key: Key, ...params: string[]): string {
        return this.getDomain() + this.getPathByKey(lang === "en" ? "fr" : "en", key, ...params).toLowerCase();
    }

    public getHelpTopAltLangUrl(altLangPath: string, lang: Language): string {
        const regExStr = /\/(?<key>[a-z-_]+)(\/categories\/(?<categoryId>[a-z-_]+))?(\/topics\/(?<topicId>[a-z_-]+))?(\/subtopics\/(?<subTopicId>[a-z_-]+))?/g;
        const results = regExStr.exec(altLangPath);
        const {key, categoryId, topicId, subTopicId} = (results && (results as any).groups) || ({} as any);

        return (
            this.getDomain() +
            this.getPathByKey(lang === "en" ? "fr" : "en", key || "help", categoryId, topicId, subTopicId).toLowerCase()
        );
    }

    public getDomain(): string {
        // TODO: Temporary solution, refactor after cutover
        if (typeof location === "undefined") {
            return "https://www.bestbuy.ca";
        } else {
            return location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
        }
    }

    public getCurrLang(path: string) {
        return this.getDomain() + path.toString().toLowerCase();
    }

    private buildRoutes(lang: Language, routes: Routes): JSX.Element[] {
        if (!routes || !routes.length) {
            return undefined;
        }

        const elements: JSX.Element[] = [];

        for (const route of routes) {
            if ((route as MyRedirect).redirectToKey) {
                elements.push(
                    <Redirect
                        key={route.key}
                        path={route.paths[lang]}
                        to={this.getPathByKey(lang, (route as MyRedirect).redirectToKey as Key)}
                    />,
                );
            }

            elements.push(
                <Route key={route.key} path={route.paths[lang]} component={route.component}>
                    {this.buildRoutes(lang, route.subRoutes)}
                </Route>,
            );
        }
        return elements;
    }

    private initRoutesByKey(routes: Routes) {
        if (!routes || !routes.length) {
            return;
        }

        for (const route of routes) {
            const myRoute = route as MyRoute;

            if (myRoute.key) {
                this.routesByKey[myRoute.key] = myRoute;
            }

            this.initRoutesByKey(route.subRoutes);
        }
    }
}

const routeManager = new RouteManager(appRoutes);

export default routeManager;
