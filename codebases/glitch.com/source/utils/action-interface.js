/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// eslint-disable-next-line func-names
module.exports = function(application) {
    // action search results are in project-search-pop presenter

    let self;
    // eslint-disable-next-line no-return-assign
    return (self = {
        selectAction(action, event) {
            event.preventDefault();
            document.getElementById('project-search-input').blur();
            application.closeAllPopOvers();
            application.projectSearchBoxValue('');
            return self[action]();
        },

        keyboardShortcutOverlayToggle() {
            application.analytics.track('Keyboard Shortcuts Viewed');
            return application.keyboardShortcutsOverlayVisible.toggle();
        },
        rewindPanelToggle() {
            return application.rewindPanelVisible.toggle();
        },
        logsPanelToggle() {
            return application.logsPanelVisible.toggle();
        },
        openConsole() {
            return application.consolePanelVisible.toggle();
        },
        projectOptionsPopToggle() {
            return application.projectPopVisible.toggle();
        },
        newOptionsPopToggle() {
            return application.newProjectPopVisible.toggle();
        },
        switchProjectPopToggle() {
            return application.projectsSelectPopVisible.toggle();
        },
        gitImportExportPopToggle() {
            application.sidebarIsCollapsed(false);
            return application.gitImportExportPopVisible.toggle();
        },
        downloadProject() {
            application.analytics.track('Project Downloaded', {
                clickLocation: 'Project Search'
            });
            // eslint-disable-next-line no-return-assign
            return (window.location = application.projectDownloadUrl());
        },
        aboutPopToggle() {
            return application.aboutPopVisible.toggle();
        },
        newStuffOverlayToggle() {
            application.analytics.track('Pupdate Viewed', {
                clickLocation: 'Project Search'
            });
            return application.newStuffOverlayVisible.toggle();
        },
        accountToggle() {
            return application.accountPopVisible.toggle();
        },
        refreshPreviewOnChangesToggle() {
            application.analytics.track('Refresh App Setting Changed');
            return application.refreshPreviewOnChanges.toggle();
        },
        wrapTextToggle() {
            application.analytics.track('Wrap Text Setting Changed');
            return application.wrapText.toggle();
        },
        currentFile() {
            return application.selectedFile();
        },
        showAssets() {
            return application.showAssets();
        },
        shareEmbedOverlayToggle() {
            return application.shareEmbedOverlayVisible.toggle();
        },
        customDomainPopToggle() {
            application.analytics.track('Custom Domains Viewed');
            application.sidebarIsCollapsed(false);
            return application.customDomainPopVisible.toggle();
        },
        containerStatsPanelToggle() {
            return application.containerStatsPanelVisible.toggle();
        },

        newFilePopToggle() {
            application.sidebarIsCollapsed(false);
            return application.newFilePopVisible.toggle();
        },

        sharePopToggle() {
            application.sidebarIsCollapsed(false);
            return application.sharePopVisible.toggle();
        },

        shareButtonsPopToggle() {
            application.sidebarIsCollapsed(false);
            return application.shareButtonsPopVisible.toggle();
        },

        toggleAppPreview() {
            if (application.appPreviewVisible()) {
                application.appPreviewIsCollapsed.toggle();
            } else {
                application.appPreviewVisible(true);
                application.appPreviewIsCollapsed(false);
            }
        },

        deleteCurrentFile() {
            self.deleteFile(self.currentFile());
        },

        deleteFile(file) {
            application.closeAllPopOvers();
            if (confirm(`Delete ${file.path()}?`)) {
                application.deleteFile(file);
            }
        },

        deleteFolder(folder) {
            application.closeAllPopOvers();
            const folderName = folder.name();
            const folderId = folder.id();
            if (confirm(`Delete ${folderName} and all files and folders that it contains?`)) {
                application.deleteFolder(
                    folderId,
                    application
                    .otClient()
                    .idToPath(folderId)
                    .substring(2),
                ); // need to remove "./" from the start
            }
        },

        renameCurrentFile() {
            self.renameFile(self.currentFile());
        },

        renameFile(file) {
            application.closeAllPopOvers();
            file.renaming(true);
        },

        renameFolder(folder) {
            application.closeAllPopOvers();
            folder.renaming(true);
        },

        async copyCurrentFile() {
            return self.copyFile(self.currentFile());
        },

        async copyFile(file) {
            application.closeAllPopOvers();
            const newPath = prompt('New name', `${file.path()} copy`);
            if (newPath) {
                try {
                    await application.ensureSession(file); // Make sure content is loaded
                    await application.newFile(newPath, file.content());
                } catch (error) {
                    console.warn(error);
                    application.notifyGenericError(true);
                }
            }
        },

        showApp() {
            const previewOpened = application.preview();
            if (previewOpened) {
                application.notifyPreviewWindowOpened(true);
            }
        },

        sidebarToggle() {
            application.sidebarIsCollapsed.toggle();
            application.updateUserPrefs('sidebarIsCollapsed', application.sidebarIsCollapsed());
        },

        remixProject() {
            application.projectPopVisible(false);
            application.remixCurrentProject();
        },

        async importFromGitHub() {
            try {
                await application.currentUserHasGithubRepoScope();
                return application.importFromGitHub();
            } catch {
                return application.redirectToGitHubLogin('repo user:email');
            }
        },

        async exportToGitHub() {
            try {
                if (!(await application.currentUserHasGithubRepoScope())) {
                    return application.notifyGithubExportNoRepoScopeError(true);
                }
                return application.exportToGitHub();
            } catch {
                return application.notifyGenericError(true);
            }
        },

        // eslint-disable-next-line consistent-return
        deleteCurrentProject() {
            const leaveProjectWarning =
                application.currentProject() && application.currentProject().users() && application.currentProject().users().length > 1 ?
                'Deleting this project will delete it for everyone. You can also just leave the project by clicking yourself in the sidebar.\n' :
                '';
            if (
                confirm(`\
${leaveProjectWarning}
Are you sure you want to archive ${application.projectName()}? You can undo this from the Projects Dashboard later.\
`)
            ) {
                application.closeAllPopOvers();
                application.deleteCurrentProject();
                return application.rewindPanelVisible(false);
            }
        },

        changeTheme() {
            application.analytics.track('Theme Changed');
            application.setPreferredTheme(application.currentTheme() === 'sugar' ? 'cosmos' : 'sugar');
        },
    });
};