export class RecaptchaUnavailableError extends Error {}

export class RecaptchaUnavailable {
    async execute() {
        throw new RecaptchaUnavailableError();
    }
}

export default class Recaptcha {
    constructor({
        recaptcha,
        container,
        siteKey
    }) {
        this.ready = new Promise((resolve, _reject) => {
            recaptcha.ready(() => {
                const widgetId = recaptcha.render(container, {
                    sitekey: siteKey,
                    size: 'invisible',
                    callback: (token) => {
                        recaptcha.reset(widgetId);
                        if (this.callback) {
                            this.callback(token);
                        }
                    },
                });
                resolve({
                    recaptcha,
                    widgetId
                });
            });
        });
    }

    async executeImpl() {
        if (this.pendingExecute) {
            await this.pendingExecute;
        }
        const {
            recaptcha,
            widgetId
        } = await this.ready;
        recaptcha.execute(widgetId);
        const token = await new Promise((resolve, _reject) => {
            this.callback = (response) => {
                resolve(response);
            };
        });
        return token;
    }

    async execute() {
        this.pendingExecute = this.executeImpl();
        return this.pendingExecute;
    }
}