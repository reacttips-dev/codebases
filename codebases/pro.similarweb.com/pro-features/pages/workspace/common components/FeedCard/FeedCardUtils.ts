import dayjs from "dayjs";

export const getMetricDetailsMonthlyVisits = (change) => {
    const cardTitle = "workspace.feed_sidebar.title.monthly_total_visits_change";
    const cardButton = "workspace.feed_sidebar.ta_link_text";
    let cardText;
    if (change > 0) {
        cardText = "workspace.feed_sidebar.text.monthly_total_visits_change.spiked";
    } else {
        cardText = "workspace.feed_sidebar.text.monthly_total_visits_change.dropped";
    }
    return {
        cardTitle,
        cardButton,
        cardText,
    };
};

export const getMetricDetailsMMx = (change, channel) => {
    let cardTitle, cardText;
    switch (channel) {
        case "direct":
            cardTitle = "workspace.feed_sidebar.title.mmx_change.direct";
            if (change > 0) {
                cardText = "workspace.feed_sidebar.text.mmx_change.direct.spiked";
            } else {
                cardText = "workspace.feed_sidebar.text.mmx_change.direct.dropped";
            }
            break;
        case "organic_search":
            cardTitle = "workspace.feed_sidebar.title.mmx_change.organic_search";
            if (change > 0) {
                cardText = "workspace.feed_sidebar.text.mmx_change.organic_search.spiked";
            } else {
                cardText = "workspace.feed_sidebar.text.mmx_change.organic_search.dropped";
            }
            break;
        case "paid_search":
            cardTitle = "workspace.feed_sidebar.title.mmx_change.paid_search";
            if (change > 0) {
                cardText = "workspace.feed_sidebar.text.mmx_change.paid_search.spiked";
            } else {
                cardText = "workspace.feed_sidebar.text.mmx_change.paid_search.dropped";
            }
            break;
        case "referrals":
            cardTitle = "workspace.feed_sidebar.title.mmx_change.referrals";
            if (change > 0) {
                cardText = "workspace.feed_sidebar.text.mmx_change.referrals.spiked";
            } else {
                cardText = "workspace.feed_sidebar.text.mmx_change.referrals.dropped";
            }
            break;
        case "social":
            cardTitle = "workspace.feed_sidebar.title.mmx_change.social";
            if (change > 0) {
                cardText = "workspace.feed_sidebar.text.mmx_change.social.spiked";
            } else {
                cardText = "workspace.feed_sidebar.text.mmx_change.social.dropped";
            }
            break;
        case "display_ads":
            cardTitle = "workspace.feed_sidebar.title.mmx_change.display_ads";
            if (change > 0) {
                cardText = "workspace.feed_sidebar.text.mmx_change.display_ads.spiked";
            } else {
                cardText = "workspace.feed_sidebar.text.mmx_change.display_ads.dropped";
            }
            break;
        case "mail":
            cardTitle = "workspace.feed_sidebar.title.mmx_change.mail";
            if (change > 0) {
                cardText = "workspace.feed_sidebar.text.mmx_change.mail.spiked";
            } else {
                cardText = "workspace.feed_sidebar.text.mmx_change.mail.dropped";
            }
            break;
    }
    const cardButton = "workspace.feed_sidebar.mc_link_text";
    return {
        cardTitle,
        cardButton,
        cardText,
    };
};

export const getCardDates = (date) => {
    const d = dayjs.utc(date);
    const fromMonth = d.clone().subtract(1, "months").format("MMMM");
    const toMonth = d.format("MMMM");
    return {
        fromMonth,
        toMonth,
    };
};
