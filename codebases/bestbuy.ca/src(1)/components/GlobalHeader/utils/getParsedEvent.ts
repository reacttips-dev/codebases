const getParsedEvent = ({ ctaText = "", eventType = "brand", eventId = null, seoText = "", url = null, query = null, altCtaText = null, }) => ({
    ctaText,
    eventType,
    eventId: eventId || ctaText,
    seoText,
    url,
    query,
    altCtaText,
});
export default getParsedEvent;
//# sourceMappingURL=getParsedEvent.js.map