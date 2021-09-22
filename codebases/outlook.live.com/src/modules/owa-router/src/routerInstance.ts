// Using the browser specific directory router instance to assist builds to be faster
import { Router } from 'director-fork/build/director';

let router = new Router();
export default router;

export function getCurrentRoute() {
    return router.getRoute();
}
