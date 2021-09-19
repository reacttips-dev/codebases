const cookieTracking = () => {
    // Add details like domain and parameters to track here in the Options object
    const Options = {
        domain: "sendbird.com",
        cookiePrefix: "_sb_",
        params: [
            "utm_medium",
            "utm_source",
            "utm_campaign",
            "utm_term",
            "utm_content",
        ],
        inputs: {
            'utm_medium': document.querySelectorAll("input[name='UTM_Medium_LT__c']"),
            'utm_source': document.querySelectorAll("input[name='UTM_Source_LT__c']"),
            'utm_campaign': document.querySelectorAll("input[name='UTM_Campaign_LT__c']"),
            'utm_term': document.querySelectorAll("input[name='UTM_Term_LT__c']"),
            'utm_content': document.querySelectorAll("input[name='UTM_Content_LT__c']"),
        },
        organicReferrers: [
            'google',
            'yahoo',
            'bing',
            'naver',
            'baidu',
            'duckduckgo',
            'yandex'
        ]
    };

    const _getParam = (p) => {
        const match = RegExp('[?&]' + p + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    const _setCookie = (cname, cvalue) => {
        let domain = "";

        if(window.location.href.indexOf(Options.domain) > -1) {
            domain = '.' + Options.domain;
        } else {
            domain = "." + location.hostname;
        }

        document.cookie = cname + "=" + cvalue + ";" + "path=/" + ";" + "domain=" + domain;
    }

    const _getCookie = (cname) => {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // Read URL parameters and save them into cookies
    const saveTrackingData = () => {    
        Options.params.forEach(function(param, index) {
            if (!!_getParam(param)) {
                let paramValue = _getParam(param);
                _setCookie(Options.cookiePrefix + param, paramValue);
            }
        });
    }

    // Read saved cookies and put them into form fields
    const loadTrackingData = () => {
        Options.params.forEach(function(cookieName, index) {
            if (!!_getCookie(Options.cookiePrefix + cookieName)) {
                let cookieValue = _getCookie(Options.cookiePrefix + cookieName);
                // Store cookie values into the defined form fields here:
                if (Options.inputs[cookieName].length > 0) {
                    Options.inputs[cookieName].forEach(function(field) {
                        field.value = cookieValue;
                    });
                }

            }
        });
    }

    // Set medium and source if no UTM present and referrer is a known organic referrer
    const setOrganicData = () => {
        let queryString = window.location.search;
        let referrer = document.referrer;
        let cookies = document.cookie;

        Options.organicReferrers.forEach(function(ref, index) {
            if (referrer.indexOf(ref) > -1) {
                referrer = ref;
            }
        });

        if(queryString.indexOf('utm') == -1 && cookies.indexOf('_sb_utm') == -1 && !!referrer){
            _setCookie(Options.cookiePrefix + 'utm_medium', 'organic');
            _setCookie(Options.cookiePrefix + 'utm_source', referrer);
        }
    }

    setOrganicData();
    saveTrackingData();
    loadTrackingData();
    
};

window.addEventListener("load", function() {
    cookieTracking();
    if (typeof MktoForms2 !== 'undefined' && typeof MktoForms2 !== undefined) {
        MktoForms2.whenReady(function() {
            cookieTracking();
        });
    }
});