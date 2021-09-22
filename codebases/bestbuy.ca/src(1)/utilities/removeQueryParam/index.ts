export default (url, parameter) => {
    const splitUrl = url.split("?");
    if (splitUrl.length >= 2) {
        const prefix = `${encodeURIComponent(parameter)}=`;
        const pars = splitUrl[1].split(/[&]/g);
        for (let i = pars.length; i-- > 0;) {
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }
        url = splitUrl[0] + (pars.length > 0 ? `?${pars.join("&")}` : "");
    }
    return url;
};
//# sourceMappingURL=index.js.map