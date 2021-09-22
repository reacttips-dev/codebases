/**
 * Display site info for a site
 * Dependencies: jquery.tipsy.min.js
 */
$.fn.infoTip = function (options) {
    var $elements = this;

    function init() {
        $.each($elements, function (index, el) {
            var $el = $(el);
            var $siteSelector =
                options.siteSelector === undefined ? $(el) : $(el).find(options.siteSelector);
            var shortUrl = getShortUrl($siteSelector);

            var tipsy = $el.tipsy({
                gravity: options.gravity || "w",
                fade: false,
                html: true,
                delayIn: options.delayIn || 0,
                delayOut: options.delayOut || 0,
                offset: options.offset || 0,
                offsetY: function (pos, gravity) {
                    var t = $(document).scrollTop() - (pos.top - this.$tip.height());
                    if (t > 0) {
                        return t;
                    }
                    var d =
                        pos.top +
                        this.$tip.height() -
                        ($(document).scrollTop() + $(window).height());
                    return d > 0 ? -d : 0;
                },
                live: options.live || false,
                trigger: options.trigger || "hover",
                className: options.className || "",
                title: function () {
                    var tipsyElement = $.data(this, "tipsy");
                    var output =
                        "<div class='" +
                        options.className +
                        "'><div class='message'>{0}</div></div>";

                    if (!window.siteInfoData) {
                        window.siteInfoData = {};
                    }

                    shortUrl = getShortUrl($siteSelector);
                    var siteInfoData = window.siteInfoData[shortUrl];

                    if (siteInfoData) {
                        var t = setTimeout(function () {
                            var desc = tipsyElement.$tip.find(".full-description");
                            desc.height(desc.find("p").height());
                            clearTimeout(t);
                        }, 10);
                        return siteInfoData === ""
                            ? output.replace(
                                  "{0}",
                                  "Currently there is no data available for this site",
                              )
                            : siteInfoData;
                    } else {
                        var cachedRequest = $.ajax({
                            url: options.handler,
                            type: "POST",
                            data: { shorturl: shortUrl },
                            dataType: "html",
                        });

                        cachedRequest
                            .done(function (data) {
                                data =
                                    data === ""
                                        ? output.replace(
                                              "{0}",
                                              "Currently there is no data available for this site",
                                          )
                                        : data;
                                var ne = tipsyElement.$tip.find(".tipsy-inner").html(data);
                                ne.find(".full-description").height(
                                    ne.find(".full-description p").height(),
                                );
                                window.siteInfoData[shortUrl] = data;
                                tipsy.tipsy("reposition");
                            })
                            .error(function (reason) {
                                if (reason.status === 0) {
                                    return;
                                }
                                var data;
                                if (reason.status == 404) {
                                    data = "Currently there is no data available for this site";
                                } else {
                                    data = "An error has occurred";
                                }
                                tipsyElement.$tip.find(".tipsy-inner").html(data);
                                window.siteInfoData[shortUrl] = data;
                            });

                        return output.replace("{0}", "Loading site info<br/>Please wait...");
                    }
                },
            });
        });

        function getShortUrl($el) {
            return $el.text().trim();
        }
    }

    if ($.type(options) === "string") {
        $(this).tipsy(options);
        return;
    }

    init();
};
