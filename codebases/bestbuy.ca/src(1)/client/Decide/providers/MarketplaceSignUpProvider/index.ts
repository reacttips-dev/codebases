export interface SignUpProvider<T> {
    postSignUp: (data: T, serialize: (val: T) => string) => Promise<Response>;
}

export class MarketplaceSignUpProvider<T> implements SignUpProvider<T> {
    private url: string;

    constructor(baseUrl: string) {
        this.url = baseUrl;
    }

    public async postSignUp(data: T, serialize: (val: T) => string): Promise<Response> {
        return await fetch(this.url, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: serialize(data),
        });
    }
}

export default MarketplaceSignUpProvider;
