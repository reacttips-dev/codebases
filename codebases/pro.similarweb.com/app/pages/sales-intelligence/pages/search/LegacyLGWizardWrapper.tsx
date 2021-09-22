import React from "react";
import { IQueryConfig } from "pages/lead-generator/lead-generator-new/leadGeneratorNewConfig";
import getConfig from "pages/sales-intelligence/pages/search/filters-config";
import ReportQuery from "pages/lead-generator/lead-generator-new/components/ReportQuery";
import { DefaultFetchService } from "services/fetchService";
import { CreateSearchDto } from "pages/sales-intelligence/sub-modules/saved-searches/types";
import { ICategoriesResponse } from "pages/lead-generator/lead-generator-new/components/filters/TechnographicsBoxFilter";

type LegacyLGWizardWrapperProps = {
    activeSavedSearchFilterData: any;
    technologies: ICategoriesResponse;
    onRunReport(data: CreateSearchDto): void;
};

// TODO: [lead-gen-remove]
class LegacyLGWizardWrapper extends React.Component<LegacyLGWizardWrapperProps, any> {
    private _queryConfig: IQueryConfig[];
    private _fetchService = DefaultFetchService.getInstance();

    constructor(props: LegacyLGWizardWrapperProps) {
        super(props);

        this._queryConfig = getConfig();

        let data = {
            // eslint-disable-next-line @typescript-eslint/camelcase
            order_by: "",
            filters: null,
            queryId: "",
            runId: "",
        };

        const { activeSavedSearchFilterData } = props;

        if (activeSavedSearchFilterData && Object.keys(activeSavedSearchFilterData).length) {
            data = Object.assign({}, data, activeSavedSearchFilterData);
        }

        this.state = {
            ...data,
        };

        this.getPreviewData = this.getPreviewData.bind(this);
    }

    async getPreviewData(reportData: any): Promise<void> {
        return this._fetchService.post("/api/sales-leads-generator/query/preview", reportData);
    }

    render() {
        const { onRunReport, technologies } = this.props;

        return (
            <ReportQuery
                technologies={technologies}
                onRunReport={onRunReport}
                getPreviewData={this.getPreviewData}
                queryConfig={this._queryConfig}
                order_by={this.state.order_by}
                filters={this.state.filters}
            />
        );
    }
}

export default LegacyLGWizardWrapper;
