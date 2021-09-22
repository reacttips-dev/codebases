import * as React from 'react';
import useIsMounted from './useIsMounted';
import type { LazyImport, LazyModule } from 'owa-bundling-light';

const useLazyImport = <TLazyModule extends LazyModule<any>, TImport>(
    lazyImport: LazyImport<TImport, TLazyModule>,
    importErrorHandler?: (e: Error) => void
): TImport | undefined => {
    const isMounted = useIsMounted();
    const [lazyImportResult, setLazyImportResult] = React.useState<TImport | undefined>(() =>
        lazyImport.isLoaded() ? lazyImport.dangerouslyImportSync() : undefined
    );

    const wasLoadedOnFirstRender = React.useMemo(() => lazyImport.isLoaded(), []);

    React.useEffect(() => {
        // Do nothing if the import was already loaded on first render
        if (wasLoadedOnFirstRender) {
            return;
        }
        const importPromise = lazyImport.import();

        // Import the promise and catch errors
        importPromise.then((importedValue: TImport) => {
            if (isMounted.current) {
                // Because our lazyImportResult might be a function (e.g. functional components),
                // wrap the value passed to the state setter in a function, since
                // functions passed to setState() are evaluated.
                setLazyImportResult(() => importedValue);
            }
        });

        if (importErrorHandler) {
            importPromise.catch(importErrorHandler);
        }
        // Set an empty dependency set so that the effect is only ever
        // fired on initial component mount.
    }, []);

    return lazyImportResult;
};

export default useLazyImport;
