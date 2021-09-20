import DocumentationContextBarStore from '../stores/DocumentationContextBarStore';
import { computed } from 'mobx';
import { getStore } from '../../js/stores/get-store';

export default class DocumentationContextBarController {
  entityId = undefined;
  entityUid = undefined;
  entityType = undefined;
  owner = undefined;

  unsavedDescription = null;

  @computed
  get store () {
    const activeEditor = getStore('ActiveWorkspaceSessionStore').activeEditor;
    const editor = getStore('EditorStore').find(activeEditor);

    if (editor) {
      const resource = editor.resource;
      const v2ResourceBasePath = 'v2implview://stubView/';
      if (resource.startsWith(v2ResourceBasePath)) {
        const [entityType, entityUid] = resource.replace(v2ResourceBasePath, '').split('/');
        return new DocumentationContextBarStore(entityType, entityUid);
      }
    }

    return null;
  }

  willDestroy () {
    this.codegen = undefined;
  }

  /**
   * Stores the unsavedDescription for the context bar
   *
   * {String} @param description - unsaved Description from the editor
   */
  updateUnsavedDescription = (updatedDescription) => {
    this.unsavedDescription = updatedDescription;
  }

  get contextBarUnsavedDescription () {
    return this.unsavedDescription;
  }
}
