import angular from "angular";
import { HelpWidgetStorage, IHelpWidgetStorage } from "help-widget/storage";
import { getArticleId } from "./resource/articleIds";

declare global {
    // tslint:disable-next-line:interface-name
    interface Window {
        AnswersWidget?: IAnswersWidget;
    }
}

export interface IAnswersWidget {
    onLoaded: (handler: () => void) => void;
    hide: () => void;
    show: () => void;
    open: () => void;
    close: () => void;
    goToArticle: (id: string) => void;
    // There's more: https://help.wixanswers.com/en/article/widget-client-sdk
    // add properties when you need them
}

type DerivedFromSDK = {
    [key in keyof Omit<IAnswersWidget, "onLoaded">]: (
        ...args: Parameters<IAnswersWidget[key]>
    ) => Promise<ReturnType<IAnswersWidget[key]>>;
};

export type IHelpWidget = DerivedFromSDK &
    Pick<IHelpWidgetStorage, "isArticleSeen"> & {
        isArticleAvailable: (id: string) => boolean;
    };

const SCRIPT_READY_EVENT = "AnswersWidgetReady";

export class HelpWidget implements IHelpWidget {
    private readonly storage: IHelpWidgetStorage;
    private readonly waitForLoad: () => Promise<IAnswersWidget>;

    constructor($window: Window) {
        const scriptReady = new Promise((resolve) =>
            $window.AnswersWidget
                ? resolve(null)
                : $window.document.addEventListener(SCRIPT_READY_EVENT, resolve, {
                      once: true,
                      capture: true,
                  }),
        );
        const widgetLoaded = () =>
            new Promise<void>((resolve) => {
                $window.AnswersWidget.onLoaded(() => resolve());
            });

        this.storage = new HelpWidgetStorage();
        this.waitForLoad = () => scriptReady.then(widgetLoaded).then(() => $window.AnswersWidget);
    }

    public hide = () => this.waitForLoad().then((widget) => widget.hide());

    public show = () => this.waitForLoad().then((widget) => widget.show());

    public open = () => this.waitForLoad().then((widget) => widget.open());

    public close = () => this.waitForLoad().then((widget) => widget.close());

    public goToArticle = (id) =>
        this.waitForLoad().then((widget) => {
            const trueArticleId = getArticleId(id);

            if (trueArticleId) {
                widget.goToArticle(trueArticleId);
                this.storage.markArticleSeen(id);
            }
        });

    public isArticleSeen(id) {
        return this.storage.isArticleSeen(id);
    }

    public isArticleAvailable(id) {
        return !!getArticleId(id);
    }
}

angular.module("sw.common").service("helpWidget", HelpWidget);
