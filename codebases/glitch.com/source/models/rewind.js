/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const JSDiff = require('diff');
const uniq = require('lodash/uniq');
const Observable = require('o_0');
const randomColor = require('randomcolor');

const {
    ASSET_FILE_PATH
} = require('../const');
const GlitchApi = require('../glitch-api').default;
const File = require('./file');
const User = require('./user');
const trackSerially = require('../utils/track-serially');

/* istanbul ignore next */
// eslint-disable-next-line no-shadow
function addFile(rewind, path) {
    const existingFile = rewind.fileByPath(path);
    if (existingFile != null ? existingFile.deletedByRewind() : undefined) {
        existingFile.deletedByRewind(false);
    } else {
        const addedFile = File({
            path,
            addedByRewind: true,
        });
        rewind.filetree().files.push(addedFile);
    }
}

/* istanbul ignore next */
// eslint-disable-next-line no-shadow
function removeFile(rewind, path) {
    const existingFile = rewind.fileByPath(path);
    if (existingFile != null ? existingFile.addedByRewind() : undefined) {
        rewind.deleteFile(existingFile, {
            silent: true
        });
    } else {
        const deletedFile = rewind.fileByPath(path);
        if (deletedFile) {
            deletedFile.deletedByRewind(true);
        }
    }
}

/* istanbul ignore next */
// eslint-disable-next-line no-shadow
function addOT(rewind, path, ot) {
    // eslint-disable-next-line prefer-const
    let base = rewind.otsByPath();
    if (base[path] == null) {
        base[path] = [];
    }
    base[path].push(ot);
}

/* istanbul ignore next */
// eslint-disable-next-line no-shadow
function applyPatchesToFile(rewind, path, patch) {
    const file = rewind.fileByPath(path);
    if (file) {
        file.modifiedByRewind(true);
        file.rewindPatches(patch);
        rewind.patchesByPath()[path] = patch;
    }
}

/* istanbul ignore next */
// eslint-disable-next-line no-shadow
function getPatchesAndOTs(rewind, revision, prefetching) {
    if (!revision.patchesAndOTs) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        revision.patchesAndOTs = Promise.all([getPatches(rewind, revision, prefetching), getOTs(rewind, revision)]);
    }
    return revision.patchesAndOTs;
}

// Patches that just change file mode don't have useful data in them
/* istanbul ignore next */
function patchHasUsefulData(patch) {
    return patch.hunks && patch.hunks.length > 0 && patch.oldFileName && patch.newFileName;
}

/* istanbul ignore next */
// eslint-disable-next-line no-shadow
function shouldReconnect(rewind) {
    return rewind.receivedMasterStateDuringRewind() || rewind.otClient().opListsReceivedDuringRewind().length > 0;
}

/* istanbul ignore next */
function uniqueUsers(users) {
    return uniq(users.map(JSON.stringify)).map(JSON.parse);
}

/* istanbul ignore next */
function rewindUsersFromRevisions(revisions) {
    const users = [];
    revisions.forEach((revision) => {
        if (revision.editsByUser.length) {
            revision.editsByUser.forEach((edit) => {
                const user = {
                    id: edit.user
                };
                users.push(user);
            });
        } else if (revision.gitEdits.files.length) {
            const user = {
                gitUser: revision.gitUser,
                isGlitchRewind: revision.commitMessage.includes('Rewound to commit'),
            };
            users.push(user);
        }
    });
    return uniqueUsers(users);
}

// eslint-disable-next-line no-shadow
async function fetchRewindUser(rewind, user) {
    try {
        // eslint-disable-next-line prefer-const
        let data = await rewind.glitchApi().v0.getUser(user.id);
        return User(data);
    } catch (error) {
        if (error.response.status === 404) {
            console.log('👻 ghost rewind user', user.id);
            return User(user);
            // eslint-disable-next-line no-else-return
        } else {
            throw error;
        }
    }
}

/* istanbul ignore next */
// eslint-disable-next-line no-shadow
async function getRewindUsers(rewind, revisions) {
    // eslint-disable-next-line prefer-const
    let rewindUsers = rewindUsersFromRevisions(revisions);

    const users = await Promise.all(
        rewindUsers.map((user) => {
            const userInProject = rewind.currentProject().projectUser(user.id);
            if (userInProject !== undefined) {
                userInProject.isOnline = true;
                return User(userInProject);
                // eslint-disable-next-line no-else-return
            } else if (user.gitUser) {
                return User(user);
            } else {
                return fetchRewindUser(rewind, {
                    id: user.id,
                    isOnline: true,
                    color: randomColor({
                        luminosity: 'light'
                    }),
                });
            }
        }),
    );

    rewind.rewindUsers(users);
}

