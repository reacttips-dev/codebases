import { createStatePropertySelector } from "pages/workspace/sales/helpers";
import { RootState } from "store/types";

export const selectSalesIntelligenceState = createStatePropertySelector(
    (root: RootState) => root.salesIntelligence,
);
