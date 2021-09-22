/**
 * Created by Eran.Shain on 1/29/2017.
 */

import angular from "angular";
import * as _ from "lodash";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

let $injector: any = null;

export class KeywordGroupsDataFetcher {
    static create(widget) {
        $injector = Injector;
        const timeGranularity =
            widget.apiParams.timeGranularity === "Daily"
                ? "Weekly"
                : widget.apiParams.timeGranularity;
        const { keyword } = $injector.get("swNavigator").getParams();
        const { GroupHash } = keywordsGroupsService.findGroupByName(keyword);
        const defaultFetcherFactory = $injector.get("defaultFetcherFactory");
        const targetFetcher = defaultFetcherFactory.create(widget);
        return {
            ...targetFetcher, // copy any other functions / props that might be added in the future to the default fetcher
            fetch() {
                // and override the fetch method.
                if (!GroupHash) {
                    return targetFetcher.fetch(
                        _.merge({}, widget.apiParams, {
                            timeGranularity,
                        }),
                    );
                } else {
                    return targetFetcher.fetch(
                        _.merge({}, widget.apiParams, {
                            GroupHash,
                            timeGranularity,
                        }),
                    );
                }
            },
        };
    }
}
