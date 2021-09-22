export default function removeDuplicateSlashInURL(url) {
    return typeof url === "string" ? url.replace(/([^:]\/)\/+/g, "$1") : url;
}
//# sourceMappingURL=index.js.map