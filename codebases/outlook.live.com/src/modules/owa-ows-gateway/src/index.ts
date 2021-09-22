import { LazyAction, LazyModule } from 'owa-bundling';

const lazyIndex = new LazyModule(() => import(/* webpackChunkName: "OwsGateway" */ './lazyIndex'));

type lazyType = typeof import('./lazyIndex');

// OW 55102. We have to cast this functions because LazyAction has a bug where it doesn't assign the
// correct types with function that return any or Promise<any>
const makePostRequest = <(...args: Parameters<lazyType['makePostRequest']>) => Promise<any>>(
    new LazyAction(lazyIndex, m => m.makePostRequest).importAndExecute
);
const makePatchRequest = <(...args: Parameters<lazyType['makePatchRequest']>) => Promise<any>>(
    new LazyAction(lazyIndex, m => m.makePatchRequest).importAndExecute
);
const makePutRequest = <(...args: Parameters<lazyType['makePutRequest']>) => Promise<any>>(
    new LazyAction(lazyIndex, m => m.makePutRequest).importAndExecute
);
const makeGetRequest = <(...args: Parameters<lazyType['makeGetRequest']>) => Promise<any>>(
    new LazyAction(lazyIndex, m => m.makeGetRequest).importAndExecute
);
const makeDeleteRequest = <(...args: Parameters<lazyType['makeDeleteRequest']>) => Promise<any>>(
    new LazyAction(lazyIndex, m => m.makeDeleteRequest).importAndExecute
);

const makeGraphRequest = <(...args: Parameters<lazyType['makeGraphRequest']>) => Promise<any>>(
    new LazyAction(lazyIndex, m => m.makeGraphRequest).importAndExecute
);

const sendOwsPrimeRequest = <
    <T>(...args: Parameters<lazyType['sendOwsPrimeRequest']>) => Promise<T>
>new LazyAction(lazyIndex, m => m.sendOwsPrimeRequest).importAndExecute;

export {
    makePostRequest,
    makePatchRequest,
    makePutRequest,
    makeGetRequest,
    makeDeleteRequest,
    makeGraphRequest,
    sendOwsPrimeRequest,
};
