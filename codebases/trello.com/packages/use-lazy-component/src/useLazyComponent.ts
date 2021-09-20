import {
  useEffect,
  lazy,
  ComponentType,
  useRef,
  LazyExoticComponent,
} from 'react';
import { importWithRetry } from './importWithRetry';

// We don't care about what kind of React component we are importing, just that
// it _is_ a Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;

/**
 * A type representing a module with a default exported react component
 */
interface ModuleWithDefaultExport<TComponent extends AnyComponent> {
  default: TComponent;
}

/**
 * A type representing a dynamically imported module with a default exported
 * react component
 */
type DefaultImportFactory<TComponent extends AnyComponent> = () => Promise<
  ModuleWithDefaultExport<TComponent>
>;

/**
 * A type representing a module with a named exported react component
 */
type ModuleWithNamedExport<
  TComponent extends AnyComponent,
  TNamedImport extends string
> = {
  [t in TNamedImport]: TComponent;
};

/**
 * A type representing a dynamically imported module with a named exported react
 * component
 */
type NamedImportFactory<
  TComponent extends AnyComponent,
  TNamedImport extends string
> = () => Promise<ModuleWithNamedExport<TComponent, TNamedImport>>;

/**
 * The options provided to useLazyComponentOptions that configure it's behaviour
 * like whether to load as soon as the hook is invoked, and the named import to
 * pluck from the module
 */
interface UseLazyComponentOptions<
  TComponent extends AnyComponent,
  TNamedImport extends string
> {
  preload?: boolean;
  namedImport?: keyof ModuleWithNamedExport<TComponent, TNamedImport>;
}

/**
 * Lazily load a component from a module with a default exported react component
 * @param factory A dynamically imported module
 * @param options Options for configuring useLazyComponent's behavior
 * @param options.preload Boolean indicating whether to start downloading the
 * chunk as soon as the hook is invoked vs waiting for the lazy component to be
 * rendered
 */
export function useLazyComponent<TComponent extends AnyComponent>(
  factory: DefaultImportFactory<TComponent>,
  options?: { preload?: boolean },
): LazyExoticComponent<TComponent>;

/**
 * Lazily load a component from a module with a default named react component
 * @param factory A dynamically imported module
 * @param options Options for configuring useLazyComponent's behavior
 * @param options.preload Boolean indicating whether to start downloading the
 * chunk as soon as the hook is invoked vs waiting for the lazy component to be
 * rendered
 * @param options.namedImport The string name of the named import from the
 * dynamically imported module
 */
export function useLazyComponent<
  TComponent extends AnyComponent,
  TNamedImport extends string
>(
  factory: NamedImportFactory<TComponent, TNamedImport>,
  options: {
    namedImport: keyof ModuleWithNamedExport<TComponent, TNamedImport>;
    preload?: boolean;
  },
): LazyExoticComponent<TComponent>;

/**
 * A hook which lazily downloads the bundle for the specified component
 * @param factory A function that returns a dynamic import eg. `() =>
 * import('app/src/components/MyComponent')`
 * @param options Options for configuring useLazyComponent's behavior
 * @param options.namedImport The string name of the named import from the
 * dynamically imported module
 * @param options.preload Boolean indicating whether to start downloading the
 * chunk as soon as the hook is invoked vs waiting for the lazy component to be
 * rendered
 */
export function useLazyComponent<
  TComponent extends AnyComponent,
  TNamedImport extends string
>(
  factory:
    | DefaultImportFactory<TComponent>
    | NamedImportFactory<TComponent, TNamedImport>,
  {
    namedImport,
    preload,
  }: UseLazyComponentOptions<TComponent, TNamedImport> = {
    preload: true,
  },
): LazyExoticComponent<TComponent> {
  const lazyRef = useRef<LazyExoticComponent<TComponent>>();

  useEffect(
    () => {
      if (preload) {
        // Attempt to preload the async chunk with retries, but we don't care
        // if it fails at this point (it will become a failure we _do_ care about
        // when actually trying to render the lazy component)
        importWithRetry(factory as () => Promise<unknown>).catch((e) => {
          console.error('Failed to preload chunk', e);
        });
      }
    },

    // We don't want function reference changes to 'factory' to trigger it being
    // called again. This should never happen, once we've kicked off the
    // download of the async component, we don't ever need to kick it off again
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [preload],
  );

  // If we have already created the lazy component, return it here to avoid
  // repeated calls to lazy()
  if (lazyRef.current) {
    return lazyRef.current;
  }

  if (namedImport) {
    // If we are dealing with a namedImport, we need to map the module import
    // promise to something that looks like module with a default export so that
    // `lazy()` will accept it
    const namedImportFactory = factory as NamedImportFactory<
      TComponent,
      TNamedImport
    >;
    const mappedToDefaultFactory = () =>
      namedImportFactory().then((module) => ({
        default: module[namedImport],
      }));
    lazyRef.current = lazy(() => importWithRetry(mappedToDefaultFactory));
  } else {
    // Otherwise, we are dealing with a default export, which `lazy()` will
    // support
    const defaultImportFactory = factory as DefaultImportFactory<TComponent>;
    lazyRef.current = lazy(() => importWithRetry(defaultImportFactory));
  }

  return lazyRef.current;
}
