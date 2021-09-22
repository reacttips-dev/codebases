import BaseFilter from "../base/BaseFilter";
import { CommonTextSearchFilter, TextFilterDeps } from "./types";

export default class TextSearchFilter extends BaseFilter<string> implements CommonTextSearchFilter {
    readonly placeholder: string;

    constructor(deps: TextFilterDeps) {
        super(deps);

        this.placeholder = deps.placeholder;
    }
}
