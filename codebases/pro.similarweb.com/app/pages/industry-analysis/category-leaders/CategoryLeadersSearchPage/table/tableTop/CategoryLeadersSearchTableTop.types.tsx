import { TableTopComponentProps } from "components/React/Table/SWReactTableWrapper";
import {
    ICategoryLeadersNavParams,
    ICategoryLeadersServices,
    ITableColumnSort,
} from "pages/industry-analysis/category-leaders/CategoryLeaders.types";

export interface ICategoryLeadersSearchTableTopProps extends TableTopComponentProps {
    services: ICategoryLeadersServices;
    tableApiQueryParams: ITableApiQueryParams;
    navParams?: ICategoryLeadersNavParams;
}

export enum PaidOrganicFilterEnum {
    Organic = 0,
    Paid = 1,
}

export interface ITableApiQueryParams {
    category: string;
    categoryHash: string;
    webSource: string;
    country: number;
    from: string;
    to: string;
    isWindow: boolean;
    includeSubDomains: boolean;
    timeGranularity: string;
    tab: string;
    keys: string;
}
