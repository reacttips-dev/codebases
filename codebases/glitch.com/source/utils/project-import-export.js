/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const randomEmoji = require('../utils/randomEmoji').default;
const Model = require('../model');
const GlitchApi = require('../glitch-api').default;

function match(string, regexp, group = null) {
    const matched = string.match(regexp);

    if (matched === null) {
        return null;
    }

    return group !== null ? matched[group + 1] : matched[0];
}

function maybeMatch(string, regexp, group) {
    const matched = match(string, regexp, group);
    return matched !== null ? matched : string;
}

const main = /* istanbul ignore next */ (I = {}, self = null) => {
    I = I || /* istanbul ignore next */ {};
    self = self || Model(I);

    return self.extend({
        DEFAULT_IMPORT_INPUT: 'user/repo:path',
        DEFAULT_EXPORT_INPUT: 'user/repo',

        PREFERENCE_KEY_IMPORT: 'lastUsedGitHubRepo',
        PREFERENCE_KEY_EXPORT: 'lastUsedGitHubRepoExport',

        lastUsedGitHubRepoForImport() {
            return self.readUserProjectPreference(self.PREFERENCE_KEY_IMPORT);
        },

        lastUsedGitHubRepoForExport() {
            // Fallback to the one used for import as that's likely the one you want to export to.
            return self.readUserProjectPreference(self.PREFERENCE_KEY_EXPORT) || self.lastUsedGitHubRepoForImport();
        },

        readUserProjectPreference(key) {
            const projectId = self.currentProjectId();
            // eslint-disable-next-line no-new-object
            const repoPrefs = self.getUserPref(key) || /* istanbul ignore next */ new Object();
            return repoPrefs[projectId];
        },

        updateUserProjectPreference(key, value) {
            const projectId = self.currentProjectId();
            // eslint-disable-next-line no-new-object
            const repoPrefs = self.getUserPref(key) || /* istanbul ignore next */ new Object();
            repoPrefs[projectId] = value;
            return self.updateUserPrefs(key, repoPrefs);
        },

        sanitizedGithubRepoInput(ghRepoInput) {
            let sanitizedInput = ghRepoInput;

            // Remove variations of leading github.com/
            sanitizedInput = maybeMatch(sanitizedInput, /^(http(s|):\/\/)?(www\.)?(github\.com)?(\/)?(.+)$/, 5);

            // Remove .git or forward slash at end
            sanitizedInput = maybeMatch(sanitizedInput, /(.*)(\/|\.git)$/, 0);

            // Check that final result matches user/repo:optionalPath format
            // Usernames can have hyphens, repo names can have hyphens, underscores, and dots
            // Note: .+ is a wildly broad match for valid file/folder names in :optionalPath
            // We're opting to allow invalid characters to reduce the complexity of this regex
            // This is fine since the goal is to give helpful feedback to the user and the backend will do its own validation
            sanitizedInput = match(sanitizedInput, /^[-\w]+\/[.\-_\w]+(:.+)?$/);

            return sanitizedInput;
        },

        // eslint-disable-next-line consistent-return
        async importFromGitHub() {
            const message = [
                'Import from an existing GitHub repository - please note that this will overwrite your current project.\n',
                'Enter the GitHub username, repository name, and optionally a relative path to a specific folder to import using the following format: username/repository:path.\n',
            ].join('\n');

            let input = window.prompt(message, self.lastUsedGitHubRepoForImport() || self.DEFAULT_IMPORT_INPUT);

            if (input) {
                self.closeAllPopOvers();
                input = self.sanitizedGithubRepoInput(input);
                if (!input) {
                    self.notifyInvalidGitRepository(true);
                    return;
                }

                self.updateUserProjectPreference(self.PREFERENCE_KEY_IMPORT, input);
                const [ghRepo, ghPath] = input.split(':');
                self.projectMachine.send({
                    type: 'IMPORT_GITHUB',
                    data: {
                        importGitHubRepo: `${ghRepo}`,
                        path: ghPath
                    }
                });
            }
        },

        // eslint-disable-next-line consistent-return
        async exportToGitHub() {
            const placeholder = self.lastUsedGitHubRepoForExport() || self.DEFAULT_EXPORT_INPUT;
            // eslint-disable-next-line no-unused-vars
            const [_, path] = placeholder.split(':');
            const wasImportedUsingPath = !!path;

            const message = [
                    wasImportedUsingPath ?
                    `Note: The project was imported from GitHub using a sub-path, which isn't yet supported for exporting. If you want to export to the root of the repository you can do so by removing ":${path}" below.\n` :
                    null,
                    'Note: Your GitHub repository needs to have at least one file in it already.\n',
                    "This will export your project to the 'glitch' branch of your existing GitHub Repo:\n",
                ]
                .filter((x) => !!x)
                .join('\n');

            let name = window.prompt(message, placeholder);

            if (name) {
                if (name.includes(':')) {
                    window.alert("Sorry, we don't support exporting using a sub-path at the moment.");
                    return Promise.resolve();
                }
                name = self.sanitizedGithubRepoInput(name);
                if (!name) {
                    self.notifyInvalidGitRepository(true);
                    return Promise.resolve();
                }

                // eslint-disable-next-line no-shadow
                const message = window.prompt('Custom commit message?', `${randomEmoji(2)} Updated with Glitch`);

                if (message === null) {
                    // cancelled
                    return Promise.resolve();
                }

                self.updateUserProjectPreference(self.PREFERENCE_KEY_EXPORT, name);
                self.notifyGithubExporting(true);

                try {
                    await self.publishGitHubRepo(name, message);
                    self.analytics.track('GitHub Repository Exported');
                    self.notifyGithubExporting(false);
                    self.notifyGithubExportSuccess(true);
                    self.closeAllPopOvers();
                } catch (error) {
                    self.notifyGithubExporting(false);
                    error.repo = name;
                    if (error instanceof GlitchApi.HTTPError === false) {
                        self.notifyGenericError(true);
                    } else if (error.response.status === 404) {
                        const responseBody = await error.response.json();
                        // We have an integration test in place for the below, in case this messaging changes.
                        if (responseBody.message === 'This repository is empty.') {
                            error.message = 'We currently can only export to repos with at least one file in them, but this repo is empty.';
                        } else {
                            error.message = "This repo either doesn't exist, or is private and you don't have access.";
                        }
                        self.notifyGithubExportFailure(error);
                    } else if (error.response.status === 403) {
                        error.message = "You don't seem to have permission to write to this repo.";
                        self.notifyGithubExportFailure(error);
                    } else {
                        self.notifyGenericError(true);
                    }
                }
            }
        },
    });
};

module.exports = main;