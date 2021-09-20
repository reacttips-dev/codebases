const SUFFIX = '| Toptal®'

function toptalize(title) {
    return title.includes(SUFFIX) ? title : `${title} ${SUFFIX}`
}

export default toptalize