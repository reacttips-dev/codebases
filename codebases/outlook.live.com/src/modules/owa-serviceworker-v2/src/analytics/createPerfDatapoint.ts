import { logDatapoint } from './logDatapoint';
import type SWError from '../types/SWError';

export type DatapointStatus = 'Success' | 'ServerError' | 'ClientError' | 'UserError';

export function createPerfDatapoint(eventName: string, source: string) {
    const start = Date.now();
    let miscData: { [index: string]: string } = {};
    let ended: boolean = false;
    return {
        addData: (key: string, value: string) => {
            miscData[key] = value;
        },
        end: (status: DatapointStatus, e?: SWError) => {
            if (ended) {
                return Promise.resolve();
            } else {
                ended = true;
                return logDatapoint(eventName, miscData, source, Date.now() - start, status, e);
            }
        },
    };
}
