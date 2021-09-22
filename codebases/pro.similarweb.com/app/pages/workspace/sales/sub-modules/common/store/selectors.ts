import { selectCommonSlice } from "../../../store/selectors";
import { createStatePropertySelector } from "../../../helpers";

const commonStatePropertySelector = createStatePropertySelector(selectCommonSlice);

export const selectRightBarIsOpen = commonStatePropertySelector("isRightBarOpen");
export const selectCountryRightBar = commonStatePropertySelector("countryRightBar");
