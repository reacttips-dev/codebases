export const tableMockData = Array(200)
    .fill(0)
    .flatMap((v, k) => [
        {
            technologyName: `${k} OpenGraph Locale Entity`,
            technologyId: "1408",
            subCategory: "Open Graph Tags",
            category: "Document Standard",
            freePaid: "Free",
            description: "Open graph locale entity tag",
            usedBy: ["facebook.com"],
        },
        {
            technologyName: `${k} United States Dollar`,
            technologyId: "3579",
            subCategory: "Payment Currency",
            category: "ECommerce",
            freePaid: "Paid",
            description:
                "websites using the $ symbol on their website - meaning it may accept payment in this currency used in Israel.",
            usedBy: ["ebay.com", "amazon.com", "paypal.com"],
        },
        {
            technologyName: `${k} GoDaddy Hosting United States Region`,
            technologyId: "4942",
            subCategory: "Web Hosting",
            category: "Server",
            freePaid: "Free & Paid",
            description: "Websites Hosted on GoDaddy Hosting United States Region.",
            usedBy: ["facebook.com", "cnn.com"],
        },
        {
            technologyName: `${k} UTF-8`,
            technologyId: "1126",
            subCategory: "Encoding",
            category: "Document Standard",
            freePaid: "Free",
            description:
                "UTF-8 (8-bit UCS/Unicode Transformation Format) is a variable-length character encoding for Unicode. It is the preferred encoding for web pages.",
            usedBy: ["facebook.com", "cnn.com", "amazon.com", "ebay.com", "paypal.com"],
        },
        {
            technologyName: `${k} Google Optimize`,
            technologyId: "3921",
            subCategory: "A/B Testing",
            category: "Analytics",
            freePaid: "Paid",
            description:
                "Google Optimize is an A/B testing and experimentation platform that integrates directly into Google Analytics.",
            usedBy: ["facebook.com", "cnn.com"],
        },
        {
            technologyName: `${k} LightBox`,
            technologyId: "2766",
            subCategory: "JavaScript",
            category: "JavaScript",
            freePaid: "Free & Paid",
            description:
                "Lightbox is small javascript library used to overlay images on top of the current page. It's a snap to setup and works on all modern browsers.",
            usedBy: ["facebook.com", "cnn.com", "amazon.com", "ebay.com", "paypal.com"],
        },
    ]);
