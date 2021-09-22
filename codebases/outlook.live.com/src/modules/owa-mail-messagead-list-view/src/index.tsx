import MessageAdListPreloadingStubElement from './components/MessageAdListPreloadingStubElement';
import { logUsage } from 'owa-analytics';
import { createLazyComponent, LazyModule } from 'owa-bundling';
import { getAdMarketPublishGroupCode } from 'owa-mail-ads-shared';
import * as React from 'react';

const messageAdListLazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MessageAdList" */ './lazyIndex')
);

// Delay loaded components
export let MessageAdList = createLazyComponent(
    messageAdListLazyModule,
    m => m.MessageAdList,
    () => <MessageAdListPreloadingStubElement />,
    () => {
        // Log the information so that we know how much is adblocker blocks native ads
        const adMarket = getAdMarketPublishGroupCode();
        logUsage('ShowNativeAd', {
            actualShow: false,
            adMarket: adMarket,
            actualNoShowReason: 'adblocker',
            OtherPivot: true,
        });
    }
);
