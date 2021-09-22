export const watermarkService = {
    add: function (options) {
        if (!this.renderer) {
            return;
        }
        var chart = this,
            initOptions = {
                width: 180, // image width
                height: 26, // image height
                zIndex: 3,
                opacity: 0.07,
                position: "bottomLeft",
                transform: "translate(0)",
                xOffset: 0, // x & y offsets are for cases in which design exception is requested
                yOffset: 0,
                // taken from /Images/logo-watermark.svg
                image:
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjk0IiBoZWlnaHQ9IjQ0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMy4yNzQgOS4zMjhjLS4zMzQtLjEwOS0uNjEyLS4yMTgtLjk0Ni0uMzI2LTUuMjMzLTEuNTIzLTguMTI4Ljk3OC04LjkwNyAzLjUzNC0xLjA1OCAzLjQ4LjcyMyA1Ljg3NCA1LjQ1NSA5LjQwOSA1LjczNCA0LjI5NiA4LjEyOCA4LjMyIDYuNDU4IDEzLjg2Ny0uNTAxIDEuNjMyLTEuMzM2IDMuMS0yLjQ1IDQuMjk2IDQuNjIxLTEuODQ5IDguNDA3LTUuNjU1IDkuOTY1LTEwLjcxMyAyLjQ1LTguMTU3LTEuNzgxLTE2LjY5NS05LjU3NS0yMC4wNjciIGZpbGw9IiMwOTI1NDAiLz48cGF0aCBkPSJNMTUuMzQ0IDI1Ljc0OGMtNS40MjctMy45ODQtOC4yMjEtOC4yOTctNi42NjMtMTMuNTkyYTkuODE3IDkuODE3IDAgMDEuOTE0LTIuMTgzYy00LjE5MiAxLjk2NS03LjUyMyA1LjY3Ny04LjkyIDEwLjQ4LTEuNDUxIDUuMDIzLS40ODQgMTAuMTU0IDIuMTUgMTQuMTkzIDEuODI2IDIuMjkzIDMuNjUzIDQuMDQgNy4yNTMgNS4wMjIgNC45NDQgMS4zNjUgOC44NjYtLjU0NiA5Ljk5NS00LjMxMiAxLjA3NC0zLjU0OC0uMzIzLTYuMTE0LTQuNzI5LTkuNjA4IiBmaWxsPSIjMDkyNTQwIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMzIuOTY4IDEwLjgxNGMtMS4wMzkgMC0xLjktLjMyMy0yLjU4My0uOTctLjY1My0uNjQ4LS45NzktMS40NzItLjk3OS0yLjQ2IDAtLjk4OS4zMjYtMS43OTUuOTc5LTIuNDEzLjY4My0uNjQ3IDEuNTQ0LS45NzEgMi41ODMtLjk3MSAxLjAzOCAwIDEuODg3LjMyNCAyLjU0Ljk3MS42ODMuNjE4IDEuMDI3IDEuNDI0IDEuMDI3IDIuNDEzIDAgLjk4OC0uMzQ0IDEuODA2LTEuMDI3IDIuNDYtLjY1My42NDctMS41MDIuOTctMi41NC45N3ptLTMuMTU5IDI3LjQ0NlYxMy45ODZoNi4zMTdWMzguMjZoLTYuMzE3ek03My43MjEgOS44NDVjLjY4Mi42NDggMS41NDMuOTcxIDIuNTgyLjk3MXMxLjg4OC0uMzIzIDIuNTQtLjk3Yy42ODQtLjY1NCAxLjAyOC0xLjQ3MiAxLjAyOC0yLjQ2IDAtLjk5LS4zNDQtMS43OTUtMS4wMjctMi40MTMtLjY1My0uNjQ3LTEuNTAyLS45NzEtMi41NC0uOTcxLTEuMDQgMC0xLjkuMzI0LTIuNTgzLjk3LS42NTMuNjE5LS45OCAxLjQyNS0uOTggMi40MTQgMCAuOTg4LjMyNyAxLjgxMi45OCAyLjQ2em0tLjU3NiA0LjE0M3YyNC4yNzRoNi4zMTZWMTMuOTg4aC02LjMxNnptMTEuNTQ2LS4wMDN2MjQuMjhoNi4zMTdWMjUuNzM1YzAtMi4yMTguNTEtMy45NDggMS41MzEtNS4xOSAxLjA1MS0xLjI0MiAyLjQxNi0xLjg2IDQuMDk3LTEuODYgMS43MSAwIDIuOTc0LjU1NCAzLjc5OSAxLjY2Ni44MjUgMS4xMDYgMS4yMzUgMi43MDcgMS4yMzUgNC43OTZ2MTMuMTE2aDYuMzE2VjI1LjczNmMwLTIuMjE4LjUxMS0zLjk0OCAxLjUzMi01LjE5IDEuMDUxLTEuMjQyIDIuNDM0LTEuODYgNC4xNDQtMS44NiAxLjY4IDAgMi45MTUuNTU0IDMuNzA0IDEuNjY2LjgyNiAxLjEwNiAxLjIzNSAyLjcwNyAxLjIzNSA0Ljc5NnYxMy4xMDVoNi4zMTdWMjQuNTQ3YzAtMy42NTQtLjg1NS02LjQyNS0yLjU2NS04LjMyLTEuNzEtMS44OS00LjE2MS0yLjgzNy03LjM1NS0yLjgzNy0xLjc3NSAwLTMuNDIuMzk1LTQuOTM0IDEuMTc3LTEuNDg0Ljc4My0yLjY2NSAxLjg0OC0zLjU1NiAzLjE4NC0xLjU3OS0yLjkwMS00LjI2Mi00LjM1NS04LjA0NC00LjM1NS0xLjcxIDAtMy4yMjQuMzYtNC41NDEgMS4wNzdhOC40OCA4LjQ4IDAgMDAtMy4xMTEgMi43OWwtLjU0LTMuMjc4SDg0LjY5em01Ni42NjQtOS43OHYzNC4wNmg2LjMxN1Y0LjIwNWgtNi4zMTd6bTIxLjk4NyAzNC42NDRjLTIuMzA0IDAtNC4zNjQtLjU1My02LjE2OC0xLjY2Ni0xLjgxMS0xLjExMi0zLjI0Mi0yLjYyNC00LjI5My00LjU0OC0xLjA1LTEuOTI1LTEuNTc5LTQuMTE0LTEuNTc5LTYuNTU2cy41MjktNC42MiAxLjU3OS02LjUwOGMxLjA1MS0xLjkyNCAyLjQ4OC0zLjQyNSA0LjI5My00LjUwMiAxLjgxLTEuMTEyIDMuODY0LTEuNjY1IDYuMTY4LTEuNjY1IDEuODQgMCAzLjQ1NS4zNDEgNC44MzggMS4wM2E4LjY0OCA4LjY0OCAwIDAxMy4zNTQgMi44ODl2LTMuMzNoNi4zMTd2MjQuMjczaC01LjYyOGwtLjY4OS0zLjQ3OGMtLjc4OSAxLjA3Ny0xLjg0IDIuMDI1LTMuMTU4IDIuODM3LTEuMjg4LjgxOC0yLjk2MiAxLjIyNC01LjAzNCAxLjIyNHptMS4zMy01LjQ3OWMyLjA0MiAwIDMuNzA0LS42NyA0Ljk4Ni0yLjAwNiAxLjMxOC0xLjM3MiAxLjk3Ny0zLjEyIDEuOTc3LTUuMjM4IDAtMi4xMTgtLjY1OS0zLjg0OC0xLjk3Ny01LjE5LTEuMjgyLTEuMzcxLTIuOTQ0LTIuMDU0LTQuOTg2LTIuMDU0LTIuMDA3IDAtMy42NjkuNjcxLTQuOTg3IDIuMDA3cy0xLjk3NyAzLjA2Ni0xLjk3NyA1LjE5YzAgMi4xMTkuNjU5IDMuODY2IDEuOTc3IDUuMjM3IDEuMzE4IDEuMzY2IDIuOTggMi4wNTQgNC45ODcgMi4wNTR6bTE4LjI1MS0xOS4zODVWMzguMjZoNi4zMTdWMjcuMTk2YzAtMS44Ni4yOTEtMy4zMTMuODg0LTQuMzU1LjYzLTEuMDQxIDEuNDg1LTEuNzc3IDIuNTcxLTIuMiAxLjA4Ni0uNDI0IDIuMzIxLS42MzYgMy43MDQtLjYzNmgxLjc3NWwtMS43NzUtNi4wMmMtMS4yODggMC0yLjY0Ny4yMjQtMy42NTEuODNhMTAuMDMyIDEwLjAzMiAwIDAwLTMuNjAzIDMuNzE5bC0uNTk0LTQuNTQ5aC01LjYyOHptMjQuMjUyIDI0LjI4MmwtNy4xNi0yNC4yNzRoNi4yN2w0LjI0NCAxNy40NzEgNC45MzQtMTcuNDcxaDcuMDExbDQuOTMzIDE3LjQ3MSA0LjI5OC0xNy40NzFoNi4yNjlsLTcuMjA3IDI0LjI3NGgtNi41NjZsLTUuMjMtMTguMTYtNS4yMzYgMTguMTZoLTYuNTZ6bTM3LjI2Ny0uOTg0YzEuOTEyIDEuMDQyIDQuMDk2IDEuNTY2IDYuNTY2IDEuNTY2IDEuOTcxIDAgMy43MzQtLjM2IDUuMjg0LTEuMDc3IDEuNTc5LS43MTggMi44OTctMS42OTUgMy45NDctMi45MzcgMS4wODctMS4yNyAxLjg2NS0yLjY3MSAyLjMyMi00LjIwN2gtNi40MThjLS40MzMuOTE4LTEuMDkyIDEuNjY1LTEuOTc3IDIuMjU0LS44NjEuNTUzLTEuOTI5LjgzLTMuMjEyLjgzLTEuNzA5IDAtMy4xNzYtLjUzNi00LjM5My0xLjYxMy0xLjE4MS0xLjA3Ny0xLjg0LTIuNTYtMS45NzEtNC40NTVoMTguNjA2Yy4wMy0uNDIzLjA0Ny0uODMuMDQ3LTEuMjIzLjAzNi0uMzg5LjA1NC0uNzY1LjA1NC0xLjEyNCAwLTIuMjE5LS41MjktNC4yMjYtMS41NzktNi4wMmExMS4wMjcgMTEuMDI3IDAgMDAtNC4yOTktNC4zMDhjLTEuODQtMS4wNDEtMy45NTktMS41NjUtNi4zNjQtMS41NjUtMi41NyAwLTQuODAyLjU1My02LjcxNCAxLjY2NS0xLjg3NiAxLjA3Ny0zLjM1NCAyLjU5LTQuNDQxIDQuNTQ5LTEuMDUgMS45NTQtMS41NzkgNC4xOS0xLjU3OSA2LjcwMiAwIDIuNDc4LjU0MSA0LjY2MSAxLjYyNyA2LjU1NmExMS4zODMgMTEuMzgzIDAgMDA0LjQ5NCA0LjQwN3ptMi41MTctMTcuNDdjMS4xODItLjg4NCAyLjU0Ny0xLjMyNSA0LjA5Ni0xLjMyNSAxLjYxNSAwIDIuOTYzLjQ3NyA0LjA0OSAxLjQxOCAxLjA4Ny45NDggMS42NzQgMi4yMTkgMS43NzUgMy44MmgtMTIuMTk0Yy4zMzMtMS43NiAxLjA4Ny0zLjA2NiAyLjI3NC0zLjkxNHptMzMuODk5IDE5LjAzNWMtMS44NDcgMC0zLjQ1NS0uMzQxLTQuODM5LTEuMDNhOC42NDggOC42NDggMCAwMS0zLjM1NC0yLjg5bC0uNjk0IDMuMzMxaC01LjYyOFY0LjIwNWg2LjMxNnYxMy4yNThjLjc5LTEuMDc3IDEuODI5LTIuMDI0IDMuMTExLTIuODM2IDEuMzE4LS44MTggMy4wMS0xLjIyNCA1LjA4Mi0xLjIyNCAyLjMwMyAwIDQuMzU3LjU1MyA2LjE2OCAxLjY2NXMzLjI0MSAyLjYyNSA0LjI5MiA0LjU0OWMxLjA1MSAxLjkyNCAxLjU3OSA0LjExMyAxLjU3OSA2LjU1NSAwIDIuNDQyLS41MjggNC42MzItMS41NzkgNi41NTYtMS4wNTEgMS44OTUtMi40ODEgMy4zOTUtNC4yOTIgNC41MDItMS43OTkgMS4wODItMy44NTkgMS42MTgtNi4xNjIgMS42MTh6bS0xLjMzLTUuNDc5YzIuMDA3IDAgMy42NjktLjY3IDQuOTg3LTIuMDA2IDEuMzE4LTEuMzM2IDEuOTc3LTMuMDY2IDEuOTc3LTUuMTkgMC0yLjExOS0uNjU5LTMuODY3LTEuOTc3LTUuMjM4LTEuMzE4LTEuMzcxLTIuOTc1LTIuMDU0LTQuOTg3LTIuMDU0LTIuMDQyIDAtMy43MTYuNjgzLTUuMDM0IDIuMDU0LTEuMjgzIDEuMzM2LTEuOTI0IDMuMDY2LTEuOTI0IDUuMTkgMCAyLjExOS42NDEgMy44NjYgMS45MjQgNS4yMzggMS4zMTIgMS4zMzUgMi45OTIgMi4wMDYgNS4wMzQgMi4wMDZ6TTY1LjExMyAyNC44NWMxLjQ0OS40NiAyLjYgMS4xNiAzLjQ1NSAyLjEwNy44NTUuOTE4IDEuMjgzIDIuMjM2IDEuMjg5IDMuOTY2LjAzIDEuNS0uMzYyIDIuODU0LTEuMTg4IDQuMDYtLjgyNSAxLjIwNy0yLjAwNiAyLjE1NC0zLjU1NiAyLjgzNy0xLjU1LjY4OC0zLjM3MiAxLjAzLTUuNDggMS4wMy0yLjE3MiAwLTQuMDg0LS4zNDctNS43MjgtMS4wMy0xLjY0NS0uNzE4LTIuOTYyLTEuNjk1LTMuOTQ4LTIuOTM2YTguMzAxIDguMzAxIDAgMDEtMS42MTUtMy4zOTZsNS43MTctLjg3Yy4yMDguNDUyIDEuMDA0IDEuNjEyIDEuODUyIDIuMjEyLjA2Mi4wNTYuMTI0LjEwOC4xOS4xNjJsLjAzLjAyNmMuODkuNjUzIDIuMDI1Ljk3NyAzLjQwOC45NzdzMi4zODYtLjI3NiAzLjAxLS44M2MuNjU5LS41NTMuOTg1LTEuMTg4Ljk4NS0xLjkwNiAwLTEuMDQ4LS40NjMtMS43NDgtMS4zODMtMi4xMDctLjkyNi0uMzg4LTIuMjA5LS43NjUtMy44NTMtMS4xMjRhNDEuNTYyIDQxLjU2MiAwIDAxLTMuMjA2LS44MyAxNi44MDIgMTYuODAyIDAgMDEtMy4wMS0xLjIyNGMtLjg5LS41MjMtMS42MTQtMS4xNzctMi4xNzItMS45Ni0uNTU4LS44MTEtLjgzNy0xLjgwNi0uODM3LTIuOTgzIDAtMi4xNTMuODU0LTMuOTYgMi41NjQtNS40MzEgMS43NDUtMS40NjUgNC4xOC0yLjIwMSA3LjMwOC0yLjIwMSAyLjg5NyAwIDUuMi42NyA2LjkxIDIuMDA3IDEuMzYgMS4wNDEgMi4yODYgMi4zOTUgMi43ODUgNC4wNDhsLTUuMjc4IDEuMjk1LS4wMDYtLjAyNHMtLjY5NS0xLjMyNC0xLjgyMy0xLjkwNmMtLjY2NC0uMzgzLTEuNTQzLS41NzctMi42MzUtLjU3Ny0xLjE4OCAwLTIuMTA4LjIyNC0yLjc2Ny42ODMtLjYyMy40NTktLjkzOCAxLjAzLS45MzggMS43MTIgMCAuNzE4LjQ4MSAxLjI4OSAxLjQzIDEuNzEzLjk1LjQyMyAyLjIyMS44MTcgMy44IDEuMTc2IDEuNzEuMzk1IDMuMjc3LjgzNiA0LjY5IDEuMzI0eiIgZmlsbD0iIzA5MjU0MCIvPjwvc3ZnPg==",
            };
        options = Object.assign(initOptions, options);

        var appendWatermark = function (chart, options) {
            var x,
                y,
                top = (chart.marginTop || 0) + (chart.plotTop || 0),
                left = (chart.marginLeft || 0) + (chart.plotLeft || 0);

            if (options.position === "bottomLeft") {
                x = left + options.xOffset;
                y = chart.plotHeight + top - options.height - options.yOffset;
            } else if (options.position === "center") {
                x = "50%";
                y = chart.plotHeight / 2 + top - options.height / 2 - options.yOffset;
                options.transform = "translate(" + -(options.width / 2 + options.xOffset) + ")";
            }

            chart.renderer
                .image(options.image, x, y, options.width, options.height)
                .attr({
                    zIndex: options.zIndex,
                    opacity: options.opacity,
                    transform: options.transform,
                    "data-automation": "highchart-watermark",
                })
                .add();
        };

        // PNG Export properties
        if (chart.options.chart.forExport) {
            options.position = "center";
            options.width = 234;
            options.height = 34;
            options.opacity = 0.1;
            appendWatermark(chart, options);
        } else {
            // Chart properties
            // timeout is necessary (only for first time the graph loads) for next digest loop to allow highcharts to recalculate heights & widths
            setTimeout(function () {
                options.xOffset = 15;
                options.yOffset = 18;
                if (chart.renderer) {
                    appendWatermark(chart, options);
                }
            }, 1);
        }
    },
    remove: (chart) => {
        setTimeout(() => {
            chart.renderer.box.childNodes.forEach((index, item) => {
                if (item.tagName === "image") {
                    $(item).hide();
                }
            });
        }, 1);
    },
};
