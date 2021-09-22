import type Getter from './types/Getter';
import type { LazyModuleType } from './types/LazyModuleType';
import type LazyModule from './LazyModule';
import createQuickPromise from './utils/createQuickPromise';
import createImportId from './utils/createImportId';
import { getConfig } from './utils/config';
import { isDogfoodEnv } from 'owa-metatags';

const FailureDatapointName = 'LazyImportFailure';
const isSdf = isDogfoodEnv();
const IMPORT_ID_REGEX = /function\s*\(.*\)\s*{\s*return [^.]*([^;]*.*)}/;

export default class LazyImport<TImport, TLazyModule extends LazyModule<any>> {
    private id: string;
    private importPromise: Promise<TImport> | undefined;
    private importValue: TImport | undefined;
    private pendingImports = 0;

    constructor(
        private lazyModule: TLazyModule,
        private getter: Getter<TImport, LazyModuleType<TLazyModule>>
    ) {
        // Each LazyImport has a unique ID
        this.id = createImportId();
    }

    import = (): Promise<TImport> => {
        if (!this.importPromise) {
            let moduleImportPromise;
            try {
                moduleImportPromise = this.lazyModule.import();
                this.importPromise = moduleImportPromise
                    .then(module => {
                        // Get the value out of the module
                        this.importValue = this.getter(module);

                        // Once the import is loaded, we return a synchronous promise for faster access
                        this.importPromise = createQuickPromise(this.importValue);

                        // Only log import evaluation inside of SDFv2
                        //
                        // We can't use feature flags for this, since LazyImport imports are
                        // evaluated before flights are downloaded.
                        if (isSdf) {
                            this.lazyModule.addWaterfallCheckpoint(this._getImportNameForLogging());
                        }

                        // Update the loaded imports map in the store
                        getConfig().markImportAsLoaded(this.id);

                        this.pendingImports = 0;
                        return this.importValue;
                    })
                    .catch(error => {
                        // Reset the promise so we'll try to load it again
                        this.importPromise = undefined;

                        // Log some info about the failure
                        getConfig().logUsage(FailureDatapointName, {
                            message: error.message,
                            pendingImports: this.pendingImports,
                        });

                        this.pendingImports = 0;
                        throw error;
                    });
            } catch (error) {
                // Handle errors from calling then() on the promise (bug #76920)
                this.importPromise = Promise.reject(error);
            }
        }

        this.pendingImports++;
        return <Promise<TImport>>this.importPromise;
    };

    // Don't use this.  Pretend you didn't even see it.
    dangerouslyImportSync() {
        if (!this.isLoaded()) {
            throw new Error('Import is not available yet.');
        }

        return this.importValue;
    }

    tryImportForRender(): TImport | undefined {
        // Check if we already have the value.  It's important that we check
        // the loaded state via the store -- that way, if this method is called
        // during render(), the component will get rerendered once the import
        // is loaded.
        if (getConfig().isImportLoaded(this.id)) {
            return this.importValue;
        }

        // Kick off the import so that it will be available eventually
        this.import();
        return undefined;
    }

    isLoaded(): boolean {
        // Check whether we have ever loaded this import during this session.
        return getConfig().isImportLoaded(this.id);
    }

    /**
     * Tries to get a human-readable name for this import
     */
    private _getImportNameForLogging(): string {
        // Names are not mangled across lazy imports, so we can do this hack to try to find the property access
        const getterString = this.getter.toString();
        try {
            const match = getterString.match(IMPORT_ID_REGEX);
            return match && match.length > 1 ? match[1] : getterString;
        } catch {
            return getterString;
        }
    }
}
