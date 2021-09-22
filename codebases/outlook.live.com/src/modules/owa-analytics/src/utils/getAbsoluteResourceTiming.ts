export default function getAbsoluteResourceTiming(timingVal: number, startOffset: number): number {
    if (timingVal && timingVal > 0 && startOffset && startOffset > 0) {
        return Math.floor(timingVal - startOffset);
    }

    return -1;
}
