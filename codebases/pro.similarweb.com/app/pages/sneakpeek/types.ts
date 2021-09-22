export enum EDataPresentationTypes {
    GRAPH = "graph",
    TABLE = "table",
    PIE_CHART = "piechart",
}

export interface ITableColumnsMetadata {
    field: string;
    name: string;
    cellTemp: string;
}
