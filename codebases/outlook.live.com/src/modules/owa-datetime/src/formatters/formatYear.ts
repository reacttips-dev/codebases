import { localizedFormat, localizedFormatter } from './localizedFormatter';

export const getYearFormat = localizedFormat(/y{1,4}/);
export default localizedFormatter(getYearFormat);
