import angular from "angular";

angular.module("shared").directive("tagCloud", function () {
    var colors = [
        "#CBDD97",
        "#bd9e39",
        "#8ca252",
        "#843c39",
        "#393b79",
        "#dd9bd2",
        "#d6616b",
        "#8c6d31",
        "#b5cf6b",
        "#7b4173",
        "#e7969c",
        "#ce6dbd",
        "#e7ba52",
    ];

    return {
        restrict: "EA",
        scope: {
            tags: "=",
        },
        link: function (scope, element, attrs) {
            var $element = $(element);

            scope.$watch("tags", function (tags) {
                $element.html("");

                if (tags && tags.length === 0) {
                    return;
                }

                /* Creating the tag elements here instead of using template because we need them renderd before the link phase finished */
                var items = [];
                angular.forEach(tags, function (tag) {
                    var title = tag[attrs.key || "Name"],
                        value = tag[attrs.value || "Value"] * 1000;

                    var $li = $("<li />")
                        .attr("data-weight", value)
                        .attr("value", value)
                        .text(title);
                    items.push($li);
                });
                $element.append(items);

                var settings = {
                    size: {
                        grid: 3, // word spacing, smaller is more tightly packed
                        factor: 0, // font resize factor, 0 means automatic
                        normalize: true, // reduces outliers for more attractive output
                    },
                    wordColor: function () {
                        return colors[Math.floor(Math.random() * (colors.length - 1))];
                    },
                    color: {
                        start: "#CDE", // color of the smallest font, if options.color = "gradient""
                        end: "#F52", // color of the largest font, if options.color = "gradient"
                    },
                    options: {
                        color: "", // if "random-light" or "random-dark", color.start and color.end are ignored
                        rotationRatio: 0, // 0 is all horizontal, 1 is all vertical
                        printMultiplier: 1, // set to 3 for nice printer output; higher numbers take longer
                        sort: "random", // "highest" to show big words first, "lowest" to do small words first, "random" to not care
                    },
                    font: "Roboto, sans-serif", // the CSS font-family string
                    shape: "ellipse", // the selected shape keyword, or a theta function describing a shape
                };

                $element.attr("id", new Date().getTime());
                $element.awesomeCloud(settings);
            });
        },
    };
});
