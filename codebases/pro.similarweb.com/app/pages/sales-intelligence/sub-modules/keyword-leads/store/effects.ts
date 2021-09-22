import { fetchTotalThunk, downloadTotalExcelThunk } from "./effects/totalEffects";
import { fetchPaidThunk, downloadPaidExcelThunk } from "./effects/paidEffects";
import { fetchOrganicThunk, downloadOrganicExcelThunk } from "./effects/organicEffects";
import { fetchMobileThunk, downloadMobileExcelThunk } from "./effects/mobileEffects";

export const fetchEffect = {
    fetchTotalThunk,
    downloadTotalExcelThunk,
    fetchPaidThunk,
    downloadPaidExcelThunk,
    fetchMobileThunk,
    downloadMobileExcelThunk,
    fetchOrganicThunk,
    downloadOrganicExcelThunk,
};
