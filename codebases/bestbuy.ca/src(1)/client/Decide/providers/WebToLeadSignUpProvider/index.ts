import {serializeObject} from "utils/serializer";

export interface SignUpProvider {
    postSignUp: (data: object) => Promise<Response>;
}

export class WebToLeadSignUpProvider implements SignUpProvider {
    private url: string;

    constructor(baseUrl: string) {
        this.url = baseUrl;
    }

    public async postSignUp(data: object): Promise<Response> {
        return fetch(this.url, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: serializeObject(data),
        });
    }
}

export default WebToLeadSignUpProvider;
