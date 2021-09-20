import {
    isBrowser
} from '@toptal/frontier'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

/**
 * Sets cookie by given name
 * @param {string} name cookie name
 * @param {any} value cookie value
 * @param {object} options cookie max-age in milliseconds
 */
export function setCookie(name, value, options) {
    if (!isBrowser()) {
        return
    }

    cookies.set(name, value, {
        path: '/',
        ...options
    })
}

/**
 * Removes cookie by given name
 * @param {string} name cookie name
 * @param {options} options object
 */
export function removeCookie(name, options) {
    if (!isBrowser()) {
        return
    }
    cookies.remove(name, {
        path: '/',
        ...options
    })
}

/**
 * Gets cookie value by given name
 * @param {string} name
 */
export function getCookie(name) {
    if (!isBrowser()) {
        return
    }

    return cookies.get(name)
}

/**
 * Converts days to seconds
 * @param days {number}
 * @returns {number}
 */
export const maxAgeDays = days => days * 24 * 60 * 60