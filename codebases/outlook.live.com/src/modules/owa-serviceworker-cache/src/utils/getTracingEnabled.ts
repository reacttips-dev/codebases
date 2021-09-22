import { SWTracing } from 'owa-serviceworker-common';
import { getExtraSettings } from 'owa-config';
import { getQueryStringParameter } from 'owa-querystring';

export default function getTracingEnabled(): SWTracing {
    return (
        getSwTracing(getQueryStringParameter('swTracing')) ||
        getSwTracing(getExtraSettings()?.swTracing) ||
        SWTracing.None
    );
}

function getSwTracing(value: string): SWTracing | undefined {
    return Object.values(SWTracing).indexOf(value) > -1 ? <SWTracing>value : undefined;
}
