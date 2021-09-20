/**
 * Generates an embeddable Vimeo video link to be used on an iframe.
 * @param {*} videoId Vimeo video identifier, a number like: 76979871
 * @param {*} params Vimeo player options: https://vimeo.zendesk.com/hc/en-us/articles/360001494447-Using-Player-Parameters
 */
const getVideoLink = (videoId, parameters) => {
    const searchParams = new URLSearchParams({
        autoplay: false,
        playsinline: false,
        ...parameters
    }).toString()
    return `https://player.vimeo.com/video/${videoId.toString()}?${searchParams}`
}

export default getVideoLink