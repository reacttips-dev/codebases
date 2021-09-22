import {serializeObject} from "utils/serializer";

export interface CaseSignUpProvider {
    postSignUp: (data: object) => Promise<Response>;
}

export class WebToCaseSignUpProvider implements CaseSignUpProvider {
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

export default WebToCaseSignUpProvider;
