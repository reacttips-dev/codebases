import type { OwaDate } from '../schema';

/** Returns the abs-floored difference between two timestamps, in a particular scale. */
export default (left: OwaDate | number, right: OwaDate | number, scale: number) => {
    const diff = (+left - +right) / scale;
    return (diff < 0 ? Math.ceil : Math.floor)(diff) || 0;
};
