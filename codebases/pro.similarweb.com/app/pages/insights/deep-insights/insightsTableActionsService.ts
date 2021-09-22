export class InsightsTableActionsService {
    public async download(ids: string[], timestamp: string): Promise<any> {
        if (!ids || !ids.length) {
            return;
        }
        const url: string = `/api/deep-insights/download?timestamp=${timestamp}`;
        let requestOpts: RequestInit = {
            body: JSON.stringify(ids),
            method: "POST",
            credentials: "same-origin",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
        var response: any = await fetch(url, requestOpts);

        if (!response.ok) {
            return Promise.reject(response.statusText);
        }

        return Promise.resolve(response);
    }
}
