/**
 * Created by eran.shain on 05/06/2017.
 */
import { IPromise } from "angular";
import { DefaultDataFetcher } from "./DefaultDataFetcher";
export class SearchPageAdsTableFetcher extends DefaultDataFetcher<any> {
    getParams(params = this.widget.apiParams) {
        return {
            ...params,
            keys: params.keys.split(",")[0],
        };
    }

    fetch(params = this.widget.apiParams): IPromise<any> {
        return super.fetch(this.getParams(params));
    }
}
