import { getUuid } from "UtilitiesAndConstants/UtilityFunctions/crypto";
declare const window: any;

export const legacyBootstrap = async ({ i18n, startup, clonedRes, trackManagementData }) => {
    const NoCacheHeaders = {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
    };

    // duplicate headers definition since we cannot `import` modules from our code base in this file
    const ApiHeaders = {
        "X-Sw-Page": location.href,
        "X-Sw-Page-View-Id": getUuid(),
    };

    // assure similarweb on window
    window.similarweb = window.similarweb || {};
    const LOGGING_TAG = "Bootstrap";
    const $ = window.jQuery;
    function startNrInteraction(name) {
        const int = window.newrelic && window.newrelic.interaction();
        if (int) {
            int.setName(name);
            int.save();
        }

        return {
            setAttrs(userName, userId, url) {
                if (int) {
                    int.setAttribute("Pro-Module", "bootstrap");
                    int.setAttribute("Pro-Page", name);
                    int.setAttribute("UserName", userName);
                    int.setAttribute("UserId", userId);
                    int.setAttribute("FullUrl", url);
                    int.save();
                }
            },
            end() {
                if (int) {
                    int.end();
                }
            },
        };
    }

    const allInteraction = startNrInteraction("Bootstrap All");

    function onError(reason): void {
        if (reason === "reload") {
            window.location.reload(true);
        } else {
            location.href = "https://www.similarweb.com/error/servererror";
        }
    }

    function loadGtm(googleTag): void {
        window.GTM = googleTag;
        $(() => {
            $(document).trigger("GTMReady");
        });
    }

    function serverLogger(message, e): Promise<void> {
        const deferred = $.Deferred();

        const stack = (e && e.stack) || new Error().stack;
        // post error to the server
        $.ajax({
            method: "POST",
            url: "/api/exception",
            data: JSON.stringify({
                message,
                tag: LOGGING_TAG,
                stack,
                url: window.location.href,
                level: "Error",
            }),
            headers: jQuery.extend(
                {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                },
                ApiHeaders,
            ),
        }).always(() => {
            deferred.resolve();
        });
        try {
            if (window.newrelic) {
                window.newrelic.noticeError(e, { message, stack });
            }
        } catch (e) {
            // noop
        }
        return deferred.promise();
    }

    function formatErrorMessage(jqXHR, url): string {
        const status = jqXHR.status;
        const statusText = jqXHR.statusText;
        let headers = "";
        if (jqXHR.getAllResponseHeaders) {
            headers = jqXHR.getAllResponseHeaders();
        }
        const message =
            "Cannot load " +
            url +
            ". Status code: " +
            status +
            ". Status text: " +
            statusText +
            ". headers: " +
            headers;
        return message;
    }

    try {
        window.trackManagementData = trackManagementData;
        if (typeof window.entryPoint === "string") {
            eval(window.entryPoint);
        }
        $.ajax("api/googletag", { headers: ApiHeaders })
            .done(loadGtm)
            .fail((jqXHR, textStatus) => {
                if (jqXHR.status === 0) {
                    return;
                }
                const message = formatErrorMessage(jqXHR, "api/googletag");
                serverLogger(message, textStatus);
            });
        if (window.similarweb?.settings?.user) {
            allInteraction.setAttrs(
                window.similarweb.settings.user.username,
                window.similarweb.settings.user.id,
                location.href,
            );
        }
        allInteraction.end();
    } catch (e) {
        let startupString;
        try {
            startupString = await clonedRes.text();
        } catch {
            startupString = "from catch";
        }
        serverLogger(`error at parsing startup response:\n ${startupString}`, e).then(() => {
            onError("reload");
        });
    }
};
