import React from "react";

if (process.env.NODE_ENV === "development" && process.env.DEBUG_CLIENT_PERFORMANCE) {
    const whyDidYouRender = require("@welldone-software/why-did-you-render");
    whyDidYouRender(React, {
        trackAllPureComponents: true,
    });
}
