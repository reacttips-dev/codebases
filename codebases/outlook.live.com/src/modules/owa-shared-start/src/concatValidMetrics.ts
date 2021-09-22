export function concatValidMetrics(query: string, prop: string, metricObject: Object): string {
    if (metricObject[prop] != null && metricObject[prop] != undefined) {
        return query.concat(`&${prop}=${metricObject[prop]}`);
    } else {
        return query;
    }
}
