import { setItem, getItem } from 'owa-local-storage';
import type { LogicalRingEnum } from 'owa-client-pie/lib/outlookwebcontext.g';

const LogicalRingKey = 'LogicalRing';
export type LogicalRing = keyof typeof LogicalRingEnum;

let logicalRing: LogicalRing | null;
export function setLogicalRing(ring: LogicalRing) {
    logicalRing = ring;
    setItem(window, LogicalRingKey, ring);
}

export function getLogicalRing() {
    if (!logicalRing) {
        logicalRing = getItem(window, LogicalRingKey) as LogicalRing | null;
    }

    return logicalRing;
}
