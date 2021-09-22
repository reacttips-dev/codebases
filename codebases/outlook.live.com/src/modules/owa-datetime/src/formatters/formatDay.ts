import { localizedFormat, localizedFormatter } from './localizedFormatter';

export const getDayFormat = localizedFormat(/d{1,2}/);
export default localizedFormatter(getDayFormat);