/* istanbul ignore next */
function largestChangeSize(revisions) {
    // Cannot return NaN because this is assigned to an observable, which cannot
    // handle NaN as a value.
    let accumulator = null;
    for (let i = 0; i < revisions.length; i += 1) {
        // eslint-disable-next-line prefer-const
        let edits = revisions[i].editsByUser;
        for (let j = 0; j < edits.length; j += 1) {
            // eslint-disable-next-line prefer-destructuring, prefer-const
            let files = edits[j].files;
            if (files) {
                for (let k = 0; k < files.length; k += 1) {
                    if (accumulator === null) {
                        accumulator = files[k].changeSize;
                    } else {
                        accumulator = Math.max(accumulator, files[k].changeSize);
                    }
                }
            }
        }
    }
    return accumulator;
}

// eslint-disable-next-line no-shadow
async function refreshCurrentFile(rewind) {
    const currentFile = rewind.selectedFile();

    if (currentFile) {
        if (rewind.fileByPath(currentFile.path())) {
            await rewind.ensureSession(currentFile);
            rewind.setCurrentSession(currentFile, {
                maintainScrollPosition: true
            });
        } else {
            rewind.selectDefaultFile();
        }
    }

    if (!currentFile || currentFile.path() === ASSET_FILE_PATH) {
        await rewind.showAssets();
    }
}

/* istanbul ignore next */
// eslint-disable-next-line no-shadow
async function selectRevisionHelper(rewind, revisionIndex, dontSnapPlayhead, otIndex) {
    // eslint-disable-next-line prefer-const
    let revision = revisionIndex === rewind.rewindRevisions().length ? rewind.firstRevision : rewind.rewindRevisions()[revisionIndex];

    rewind.displayedRevision(revisionIndex === 0 ? null : rewind.rewindRevisions()[revisionIndex - 1]);

    rewind.loadingRevision(true);
    rewind.selectedRevision(revision);

    if (!dontSnapPlayhead) {
        rewind.playheadIndex(revisionIndex);
    }

    if (rewind.selectedFile()) {
        await rewind.selectedFile().diffSession;
    }

    // eslint-disable-next-line prefer-const, prefer-const, prefer-const
    let [
        [patches, filesWithDiffTooBig], otInfo
    ] = await getPatchesAndOTs(rewind, revision, false);
    rewind.filesWithDiffTooBig(filesWithDiffTooBig);
    console.log('▶️ ', revisionIndex, revision, patches);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    cleanupSelectedRevision(rewind);

    patches.forEach((patch) => {
        if (patch.oldFileName === '/dev/null') {
            // File added by reverting
            const newPath = patch.newFileName.substring(2);
            addFile(rewind, newPath);
            rewind.patchesByPath()[newPath] = patch;
        } else if (patch.newFileName === '/dev/null') {
            // File deleted by reverting
            const oldPath = patch.oldFileName.substring(2);
            removeFile(rewind, oldPath);
            rewind.patchesByPath()[oldPath] = patch;
        } else {
            // File contents with diffs
            const path = patch.oldFileName.substring(2);
            applyPatchesToFile(rewind, path, patch);
        }
    });

    let i = 0;
    while (i < otIndex) {
        const ot = otInfo.ots[i];
        ot.index = i;
        // eslint-disable-next-line default-case
        switch (ot.type) {
            case 'add':
                // eslint-disable-next-line no-var, vars-on-top
                var path = ot.path.substring(2);
                addFile(rewind, path);
                addOT(rewind, path, ot);
                break;
            case 'unlink':
                // eslint-disable-next-line no-var, vars-on-top
                var oldPath = ot.oldPath.substring(2);
                removeFile(rewind, oldPath);
                addOT(rewind, oldPath, ot);
                break;
            case 'rename':
                oldPath = ot.oldPath.substring(2);
                removeFile(rewind, oldPath);
                addOT(rewind, oldPath, ot);
                // eslint-disable-next-line vars-on-top, no-var
                var newPath = ot.newPath.substring(2);
                addFile(rewind, newPath);
                addOT(rewind, newPath, ot);
                break;
            case 'insert':
            case 'remove':
                path = ot.path.substring(2);
                addOT(rewind, path, ot);
                break;
        }

        i += 1;
    }

    rewind.loadingRevision(false);
    await refreshCurrentFile(rewind);
}

