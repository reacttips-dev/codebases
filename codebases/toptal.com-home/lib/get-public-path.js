const getPublicPath = publicUrl => {
    if (typeof publicUrl !== 'string') {
        return ''
    }

    const splitPublicUrl = publicUrl.split('/')
    const paths = splitPublicUrl.slice(3)
    const pathname = `/${paths.join('/')}`
    return pathname
}

export default getPublicPath