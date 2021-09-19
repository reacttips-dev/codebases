/*!
 * Copyright (c) 2017 Benjamin Van Ryseghem<benjamin@vanryseghem.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Load languages matching TAGS. Silently pass over the failing load.
 *
 * We assume here that we are in a node environment, so we don't check for it.
 * @param {[String]} tags - list of tags to load
 * @param {Numbro} numbro - the numbro singleton
 */
function loadLanguagesInNode(tags, numbro) {
    tags.forEach((tag) => {
        let data = undefined;
        try {
            data = require(`../languages/${tag}`);
        } catch (e) {
            console.error(`Unable to load "${tag}". No matching language file found.`); // eslint-disable-line no-console
        }

        if (data) {
            numbro.registerLanguage(data);
        }
    });
}

module.exports = (numbro) => ({
    loadLanguagesInNode: (tags) => loadLanguagesInNode(tags, numbro)
});
