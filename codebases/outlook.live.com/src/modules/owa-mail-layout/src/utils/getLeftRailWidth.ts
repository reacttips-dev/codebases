import { isLeftRailVisible } from 'owa-left-rail-utils/lib/isLeftRailVisible';
import { LEFT_RAIL_STATIC_WIDTH } from 'owa-layout';
import { Module } from 'owa-workloads';

export function getLeftRailWidth() {
    return isLeftRailVisible(Module.Mail) ? LEFT_RAIL_STATIC_WIDTH : 0;
}
