const unorphan = (sentence = '', threshold = 3) => {
    const words = sentence.split(' ')
    const {
        length
    } = words

    if (length > threshold) {
        words[length - 2] += '\u00A0' + words.pop()
    }

    return words.join(' ')
}

export default unorphan