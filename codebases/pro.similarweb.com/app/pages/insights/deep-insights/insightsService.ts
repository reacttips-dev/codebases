import { GeneralFetchService } from "services/fetchService";
import { IInsightReport } from "./../types";

export class InsightsService {
    constructor() {}

    private fetchService = GeneralFetchService.getInstance();

    async getAllReports(): Promise<IInsightReport[]> {
        return this.fetchService.get<IInsightReport[]>("/api/deep-insights/reports");
    }

    async sendEmail(): Promise<boolean> {
        return this.fetchService.get<boolean>("/api/deep-insights/send", null, {
            preventAutoCancellation: true,
        });
    }
}
