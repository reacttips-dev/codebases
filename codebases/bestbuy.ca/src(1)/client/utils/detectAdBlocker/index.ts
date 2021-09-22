// detect ad blocker

export const detectAdBlocker = () => {
    const blockedElement = document.createElement("div");
    blockedElement.className =
        "pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links ad-text adSense adBlock adContent adBanner";
    blockedElement.setAttribute(
        "style",
        "width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;",
    );
    document.body.appendChild(blockedElement);
    return (
        window.document.body.getAttribute("abp") != null ||
        blockedElement.offsetParent == null ||
        blockedElement.offsetHeight === 0 ||
        blockedElement.offsetLeft === 0 ||
        blockedElement.offsetTop === 0 ||
        blockedElement.offsetWidth === 0 ||
        blockedElement.clientHeight === 0 ||
        blockedElement.clientWidth === 0
    );
};
