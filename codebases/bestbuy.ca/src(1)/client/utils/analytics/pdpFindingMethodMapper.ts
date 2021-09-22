import routeManager from "../routeManager";
import { RoutingState } from "reducers";
import * as UrlParser from "url";

export const getPdpFindingVariable = (language: Language, routing: RoutingState) => {

      let methodType = "Other";
      const { pathname, search } = routing.locationBeforeTransitions;
      const currentUrl = pathname + search;

      const isInternalRouting = !!routing.previousLocationBeforeTransitions;
      const isExternalRouting = !!document.referrer;
      const isEmail = !!currentUrl.includes("eml-bby");

      if (isInternalRouting) {

            const lastVisitedUrl = routing.previousLocationBeforeTransitions.pathname || null;

            try {
                  methodType =
                  getCollectionMapping(lastVisitedUrl) ||
                  routeManager.getAnalyticVariableByPath(language, lastVisitedUrl) ||
                  "Other";
            } catch (error) {
                  methodType = "Other";
            }

      } else if (isExternalRouting) {
            methodType = getExternalMapping(document.referrer);
      } else if (isEmail) {
            methodType = "Email";
      }

      return methodType;
};

const getCollectionMapping = (url: string): string => {

      if (url.includes("/outlet-centre/") || url.includes("/centre-de-liquidation/")) {
            return "Outlet Page";
      } else if (url.includes("/shop-all-deals/") || url.includes("/magasinez-toutes-les-offres/")) {
            return "Weekly Deal";
      } else if (url.includes("/collection/")) {
            return "SSC";
      } else {
            return null;
      }
};

const getExternalMapping = (url: string): string => {

      const { hostname } = UrlParser.parse(url);
      if ( hostname && !hostname.includes("bestbuy") ) {
            return "External";
      } else {
            return "Other";
      }
};
