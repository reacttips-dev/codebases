// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import buildOnRoute from 'bundles/webpack/lazybuild/components/buildOnRoute';
import { Router } from 'react-router';

type GetComponent = (
  nextState: Router.RouterState,
  cb: (error: any, component?: Router.RouteComponent) => void
) => void;

type ImportPromise = () => Promise<{ default: Router.RouteComponent }>;
type ModuleFactory = (x: (module?: Router.RouteComponent) => void) => void;
type BuildOnRoute = { moduleName: string };

const createAsyncHandler = (moduleFactory: ModuleFactory): GetComponent => {
  // This is the
  // [getComponents](https://github.com/reactjs/react-router/blob/bd9f53f/docs/API.md#getcomponentsnextstate-callback)
  // callback from `react-router`
  return (_nextState, cb) => moduleFactory((_module) => cb(null, _module));
};

// importModulePromiseFactory: () => import(path)
const createAsyncHandlerWithPromise = (importModulePromiseFactory: ImportPromise): GetComponent =>
  // This is the
  // [getComponents](https://github.com/reactjs/react-router/blob/bd9f53f/docs/API.md#getcomponentsnextstate-callback)
  // callback from `react-router`
  (_nextState, cb) => {
    importModulePromiseFactory()
      .then((Module) => cb(null, Module.default))
      .catch((err) => console.log('Dynamic route loading failed', err)); // eslint-disable-line no-console
  };

export default (mod: ImportPromise | ModuleFactory | BuildOnRoute): GetComponent => {
  // For loadOnRoute(() => import(path)) - Recommended
  if (typeof mod === 'function' && mod.length === 0) {
    return createAsyncHandlerWithPromise(mod as ImportPromise);
    // Purely for dev purposes, `buildOnRoute` lazily builds Webpack chunks.
  } else if ('moduleName' in mod) {
    return buildOnRoute(mod);
    // @ts-expect-error Throw error for incorrect usages: loadOnRoute(import())
  } else if (mod.then) {
    throw new Error(
      'Should not pass in a raw import(...) statement to `loadOnRoute` as ' +
        'it will not lazily load the code! ' +
        'Please pass in a promise factory like `() => import(...) instead.'
    );
    // Default: Assume it is a module factory created with the `lazy!` bundle-loader, which is the
    // only behavior previously supported by `loadOnRoute`.
  } else {
    return createAsyncHandler(mod as ModuleFactory);
  }
};
