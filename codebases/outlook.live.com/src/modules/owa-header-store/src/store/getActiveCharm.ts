import { getStore } from './store';
import type HeaderCharmType from './schema/HeaderCharmType';

export default function getActiveCharm(): HeaderCharmType {
    return getStore().activeCharm;
}
