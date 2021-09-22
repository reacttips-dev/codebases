import { allTrackers } from "services/track/track";

export class GroupTracker {
    createGroupFromSidebar() {
        return allTrackers.trackEvent("Pop Up", "open", "Create New Keyword Group");
    }

    createGroupFromAddToMenu(keyword) {
        return allTrackers.trackEvent(
            "Drop Down",
            "click",
            `Add to/Create New Keyword Group/${keyword}`,
        );
    }

    addToGroupFromMenu(keyword, group) {
        return allTrackers.trackEvent("Drop Down", "click", `Add to/${keyword}/${group.Name}`);
    }
}

export class NewGroupTracker extends GroupTracker {
    onPaste(keywords) {
        return allTrackers.trackEvent(
            "Pop Up",
            "click",
            `Create New Keyword Group/Paste Keywords/${keywords.length}`,
        );
    }

    onAdd({ text }) {
        return allTrackers.trackEvent(
            "Pop Up",
            "click",
            `Create New Keyword Group/Add Keyword/${text}`,
        );
    }

    onRemove({ text }) {
        return allTrackers.trackEvent(
            "Pop Up",
            "click",
            `Create New Keyword Group/Remove keyword/${text}`,
        );
    }

    onEdit({ text }) {
        return allTrackers.trackEvent(
            "Pop Up",
            "click",
            `Create New Keyword Group/Edit keyword/${text}`,
        );
    }

    onError(error) {
        return allTrackers.trackEvent(
            "Pop Up",
            "warning",
            `Create New Keyword Group/Error/${error}`,
        );
    }

    onSave(title, items) {
        return allTrackers.trackEvent(
            "Pop Up",
            "click",
            `Create New Keyword Group/Save/${title};${items.length}`,
        );
    }

    onView(title, items) {
        return allTrackers.trackEvent(
            "Pop Up",
            "click",
            `Keyword Group created successfully/View keyword Group/${title};${items.length}`,
        );
    }

    onClose() {
        return allTrackers.trackEvent(
            "Pop Up",
            "click",
            `Keyword Group created successfully/Close`,
        );
    }

    onCancel() {
        return allTrackers.trackEvent("Pop Up", "click", `Create New Keyword Group/Cancel`);
    }
}

export class ExistingGroupTracker extends GroupTracker {
    onPaste(keywords) {
        return allTrackers.trackEvent(
            "Pop Up",
            "click",
            `Edit Keyword Group/Paste Keywords/${keywords.length}`,
        );
    }

    onAdd({ text }) {
        return allTrackers.trackEvent("Pop Up", "click", `Edit Keyword Group/Add Keyword/${text}`);
    }

    onRemove({ text }) {
        return allTrackers.trackEvent(
            "Pop Up",
            "click",
            `Edit Keyword Group/Remove keyword/${text}`,
        );
    }

    onEdit({ text }) {
        return allTrackers.trackEvent("Pop Up", "click", `Edit Keyword Group/Edit keyword/${text}`);
    }

    onError(error) {
        return allTrackers.trackEvent("Pop Up", "warning", `Edit Keyword Group/Error/${error}`);
    }

    onSave(title, items) {
        return allTrackers.trackEvent(
            "Pop Up",
            "click",
            `Edit Keyword Group/Save/${title};${items.length}`,
        );
    }

    onView() {
        return allTrackers.trackEvent(
            "Pop Up",
            "click",
            `Keyword Group edited successfully/View keyword Group`,
        );
    }

    onClose() {
        return allTrackers.trackEvent("Pop Up", "click", `Keyword Group edited successfully/Close`);
    }

    onCancel() {
        return allTrackers.trackEvent("Pop Up", "click", `Edit Keyword Group/Cancel`);
    }
}

export const KeywordsGroupsTracking = {
    existingGroupTracker: new ExistingGroupTracker(),
    newGroupTracker: new NewGroupTracker(),
    genericGroupTracker: new GroupTracker(),
};
