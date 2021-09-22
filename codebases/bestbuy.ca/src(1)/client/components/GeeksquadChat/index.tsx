interface Window {
    ChatApp?: {
        init: (selector: string[]) => any;
    };
}

export const launchSelector = "launchGeekSquadChat";

const entrySelectors = ["[href*=enableGeeksquadChat]", `.${launchSelector}`];

export const GeeksquadChat = (geeksquadChatUrl: string, onLoadError: () => void) => {
    if (isChatAppUndefined()) {
        buildScript(geeksquadChatUrl, onLoadError);
    }
    return null;
};

const buildScript = (geeksquadChatUrl: string, onLoadError: () => void) => {
    const script = document.createElement("script");

    script.onload = () => {
        try {
            return initScript();
        } catch (error) {
            handleError(onLoadError);
        }
    };

    script.onerror = () => {
        handleError(onLoadError);
    };

    script.src = geeksquadChatUrl;
    document.body.appendChild(script);

};

const initScript = () => (window as Window).ChatApp.init(entrySelectors);

const handleError = (onLoadError: () => void) => {
    document.addEventListener(
        "click",
        (e) => {
            const targetEl = e.target as HTMLElement;
            if (targetEl.closest(entrySelectors.join(",")) && isChatAppUndefined()) {
                e.preventDefault();
                e.stopPropagation();
                onLoadError();
            }
        },
        true
    );
};

const isChatAppUndefined = () => typeof (window as Window) !== "undefined" && typeof (window as Window).ChatApp === "undefined";

export default GeeksquadChat;
