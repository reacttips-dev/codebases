import type { SliceByteRange } from '../types';

/**
 * Creats slice byte range which includes the number of slices along with the
 * start and end bytes of each slice
 */
export function createSliceByteRanges(
    totalSlices: number,
    sliceSize: number,
    size: number
): SliceByteRange[] {
    const slices: { start: number; end: number }[] = [];
    let start = 0;
    for (let sliceNumber = 0; sliceNumber < totalSlices; sliceNumber++) {
        const end = Math.min(start + sliceSize, size);

        slices.push({
            start: start,
            end: end,
        });
        start = end;
    }

    return slices;
}
