const dataUriSrcRegex = new RegExp(
    '(<img )([^>]*src=["\']?data:image/[^<]+;base64,[a-zA-Z0-9+/=&#;]+["\']?)([^>]*>)',
    'gi'
);
const emojiClassName = 'EmojiInsert';

export default function processSignatureHtmlForInlineImages(signature: string): string {
    return signature
        ? signature.replace(dataUriSrcRegex, '<img class="' + emojiClassName + '" ' + '$2' + '$3')
        : signature;
}
