import { IInsightReport } from "pages/insights/types";

export interface IPeriod {
    from: any;
    to: any;
}

export interface IInsightTableData {
    Records: IInsightReport[];
}

export interface IFilter {
    selectedTypeId: string[];
    period: IPeriod;
    deliveryDate: IDeliveryDate;
    searchText: string;
    skipExamples: boolean;
}

export interface IDeliveryDate {
    shiftType: string;
    shiftValue: any;
}

export interface IReportType {
    Id: string;
    Title: string;
}

export class ReportType implements IReportType {
    Id: string;
    Title: string;

    constructor(id: string, title: string) {
        this.Id = id;
        this.Title = title;
    }
}

export interface IPreset {
    id: string;
    text: string;
    value: IPeriod;
}

export interface ITwoPeriods {
    primary: IPeriod;
    secondary: IPeriod;
}

export interface IDeliveryDateItem {
    id: string;
    shiftValue: number;
    shiftType: string;
    title: string;
}

export class DeliveryDateItem implements IDeliveryDateItem {
    id: string;
    shiftValue: number;
    shiftType: string;
    title: string;

    constructor(id?: string, shiftValue?: number, shiftType?: string, title?: string) {
        this.id = id;
        this.shiftType = shiftType;
        this.shiftValue = shiftValue;
        this.title = title;
    }
}
