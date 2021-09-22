import { ICategoryShareServices, ICategoryShareTableSelection } from "../CategoryShareTypes";

export enum GranularitySwitcherEnum {
    DAILY,
    WEEKLY,
    MONTHLY,
}

export enum DataTypeSwitcherEnum {
    PERCENT,
    NUMBER,
}

export interface ICategoryShareGraphProps {
    services: ICategoryShareServices;
    tableStateKey: string;
    selectedRows: ICategoryShareTableSelection[];
    params: any;
}

export interface ICategoryShareAdaptedGraphData {
    name: string;
    seriesName: string;
    showInLegend: boolean;
    color: string;
    data: Array<{ x: number; y: number; isPartial: boolean }>;
    index: number;
    yAxis: number;
    zIndex: number;
    marker: { symbol: string };
    visible: boolean;
    zoneAxis: string;
    zones: any[];
}

export interface ICategoryShareGraphLegend {
    name: string;
    color: string;
    visible: boolean;
}

/**
 * Represents data for the entire graph.
 */
export interface ICategoryShareGraphApiData {
    /**
     * Maps between an entity (Domain), and its underlying data.
     */
    Data: Record<string, WebSourceToDataMapping>;
}

/**
 * Represents a single series in the graph (a series of points)
 * The data is structured as a mapping between the traffic source type, and the data
 * points of this traffic source.
 */
export type WebSourceToDataMapping = Record<"Total" | "Desktop" | "Mobile", SingleDataPoint[]>;

/**
 * Represents a single data point of the graph
 */
type SingleDataPoint = {
    /**
     * Date of the current data point
     */
    Key: string;

    /**
     * Value of the current data point
     */
    Value: { Absolute: number; Share: number };
};
