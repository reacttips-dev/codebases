import { Middleware, applyMiddleware } from 'satcheljs';
import { LegacyMiddleware, legacyApplyMiddleware } from 'satcheljs/lib/legacy';

const cachedMiddleware: Middleware[] = [];
const cachedLegacyMiddleware: LegacyMiddleware[] = [];

export function addNewMiddleWare(middlewares: Middleware[], legacyMiddlewares: LegacyMiddleware[]) {
    for (let middleware of middlewares) {
        cachedMiddleware.push(middleware);
    }

    for (let legacyMiddleware of legacyMiddlewares) {
        cachedLegacyMiddleware.push(legacyMiddleware);
    }

    applyMiddleware.apply(null, cachedMiddleware);
    legacyApplyMiddleware.apply(null, cachedLegacyMiddleware);
}
