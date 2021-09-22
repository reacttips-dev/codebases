import { LazyImport, LazyModule } from 'owa-bundling';
import type {
    ContextMenuProvider,
    IEditor,
    EditorPlugin,
    PluginEvent,
} from 'roosterjs-editor-types';
import type PluginUtils from 'owa-editor-plugin-utils/lib/schema/PluginUtils';
import type PluginNames from './PluginNames';
import isEditorPluginEx from 'owa-editor-plugin-utils/lib/utils/isEditorPluginEx';

// Lazy plugin interface
export interface LazyPlugin<T extends EditorPlugin> extends EditorPlugin {
    // Get the real plugin. If it is not imported yet, import it then return
    getPlugin: () => Promise<T>;

    // Check if real plugin is imported. This will not trigger the importing code
    isImported: () => boolean;

    // Add callback function to be invoked when real plugin is imported. If already imported, call it immediately
    addOnImportedCallback: (callback: OnImportedCallback<T>) => void;
}

// Callback function type, invoked when real plugin is imported
export type OnImportedCallback<T extends EditorPlugin> = (plugin: T) => void;

// LazyPlugin type object type
export type LazyPluginClass<T extends EditorPlugin, P extends any[]> = new (
    ...arg: P
) => LazyPlugin<T>;

// Import trigger function type
export type ImportTrigger = (evt: PluginEvent, editor: IEditor) => boolean;

// The real plugin type object type
export type PluginClass<T extends EditorPlugin, P extends any[]> = new (...args: P) => T;

/**
 * Create a Lazy editor plugin type
 * @param lazyModule lazyModule from which to get the PluginClass
 * @param getter function to get the PluginClass from the lazyModule once it is loaded
 * @param pluginName name of this plugin
 * @param importTrigger (optional) a function to check if the real plugin need to be loaded.
 * If null, the plugin will be loaded immediately when initialize
 * @param reusable (optional) Set to true to make the plugin instance reusable, so that after
 * the lazy plugin disposed and reinitialized, still reuse the same instance of real plugin
 * @example  (Suppose MyPlugin is the type of real plugin, myImportTrigger is the trigger function)
 *
 * import * as MyPluginModule from './MyPlugin';
 *
 * const lazyModule = new LazyModule(() =>
 *     import(
 *         \/* webpackChunkName: "MyPlugin" *\/ './MyPlugin'
 *     )
 * );
 *
 * export let LazyMyPluginClass = createLazyPlugin(
 *     lazyModule,
 *     m => m.default,
 *     myImportTrigger);
 *
 * When use this plugin:
 *    let myPlugin: LazyMyPlugin = new LazyMyPluginClass(...);
 *    let myRealPlugin = await myPlugin.getPlugin();
 */
export default function createLazyPlugin<
    TPlugin extends EditorPlugin,
    TParam extends any[],
    TModule
>(
    lazyModule: LazyModule<TModule>,
    getter: (module: TModule) => PluginClass<TPlugin, TParam>,
    pluginName: PluginNames,
    importTrigger?: ImportTrigger,
    reusable?: boolean
): LazyPluginClass<TPlugin, TParam> {
    return class implements LazyPlugin<TPlugin> {
        private pluginInstance: TPlugin;
        private editor: IEditor;
        private args: TParam;
        private onImportedCallbacks: OnImportedCallback<TPlugin>[] = [];
        private importPluginPromise: Promise<TPlugin>;
        private pluginUtils: PluginUtils;
        private pluginName: string;
        private pendingEvents: PluginEvent[];

        constructor(...args: TParam) {
            this.args = args;
            this.pluginName = pluginName;
        }

        initialize(editor: IEditor) {
            this.editor = editor;
            this.pendingEvents = [];

            if (this.pluginInstance) {
                this.initializeAndCallback();
            } else if (!importTrigger) {
                this.internalImport();
            }
        }

        dispose() {
            if (this.pluginInstance) {
                this.pluginInstance.dispose();

                if (!reusable) {
                    this.pluginInstance = null;
                }
            }
            this.editor = null;
            this.importPluginPromise = null;

            // reset to empty array in case this plugin is reused
            this.onImportedCallbacks = [];
        }

        getName() {
            return this.isImported() ? this.pluginInstance.getName() : this.pluginName;
        }

        setPluginUtils(pluginUtils: PluginUtils) {
            this.pluginUtils = pluginUtils;
            if (isEditorPluginEx(this.pluginInstance)) {
                this.pluginInstance.setPluginUtils(this.pluginUtils);
            }
        }

        getContextMenuItems(node: Node) {
            return this.isImported()
                ? (<ContextMenuProvider<any>>(
                      (<EditorPlugin>this.pluginInstance)
                  )).getContextMenuItems?.(node)
                : null;
        }

        onPluginEvent(event: PluginEvent) {
            if (this.pluginInstance) {
                if (this.pluginInstance.onPluginEvent) {
                    this.pluginInstance.onPluginEvent(event);
                }
            } else if (importTrigger?.(event, this.editor)) {
                this.internalImport(event);
            }
        }

        willHandleEventExclusively(event: PluginEvent) {
            if (this.pluginInstance && this.pluginInstance.willHandleEventExclusively) {
                return this.pluginInstance.willHandleEventExclusively(event);
            } else {
                return false;
            }
        }

        getPlugin(): Promise<TPlugin> {
            if (this.pluginInstance) {
                return Promise.resolve(this.pluginInstance);
            } else {
                return this.internalImport();
            }
        }

        isImported(): boolean {
            return !!this.pluginInstance;
        }

        addOnImportedCallback(callback: OnImportedCallback<TPlugin>) {
            if (this.isImported() && this.editor) {
                callback(this.pluginInstance);
            } else if (this.onImportedCallbacks) {
                this.onImportedCallbacks.push(callback);
            }
        }

        private initializeAndCallback() {
            this.pluginInstance.initialize(this.editor);
            this.onImportedCallbacks.forEach(callback => callback(this.pluginInstance));
        }

        private internalImport(event?: PluginEvent): Promise<TPlugin> {
            if (!this.importPluginPromise) {
                this.importPluginPromise = new LazyImport(lazyModule, getter)
                    .import()
                    .then(PluginClass => {
                        this.pluginInstance = new PluginClass(...this.args);
                        this.setPluginUtils(this.pluginUtils);

                        if (this.editor) {
                            this.initializeAndCallback();

                            if (
                                this.pendingEvents.length > 0 &&
                                this.pluginInstance.onPluginEvent
                            ) {
                                this.pendingEvents.forEach(event => {
                                    this.pluginInstance.onPluginEvent(event);
                                });
                            }

                            this.pendingEvents = [];
                        }

                        return this.pluginInstance;
                    });

                this.importPluginPromise.catch(() => {
                    this.pendingEvents = [];
                });
            }

            if (event) {
                this.pendingEvents.push(event);
            }

            return this.importPluginPromise;
        }
    };
}
