import * as React from "react";

export interface FlixMediaProps {
    modelNumber: string;
    distributor: string;
    fallbackLanguage: string;
    language: string;
    brand: string;
    sku: string;
}
export const FlixMedia: React.FC<FlixMediaProps> = ({
    sku,
    language,
    modelNumber,
    brand,
    fallbackLanguage,
    distributor,
}) => {
    React.useEffect(() => {
        if (sku && language) {
            loadFlixScript();
        }

        return () => {
            cleanUp();
        };
    }, [sku, language]);

    const loadFlixScript = () => {
        cleanUp();
        const flixScript = document.createElement("script");
        flixScript.async = true;
        flixScript.src = "//media.flixfacts.com/js/loader.js";
        flixScript.setAttribute("data-flix-distributor", distributor);
        flixScript.setAttribute("data-flix-language", language);
        flixScript.setAttribute("data-flix-fallback-language", fallbackLanguage);
        flixScript.setAttribute("data-flix-brand", brand);
        flixScript.setAttribute("data-flix-mpn", modelNumber);
        flixScript.setAttribute("data-flix-sku", sku);
        flixScript.setAttribute("data-flix-inpage", "flix-inpage");
        flixScript.setAttribute("data-flix-button", "");
        document.head.appendChild(flixScript);
    };

    const cleanUp = () => {
        const flixResourceDomain = ["flixcar.com", "flixfacts.com", "flix360.com"];
        // remove flix related css/js
        const flixScripts: HTMLCollectionOf<HTMLScriptElement> = document.getElementsByTagName("script");
        const flixLinks: HTMLCollectionOf<HTMLLinkElement> = document.getElementsByTagName("link");
        const flixScriptsLength = flixScripts.length;
        const flixLinksLength = flixLinks.length;

        for (let j = flixScriptsLength - 1; j > 0; j--) {
            if (flixResourceDomain.some((str) => flixScripts[j].src.includes(str))) {
                flixScripts[j].parentNode?.removeChild(flixScripts[j]);
            }
        }
        for (let k = flixLinksLength - 1; k > 0; k--) {
            if (flixResourceDomain.some((flixDomain) => flixLinks[k].href.includes(flixDomain))) {
                flixLinks[k].parentNode?.removeChild(flixLinks[k]);
            }
        }

        // remove flixhotspot div
        document.getElementById("flix_hotspots")?.remove();

        const flixinPage = document.getElementById("flix-inpage");
        if (flixinPage) {
            flixinPage.innerHTML = "";
        }
    };

    return (
        <div id="FlixmediaContent">
            <div id="flix-inpage"></div>
            <div id="flix-minisite"></div>
        </div>
    );
};
