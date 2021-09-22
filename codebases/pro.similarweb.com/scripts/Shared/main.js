(function (w, doc) {
    var $body = $(doc.body);

    //smooth scrolling for sticky header
    //exclude browsers that support smooth scrolling natively.
    // var page = $('body');
    // var platform = navigator.platform.toLowerCase();
    // var engine = navigator.userAgent.toLowerCase();
    // if (platform.indexOf('win') == 0 || platform.indexOf('linux') == 0) {
    //     if (engine.indexOf('webkit') > -1) {
    //         $(w).mousewheel(function(event){
    //             var delta = event.deltaY;
    //             if (delta < 0) page.scrollTop(page.scrollTop() + 100);
    //             else if (delta > 0) page.scrollTop(page.scrollTop() - 100);
    //             return false;
    //         });
    //     }
    // }

    //Tipsy - Site preview tooltips
    //@todo: after grid refactoring change to directive
    $body.on("mouseenter", "a.infotip", function () {
        // make sure infotip is loaded
        if (!jQuery.fn.infoTip) {
            return;
        }
        var element = $(this);
        if (element.data("hasInfoTip")) {
            return;
        }
        element.infoTip({
            handler: "/infotip",
            offset: 30,
            className: "infotip",
        });
        element.infoTip("show");
        element.data("hasInfoTip", true);
    });

    // hide infotip on click
    $body.on("click", "a.infotip", function () {
        var element = $(this);
        if (!element.data("hasInfoTip")) {
            return;
        }
        element.infoTip("hide");
    });

    // Fix for form search fields not to submit form on Enter click
    $body.on("keypress", "form input#enter-search", function (event) {
        if (event.keyCode === 13) {
            return false;
        }
    });

    // a.swap is not a function error in ng-grid
    $.swap = function (elem, options, callback, args) {
        var ret,
            name,
            old = {};

        // Remember the old values, and insert the new ones
        for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
        }

        ret = callback.apply(elem, args || []);

        // Revert the old values
        for (name in options) {
            elem.style[name] = old[name];
        }

        return ret;
    };
})(window, document);