// eslint-disable-next-line no-shadow
async function getRewindRevisions(rewind) {
    try {
        let revisions = await rewind.glitchApi().v0.getProjectGitCommits(rewind.currentProjectId());

        revisions.forEach((rev, index) => {
            if (index > 0) {
                rev.nextHash = revisions[index - 1].hash;
            }

            rev.editsByUser.forEach((edit) => {
                // eslint-disable-next-line guard-for-in, prefer-const
                for (let fileId in edit.files) {
                    const fileEdit = edit.files[fileId];
                    if (fileEdit.path.startsWith('./')) {
                        fileEdit.path = fileEdit.path.substring(2);
                    }

                    if (rewind.pathIgnored(fileEdit.path)) {
                        delete edit.files[fileId];
                    }
                }
            });

            rev.gitEdits.files = rev.gitEdits.files.filter((edit) => !rewind.pathIgnored(edit.path));
        });

        revisions = revisions.filter((rev) => {
            /* istanbul ignore if */
            if (rev.hash === 'Glitch-commit-end') {
                return false;
            }
            return rev.editsByUser.length > 0 || rev.gitEdits.files.length > 0;
        });

        revisions.forEach((rev, index) => {
            rev.index = index;
        });

        rewind.firstRevision = revisions.pop();

        rewind.rewindRevisions(revisions);
    } catch (error) {
        rewind.notifyGenericError(true);
        throw error;
    } finally {
        rewind.gettingRewinds(false);
    }
}

// eslint-disable-next-line no-shadow
function cleanupSelectedRevision(rewind) {
    const filesToRemove = [];

    rewind.files().forEach((file) => {
        file.diffSession = null;
        if (file.addedByRewind()) {
            filesToRemove.push(file);
        }

        file.modifiedByRewind(false);
        file.rewindPatches(undefined);
        file.deletedByRewind(false);
    });

    filesToRemove.forEach((file) => {
        rewind.filetree().files.remove(file);
    });

    rewind.patchesByPath({});
    rewind.otsByPath({});
}

// eslint-disable-next-line no-shadow
async function getPatches(rewind, revision, prefetching) {
    const res = await rewind.glitchApi().v0.getProjectGitDiff(rewind.currentProjectId(), revision.hash);

    // eslint-disable-next-line one-var
    let diff, filesWithDiffTooBig;
    if (typeof res === 'string') {
        diff = res;
        filesWithDiffTooBig = '';
    } else {
        [diff, filesWithDiffTooBig] = Array.from(res);
    }

    if (diff === '') {
        return [
            [],
            []
        ];
    }

    /* istanbul ignore else */
    if (filesWithDiffTooBig) {
        filesWithDiffTooBig = filesWithDiffTooBig.split('\n');
    } else {
        filesWithDiffTooBig = [];
    }

    if (prefetching) {
        rewind.prefetchedDiffsTotal += diff.length;
    }

    return [JSDiff.parsePatch(diff).filter(patchHasUsefulData), filesWithDiffTooBig];
}

// eslint-disable-next-line no-shadow, no-unused-vars, no-unused-vars
function getOTs(rewind, revision) {
    // For now, no OTs
    return Promise.resolve();
}

// if revision.nextHash
//   self.api().api "ots/#{revision.hash}/#{revision.nextHash}"
//   .catch ->
//     # On error, we just don't have any OTs
// else
//   Promise.resolve()

// eslint-disable-next-line no-shadow
async function prefetchDiffs(rewind) {
    if (!rewind.editorIsPreviewingRewind()) {
        return;
    }

    if (rewind.prefetchedDiffsTotal >= rewind.PREFETCH_LIMIT) {
        return;
    }

    const revs = rewind.rewindRevisions();
    while (rewind.prefetchIndex < revs.length && revs[rewind.prefetchIndex].patchesAndOTs) {
        rewind.prefetchIndex += 1;
    }

    if (rewind.prefetchIndex < revs.length) {
        await getPatchesAndOTs(rewind, revs[rewind.prefetchIndex], true);
        setTimeout(() => prefetchDiffs(rewind), 50);
    }
}

