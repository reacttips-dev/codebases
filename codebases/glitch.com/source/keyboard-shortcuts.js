// 🐍 text editor shortcuts in codemirror-shim.ts

// eslint-disable-next-line func-names
module.exports = function(combokeys, application) {
    // eslint-disable-next-line prefer-const
    let popKeys = application.isMacOS ? ['command+p', 'command+k', 'ctrl+;'] : ['command+p', 'ctrl+p', 'command+k', 'ctrl+k', 'ctrl+;'];
    combokeys.bindGlobal(popKeys, () => {
        application.closeAllPopOvers();
        application.focusOnGlobalSearch();
        return false;
    });

    combokeys.bindGlobal(['command+shift+f', 'ctrl+shift+f'], () => {
        const selectedText = application.editor().getSelection();
        application.projectSearchFilesOverlayVisible.toggle();
        if (application.projectSearchFilesOverlayVisible() && selectedText) {
            application.fileSearch.searchValue(selectedText);
        }
        return false;
    });

    combokeys.bindGlobal(['command+s', 'ctrl+s'], () => {
        application.notifyAutosave(true);
        return false;
    });

    combokeys.bindGlobal(['command+i', 'ctrl+i'], () => {
        application.actionInterface.sidebarToggle();
        return false;
    });

    combokeys.bindGlobal(['command+shift+u', 'ctrl+shift+u'], () => {
        application.actionInterface.toggleAppPreview();
        return false;
    });

    combokeys.bindGlobal(['esc'], () => {
        application.closeAllPopOvers();
    });

    combokeys.bind(['backspace', 'del', 'ctrl+d', 'command+d'], () => {
        return false;
    });

    combokeys.bindGlobal(['command+shift+r', 'ctrl+shift+r'], () => {
        application.refreshPreview();
        return false;
    });

    // eslint-disable-next-line vars-on-top, no-var
    var ghKeys = application.isMacOS ? ['command+shift+e'] : ['command+shift+e', 'ctrl+shift+e'];
    combokeys.bindGlobal(ghKeys, () => {
        application.exportToGitHub();
        return false;
    });

    combokeys.bindGlobal(['command+shift+l', 'ctrl+shift+l'], () => {
        application.logsPanelVisible.toggle();
        return false;
    });

    combokeys.bindGlobal(['command+shift+x', 'ctrl+shift+x'], () => {
        application.consolePanelVisible.toggle();
        return false;
    });

    combokeys.bindGlobal(['command+shift+m', 'ctrl+shift+m'], () => {
        application.rewindPanelVisible.toggle();
        return false;
    });

    combokeys.bindGlobal(['command+option+s', 'ctrl+alt+s'], async () => {
        if (application.editorRangeSelections().length <= 1) {
            await application.formatCode({
                actionTrigger: 'keyboardShortcut',
                withAnimation: false
            });
        }
        return false;
    });

    // eslint-disable-next-line consistent-return
    combokeys.bindGlobal(['?'], () => {
        const noElementInFocus = document.activeElement === document.body || document.activeElement === null;
        application.analytics.track('Keyboard Shortcuts Viewed');

        if (noElementInFocus) {
            application.keyboardShortcutsOverlayVisible.toggle();
            return false;
        }
    });
};