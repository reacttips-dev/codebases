import {
    getCookie,
    setCookie
} from '~/lib/cookies'

const setting = {
    name: 'top-search',
    value: 'enabled'
}

export const isSearchEnabled = () => !!getCookie(setting.name)

export const enableSearch = () => {
    setCookie(setting.name, setting.value, {
        maxAge: 30 * 24 * 60 * 60
    })
}

export const shouldEnableSearch = () => {
    const {
        searchParams
    } = new URL(window.location)

    return searchParams.get(setting.name) === setting.value
}