// Rewind mixes in additional rewind-related functionality to a model.
function rewind(ignored, toMixWith) {
    // eslint-disable-next-line no-unused-vars
    const selectRevision = trackSerially(selectRevisionHelper, (error) => {
        toMixWith.notifyGenericError(true);
    });

    const self = Object.assign(toMixWith, {
        rewindPanelVisible: Observable(false),
        editorIsPreviewingRewind: Observable(false),
        editorIsRewindingProject: Observable(false),
        gettingRewinds: Observable(false),
        receivedMasterStateDuringRewind: Observable(false),

        rewindRevisions: Observable(null),
        // We can't rewind before the first commit, but we need to keep it around
        firstRevision: null,

        // Selected revision is the commit that we're at right now.
        selectedRevision: Observable(null),
        // Displayed revision is the commit whose info should be displayed - the oldest commit we have reverted
        displayedRevision: Observable(null),

        rewindUsers: Observable(null),
        rewindLargestChangeSize: Observable(0),
        loadingRevision: Observable(false),
        rewoundRevision: Observable(null),

        patchesByPath: Observable({}),
        otsByPath: Observable({}),

        PREFETCH_LIMIT: 1000000,
        prefetchedDiffsTotal: 0,
        prefetchIndex: 0,

        filesWithDiffTooBig: Observable([]),
        playheadIndex: Observable(0),

        // initRewind opens the rewind panel and moves the editor into previewing-rewind mode.
        async initRewind() {
            self.editorIsPreviewingRewind(true);
            self.editor().setOption('readOnly', true);
            self.editor().setOption('styleActiveLine', false);
            self.gettingRewinds(true);
            // Rewind works by applying diffs from git to the current state of the project
            // We need a commit that is the current state to work from

            // Because of the way the editor does rewind, it requires a new commit to act as current state to compare against, rather than just taking the current state
            // of the file from local state and comparing that against an old commit. TODO: We should rewrite this to do something more like what the VSCode extension does, which is
            // get the old state of the file/filesystem at the commit of interest, and just diff that against the local files.

            // We need to wait for the server to acknowledge that there are no outstanding oplists waiting to be accepted before trying to commit.

            if (self.otClient().awaitAck()) {
                await self.otClient().awaitAck();
            }
            await self.glitchApi().v0.projectGitCommitChanges(self.currentProjectId());

            await getRewindRevisions(self);
            console.log('⏪', self.rewindRevisions());
            await getRewindUsers(self, self.rewindRevisions());
            await prefetchDiffs(self);
            self.rewindLargestChangeSize(largestChangeSize(self.rewindRevisions()));
            self.updateEditorModeForFile(self.selectedFile());
            self.markdownPreviewVisible(false);
        },

        // selectRevision changes the current revision index.
        // Currently the revision index is visualized as a highlighted column in the rewind panel.
        // (almost certainly at this point the rewind panel is open).
        selectRevision(revisionIndex, dontSnapPlayHead = false) {
            selectRevision(self, revisionIndex, dontSnapPlayHead, undefined);
        },

        // rewindToRevision makes a substantive change, adding a commit that rolls the state of the project
        // back to match where it was according to the current revision index.
        // (closes the rewind panel).
        // eslint-disable-next-line no-unused-vars
        async rewindToRevision(revision, otIndex) {
            try {
                self.editorIsPreviewingRewind(false);
                self.editorIsRewindingProject(true);
                self.rewoundRevision(self.displayedRevision());

                await revision.patchesAndOTs;

                // This can fail if the user is trying to revert a merge commit,
                // because git doesn't know which parent to revert to. Git refuses to make any changes,
                // and tells the user about the -m option to revert, which allows the user to choose which
                // parent of the merge to revert to.
                // It can fail if the rewind would overrwrite untracked working tree files.
                //
                // However, there is not UI in the editor to communicate the choices reasonably to the user,
                // and ask the user which they would like to do.
                //
                // If the user:
                //   1) only ever uses rewind and not git from the command line, AND
                //   2) does not ever use gitignore
                // then there should be no occurrences of this type of failure.
                await self.glitchApi().v0.projectGitRevert(self.currentProjectId(), revision.hash);

                self.notifyEditorRewoundProject(true);
            } catch (error) {
                if (error instanceof GlitchApi.HTTPError) {
                    const responseJson = await error.response.json().catch(() => null);
                    if (responseJson != null && responseJson.code) {
                        window.alert(`Error rewinding: ${JSON.stringify(responseJson)}`);
                    }
                }
                self.rewindPanelVisible(false);
                self.editorIsRewindingProject(false);
                throw error;
            }
            self.rewindPanelVisible(false);
            self.editorIsRewindingProject(false);
        },

        // Regardless of whether:
        // A) the rewind panel was closed by canceling or x-ing out of it, or
        // B) a substative rewind occurred
        // the rewind panel and the editor need to be moved out of rewind-previewing mode
        // and back into normal editing mode;
        // that's what cleanupRewinds does.
        async cleanupRewinds() {
            cleanupSelectedRevision(self);
            self.rewindRevisions(null);
            self.rewindUsers(null);
            self.rewindLargestChangeSize(0);

            self.filesWithDiffTooBig([]);

            self.selectedRevision(null);
            self.displayedRevision(null);
            self.editorIsPreviewingRewind(false);
            self.editor().setOption('readOnly', false);
            self.editor().setOption('styleActiveLine', !self.isIOS);
            self.updateEditorModeForFile(self.selectedFile());

            await refreshCurrentFile(self);

            // Reconnect to pick up OTs from other users that we discarded
            if (shouldReconnect(self)) {
                /* istanbul ignore next */
                self.projectMachine.send({
                    type: 'REWIND_EXITED'
                });
            }
        },
    });

    return self;
}

module.exports = {
    rewind,
    fetchRewindUser,
    getRewindRevisions,
    refreshCurrentFile,
    getPatches,
    prefetchDiffs,
    selectRevisionHelper,
};