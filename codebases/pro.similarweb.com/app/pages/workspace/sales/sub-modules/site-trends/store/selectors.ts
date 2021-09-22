import { createStatePropertySelector } from "pages/workspace/sales/helpers";
import { selectSiteTrendsSlice } from "pages/workspace/sales/store/selectors";

const select = createStatePropertySelector(selectSiteTrendsSlice);

export const selectSiteTrends = select("siteTrends");
export const selectSiteTrendsLoading = select("loading");
