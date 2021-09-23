/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import friendlyEmoji from 'friendly-emoji';

export default function randomEmoji(count = 1) {
    return friendlyEmoji.random({
        count
    }).join('');
}