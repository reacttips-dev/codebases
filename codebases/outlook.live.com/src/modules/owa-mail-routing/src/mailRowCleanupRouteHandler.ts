export default function mailRowCleanupRouteHandler(
    oldRoute?: string[],
    oldParameters?: any,
    newRoute?: string[],
    newParameters?: any
) {
    return !!newRoute && newRoute.some(value => value == 'search');
}
