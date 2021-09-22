import angular from "angular";
export interface ISWSwitcherTemplateGenerator {
    createLinkElement(): HTMLLinkElement;
    updateLink(css: string): boolean;
    generateTemplate(): string;
    updateWidth(width: number);
    updateGUID(guid: string);
    unlinkElement();
    appendToDocument();
    removeFromDocument();
}
// took from here  https://github.com/webpack/style-loader/blob/master/addStyles.js
// original idea taken from style-loader for webpack

export class SWSwitcherTemplateGenerator implements ISWSwitcherTemplateGenerator {
    private linkElement: HTMLLinkElement;
    private guid: string;
    private width: number;
    private memo: Object;

    constructor(guid: string, width: number = 150) {
        this.guid = guid;
        this.linkElement = this.createLinkElement();
        this.clearMemo();
        this.updateWidth(width);
        this.appendToDocument();
    }

    public appendToDocument(): void {
        if (typeof document !== "undefined") {
            document.head.appendChild(this.linkElement);
        }
    }

    public removeFromDocument(): void {
        this.unlinkElement();
    }

    public updateWidth(width: number): void {
        if (width === this.width) return;
        this.width = width;
        this.updateLink(this.generateTemplate());
    }

    public updateGUID(guid: string): void {
        this.guid = guid;
        if (guid === this.guid) return;
        this.clearMemo();
        this.updateLink(this.generateTemplate());
    }

    public createLinkElement(): HTMLLinkElement {
        var linkElement = document.createElement("link");
        linkElement.rel = "stylesheet";
        return linkElement;
    }

    public updateLink(css: string): boolean {
        try {
            var blob: Blob = new Blob([css], { type: "text/css" });
            var oldSrc: string = this.linkElement.href;
            this.linkElement.href = URL.createObjectURL(blob);
            if (oldSrc) URL.revokeObjectURL(oldSrc);
            // console.log(this.linkElement);
            return true;
        } catch (e) {
            return false;
        }
    }

    public generateTemplate(): string {
        let template: string;
        if (this.memo && !!this.memo[this.width]) {
            return this.memo[this.width];
        } else {
            template = `
                    #${this.guid} .switcher-tab{
                        width: ${this.width}px;
                    }
                    #${this.guid} .switcher-slider-bolt{
                        width: ${this.width}px;
                    }
                    ${this.generateItemCss(4)}
                `;
            this.memo[this.width] = template;
            return template;
        }
    }

    private generateItemCss(num) {
        let _css = "";
        for (let i = 1; i <= num; i++) {
            _css += `#${
                this.guid
            } .switcher-tab.is-active:nth-child(${i}) ~ .switcher-slider > .switcher-slider-bolt{
                            transform: translate3d(${this.width * (i - 1)}px, 0, 0);
                        }`;
        }
        return _css;
    }

    public clearMemo() {
        this.memo = null; // let gc decide
        this.memo = {};
    }
    public unlinkElement() {
        this.linkElement.remove();
        this.clearMemo();
    }
}

angular.module("sw.common").factory("switcherTemplateGenerator", function () {
    return (guid: string, width: number = 150) => {
        return new SWSwitcherTemplateGenerator(guid, width);
    };
});
