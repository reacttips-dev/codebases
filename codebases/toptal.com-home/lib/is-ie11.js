export const IE11UserAgents = [
    'Internet Explorer 11	Windows 7	Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',
    'Internet Explorer 11	Windows 8	Mozilla/5.0 (Windows NT 6.2; Trident/7.0; rv:11.0) like Gecko',
    'Internet Explorer 11	Windows 8.1	Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko',
    'Internet Explorer 11	Windows 10	Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko'
]

/**
 * Returns true if the browser is IE11, false otherwise
 * @returns {Boolean}
 * @see https://stackoverflow.com/questions/49986720/how-to-detect-internet-explorer-11-and-below-versions
 */
const isIE11 = () => {
    // Check the userAgent property of the window.navigator object
    const ua = window.navigator.userAgent
    // IE 10 or older
    const msie = ua.indexOf('MSIE ')
    // IE 11
    const trident = ua.indexOf('Trident/')

    return msie > 0 || trident > 0
}

export default isIE11