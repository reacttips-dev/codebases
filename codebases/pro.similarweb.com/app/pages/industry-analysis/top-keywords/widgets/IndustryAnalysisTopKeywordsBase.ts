import { TableWidget } from "components/widget/widget-types/TableWidget";

export class IndustryAnalysisTopKeywordsBase extends TableWidget {
    public getWidgetFilters() {
        const {
            filter,
            orderBy,
            ExcludeTerms,
            IncludeTerms,
            includeBranded,
            includeNoneBranded,
            IncludeNewKeywords,
            IncludeTrendingKeywords,
            IncludeQuestions,
        } = this.apiParams;
        return {
            filter,
            orderBy,
            ExcludeTerms,
            IncludeTerms,
            includeBranded,
            includeNoneBranded,
            channelText: this._widgetConfig.properties.channelText,
            IncludeNewKeywords,
            IncludeTrendingKeywords,
            IncludeQuestions,
        };
    }
    public callbackOnGetData(response: any) {
        const dataAfterTransform = response.Data.map((record) => ({
            ...record,
            favicon: record.Favicon,
        }));
        super.callbackOnGetData({ ...response, Data: dataAfterTransform });
    }
}
