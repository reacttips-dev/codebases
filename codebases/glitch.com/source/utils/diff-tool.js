/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const DiffMatchPatch = require('diff-match-patch');
const {
    LINE_BREAK_REGEX
} = require('../const');

/* istanbul ignore next */
function diffTool() {
    const self = {
        diffLineMode(text1, text2) {
            const dmp = new DiffMatchPatch();
            // eslint-disable-next-line no-underscore-dangle
            const a = dmp.diff_linesToChars_(text1, text2);
            const diffs = dmp.diff_main(a.chars1, a.chars2, false);
            // eslint-disable-next-line no-underscore-dangle
            dmp.diff_charsToLines_(diffs, a.lineArray);

            return diffs;
        },

        applyDiffInline(diff) {
            const addedLines = [];
            const removedLines = [];
            let index = 0;

            // eslint-disable-next-line func-names
            const chunks = diff.map(function(...args) {
                // eslint-disable-next-line prefer-const
                let [type, content] = Array.from(args[0]);
                const lines = content.split(LINE_BREAK_REGEX);
                let numLines = lines.length;
                if (lines[lines.length - 1] === '') {
                    numLines -= 1;
                } else {
                    // If the run of lines didn't end with a \n, we need to add one
                    content += '\n';
                }

                if (type !== 0) {
                    const lineList = type === 1 ? addedLines : removedLines;
                    lineList.push({
                        start: index,
                        end: index + numLines - 1,
                    });
                }

                index += numLines;
                return content;
            });

            return {
                content: chunks.join(''),
                addedLines,
                removedLines,
            };
        },
    };

    return self;
}

module.exports = diffTool;