const Observable = require('o_0');
const uniq = require('lodash/uniq');
const {
    nthIndex
} = require('../util');

// eslint-disable-next-line func-names
module.exports = function(application) {
    const self = {
        searchValue: Observable(''),
        searchedValue: Observable(''),
        searchedResults: Observable([]),
        selectedResult: Observable({}),

        groupedSearchResults: Observable([]),
        searchWhere: Observable('All Files'),
        caseSensitive: Observable(false),
        // projectReplaceFilesBoxValue: Observable(''),
        loading: Observable(false),

        searchWhereOption() {
            // eslint-disable-next-line prefer-const
            let option = self.searchWhere();
            // eslint-disable-next-line prefer-const
            let currentFilePath = application.currentFileInfo().path;
            // eslint-disable-next-line prefer-const
            let currentFileFolder = application.currentFileInfo().folders;
            // eslint-disable-next-line prefer-const
            let currentFileExtension = application.currentFileInfo().extension;

            if (option.includes('Current File')) {
                return `--include '${currentFilePath}'`;
                // eslint-disable-next-line no-else-return
            } else if (option.includes('Current Folder') && currentFileFolder) {
                return `--include '${currentFileFolder}*'`;
            } else if (option.includes('Current Type') && currentFileExtension) {
                return `--include '*.${currentFileExtension}'`;
            } else {
                return `--include '*'`;
            }
        },

        clearSearch() {
            self.loading(false);
            self.searchValue('');
            self.searchedValue('');
            self.searchedResults([]);
            self.selectedResult({});
        },

        caseSensitiveOption() {
            if (self.caseSensitive()) {
                return '';
                // eslint-disable-next-line no-else-return
            } else {
                return '--ignore-case';
            }
        },

        splitMatch(match) {
            // eslint-disable-next-line prefer-const
            let search = self.searchValue();
            // eslint-disable-next-line prefer-const
            let searchIndex = match.toLowerCase().indexOf(search.toLowerCase());
            return {
                before: match.substring(0, searchIndex),
                match: match.substring(searchIndex, searchIndex + search.length),
                after: match.substring(searchIndex + search.length, match.length),
                character: searchIndex,
            };
        },

        isPathRecent(path) {
            // eslint-disable-next-line func-names
            return application.recentFiles().some(function(recentFile) {
                return recentFile.path() === path;
            });
        },

        normalizeResult(result, index) {
            // eslint-disable-next-line prefer-const
            let data = result.split(':');
            // eslint-disable-next-line prefer-const
            let matchStart = nthIndex(result, ':', 2);
            // eslint-disable-next-line prefer-const
            let match = result.substring(matchStart + 1, result.length).trim();
            // eslint-disable-next-line prefer-const
            let splitMatch = self.splitMatch(match);
            // eslint-disable-next-line prefer-const
            let path = data[0];
            // eslint-disable-next-line prefer-const
            let line = data[1];
            // eslint-disable-next-line prefer-const
            let isRecent = self.isPathRecent(path);
            return {
                // eslint-disable-next-line object-shorthand
                path: path,
                // eslint-disable-next-line object-shorthand
                line: line,
                rawMatch: match,
                beforeMatch: splitMatch.before,
                match: splitMatch.match,
                afterMatch: splitMatch.after,
                character: splitMatch.character,
                // eslint-disable-next-line object-shorthand
                index: index,
                // eslint-disable-next-line object-shorthand
                isRecent: isRecent,
            };
        },

        groupSearchResults(results) {
            // eslint-disable-next-line prefer-const
            let groups = [];
            // eslint-disable-next-line func-names
            let paths = results.map(function(result) {
                return result.path;
            });
            paths = uniq(paths);
            // eslint-disable-next-line func-names
            paths.forEach(function(path) {
                // eslint-disable-next-line prefer-const, func-names
                let group = results.filter(function(result) {
                    return result.path === path;
                });
                groups.push(group);
            });
            self.groupedSearchResults(groups);
        },

        // only search files in filetree, non-minified files, and exclude assets (for now)
        searchCommand() {
            const searchString = self.searchValue().trim();
            const caseSensitive = self.caseSensitiveOption();
            const searchWhere = self.searchWhereOption();
            const listNotIgnoredOrDeletedFiles = `/bin/bash -c "sort <(git ls-files -c -o --exclude-standard) <(git ls-files -d) <(git ls-files -d) | uniq -u"`;
            const grepListOfFiles = `xargs -d "\n" grep ${caseSensitive} --line-number ${searchWhere} "${searchString.replace(/"/g, '\\"')}"`;
            return `${listNotIgnoredOrDeletedFiles} | ${grepListOfFiles}`;
        },

        async search() {
            const searchString = self.searchValue().trim();
            if (!searchString) {
                self.clearSearch();
                return;
            }
            if (!application.projectIsMemberOrMoreForCurrentUser()) {
                return;
            }

            self.loading(true);
            self.searchedResults([]);
            self.searchedValue(searchString);
            const searchCommand = self.searchCommand();
            try {
                let results = await application.containerExec(searchCommand);
                results = results.stdout.split('\n');
                results = results.filter(Boolean);
                results = results.map(self.normalizeResult);
                results = results.filter((result) => application.fileByPath(result.path) !== undefined);
                self.searchedResults(results);
                self.groupSearchResults(results);
            } catch (error) {
                self.searchedResults([]);
                console.log('no results found', error);
            } finally {
                self.loading(false);
            }
        },

        selectResult(result) {
            application.closeAllPopOvers();
            application.selectFileByPathOrDefaultFile(result.path);
            if (application.fileByPath(result.path).extension() === 'md') {
                application.markdownPreviewVisible(false);
            }
            // eslint-disable-next-line func-names
            return application.selectedFile().session.then(function() {
                application.editor().setCursor(result.line - 1, result.character);
                self.selectedResult(result);
            });
        },
    };

    // groupedSearchResults could have results for files that we're ignoring in the
    // editor. This computed observable filters the ignored files out of groupedSearchResults.
    self.filteredGroupedSearchResults = Observable(() =>
        self.groupedSearchResults().filter((results) => application.fileByPath(results[0].path) !== undefined),
    );

    return self;
};