export const SYNDIGO_FRENCH_SITE_ID = "aeddf3f6-31dd-4025-902b-43ee682ebcd3";
export const SYNDIGO_ENGLISH_SITE_ID = "24a8cfc8-a10e-4452-b92a-de23fd19583c";

export const OneWorldSync = `
        var ccs_cc_args = ccs_cc_args || [];

        (function () {
            // Set subscriber key and hook id
            let o = ccs_cc_args;
            o.push(['_SKey', '9a0ba13d']);
            o.push(['_ZoneId', '3b41c554f5']);
            o.push(['_host', 'ws.cnetcontent.com']);

            // Append cdn.cnetcontent.com/jsc/cl.js to script section.
            // Can be changed to implicit appending script tag in the head section
            let sc = document.createElement('script');
            sc.type = 'text/javascript';
            sc.async = true;
            sc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.cnetcontent.com/jsc/cl.js';
            let n = document.getElementsByTagName('script')[0];
            n.parentNode.insertBefore(sc, n);

            // helper function for setting param value into ccs_cc_args array
            window.ccs_cc_set_param = function (p, v) {
                let o = ccs_cc_args;
                let r = null;
                for (let i = 0; i < o.length; i++) {
                    if (o[i][0].toLowerCase() === p.toLowerCase()) {
                        r = o[i];
                        break;
                    }
                }
                if (r != null) {
                    r[1] = v;
                }
            }

            // helper function for getting param value from ccs_cc_args by specified param name
            const gp = (p) => {
                let o = ccs_cc_args;
                let r = '';
                for (let i = 0; i < o.length; i++) {
                    if (o[i][0].toLowerCase() === p.toLowerCase()) {
                        r = o[i][1];
                        break;
                    }
                }
                return r;
            }

            // loading content function. Content params should be set in the ccs_cc_args array
            window.ccs_cc_load_content = function () {
                // initialize singleton ccs_cc_contentloader with "ccs_cc_main_loader" name
                if (window.ccs_cc_contentloader_main == undefined && ccs_cc_contentloader) {
                    window.ccs_cc_contentloader_main = new ccs_cc_contentloader("ccs_cc_main_loader");
                }

                // remove already loaded content
                window.ccs_cc_contentloader_main.removeAll();

                // remove already loaded script
                if (window.ccs_cc_loadedScript != undefined && sc != null) {
                    window.ccs_cc_loadedScript.parentNode.removeChild(window.ccs_cc_loadedScript);
                }

                // combine url from set params. Set the ldname param the same as ccs_cc_contentloader name ("ccs_cc_main_loader")
                let s = gp("_SKey") + "/script/" + gp("_ZoneId") + "?ldname=ccs_cc_main_loader&host=" + gp("_host") + "&cpn=" + gp("cpn") + "&mf=" + gp("mf") + "&pn=" + gp("pn") + "&upcean=" + gp("upcean") + "&ccid=" + gp("ccid") + "&lang=" + gp("lang") + "&market=" + gp("market");

                // call content loading
                window.ccs_cc_loadedScript = window.ccs_cc_contentloader_main.call(s);
            }
        })();
`;

export const getSyndigoScript = (siteId: string): string => {
    return `
    (function (s, y, n, di, go){
        di = s.createElement(y); di.type = 'text/java'+y; di.async = true; di.src = n + Math.floor(Date.now() / 86400000); go = s.getElementsByTagName(y)[0]; go.parentNode.insertBefore(di,go); }
        (document,'script', "https://content.syndigo.com/site/${siteId}/tag.js?cv="));`;
};
