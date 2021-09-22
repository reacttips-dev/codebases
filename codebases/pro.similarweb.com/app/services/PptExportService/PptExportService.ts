import { IPptExportRequest } from "./PptExportServiceTypes";
import { IPptExportResult } from "services/PptExportService/PptExportServiceTypes";
import { SwLog } from "@similarweb/sw-log";
import { DefaultFetchService } from "services/fetchService";

/**
 * The PPT export Service makes calls to SimilarWeb's PPT Export Service API.
 * In Production - this service calls the API via SimilarWeb's Gateway
 * (see https://gitlab.similarweb.io/pro-frontend/client-gateway for more details).
 *
 * In Development - this service calls the API locally. (calls http://localhost:80)
 * therefore, when debugging this code, a PPT export service API instance must be running locally on your computer.
 * In order to run the PPT service, please clone the following repo: https://gitlab.similarweb.io/pro-frontend/ppt-export-service
 * and initialize it according to its README file.
 */
const isDevEnvironment = process.env.NODE_ENV === "development";
const pptServiceUrl = isDevEnvironment ? "http://localhost:80/api/pptx" : "/gw/ppt";
export interface IPptExportService {
    exportPpt(request: IPptExportRequest): Promise<void>;
}

export class PptExportService implements IPptExportService {
    private fetchService = DefaultFetchService.getInstance();

    async exportPpt(request: IPptExportRequest): Promise<void> {
        const hasWidgetsToExport = request.metrics.length > 0;
        if (!hasWidgetsToExport) return null;

        const res = await this.fetchData(request);
        if (!res.isSuccess) return;

        this.downloadResultFileOnClient(res.result);
    }

    private fetchData = async (
        request: IPptExportRequest,
    ): Promise<{ isSuccess: boolean; result?: IPptExportResult; error?: Error }> => {
        try {
            const result = await this.fetchService.post<IPptExportResult>(pptServiceUrl, request);
            return {
                isSuccess: true,
                result: result,
            };
        } catch (e) {
            this.logRequestError(e);
            return { isSuccess: false, error: e };
        }
    };

    private downloadResultFileOnClient = (result: IPptExportResult): void => {
        window.location.href = result.fileUrl;
    };

    private logRequestError = (error: Error): void => {
        SwLog.error(error);

        // In case we're trying to debug locally, then we should raise a warning, notifying
        // the developer that he needs to instantiate the PPT export service API.
        const isServerNotFoundError = error instanceof TypeError;
        if (isServerNotFoundError && isDevEnvironment) {
            console.warn(
                "You are trying to make PPT API calls to http://localhost:80. When running Pro client locally,\n" +
                    "The PPT Export API Service should be run locally under that specific address.\n" +
                    "For more information on how to locally run the PPT Export Service API, " +
                    "please visit https://gitlab.similarweb.io/pro-frontend/ppt-export-service,\n" +
                    "and follow README instructions for initializing the service.",
            );
        }
    };
}
