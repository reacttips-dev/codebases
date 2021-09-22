import { customRangeFormat } from "constants/dateFormats";
import { Dayjs } from "dayjs";

export const getDiffCustomRangeParam = (from: Dayjs, to: Dayjs): string =>
    `${from.format(customRangeFormat)}-${to.format(customRangeFormat)}`;
