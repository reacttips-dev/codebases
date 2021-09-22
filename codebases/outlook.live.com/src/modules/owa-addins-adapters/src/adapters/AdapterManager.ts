import type AppointmentComposeAdapter from './AppointmentComposeAdapter';
import type AppointmentReadAdapter from './AppointmentReadAdapter';
import type CommonAdapter from './CommonAdapter';
import type MessageComposeAdapter from './MessageComposeAdapter';
import type MessageReadAdapter from './MessageReadAdapter';

export type Adapter =
    | CommonAdapter
    | MessageComposeAdapter
    | MessageReadAdapter
    | AppointmentComposeAdapter
    | AppointmentReadAdapter;

interface Adapters {
    [hostItemIndex: string]: Adapter;
}

const adapters: Adapters = {};

export function addAdapter(hostItemIndex: string, adapter: Adapter) {
    if (isAdapterPresent(hostItemIndex)) {
        deleteAdapter(hostItemIndex);
    }
    adapters[hostItemIndex] = adapter;
}

export function deleteAdapter(hostItemIndex: string) {
    delete adapters[hostItemIndex];
}

export function getAdapter(hostItemIndex: string): Adapter {
    return adapters[hostItemIndex];
}

export function isAdapterPresent(hostItemIndex: string): boolean {
    return !!adapters[hostItemIndex];
}
