import Hearsay from 'hearsay';

interface BackboneModel extends Function {
  id: string;
  get(attribute: string): string;
  typeName: string;
  getOrganization(): () => object;
}

const VALID_ID_REGEX = /^[a-f0-9]{24}$/;
const isValidObjectID = (s: string | null) =>
  typeof s === 'string' && VALID_ID_REGEX.test(s);

const VALID_SHORT_LINK_REGEX = /^[a-zA-Z0-9]{8}$/;
const isShortLink = (s: string | null) =>
  typeof s === 'string' && VALID_SHORT_LINK_REGEX.test(s);

class CurrentModelManager {
  currentModel: {
    use: () => void;
    get: () => BackboneModel;
  };

  constructor() {
    this.currentModel = new Hearsay.Slot(null);
  }

  onAnyOrganizationView() {
    return this.currentModel.get()?.typeName === 'Organization';
  }

  onOrganizationView(idOrganization: string) {
    return (
      this.onAnyOrganizationView() &&
      this.currentModel.get().id === idOrganization
    );
  }

  onAnyBoardView() {
    return this.currentModel.get()?.typeName === 'Board';
  }

  getCurrentBoard() {
    if (this.onAnyBoardView()) {
      return this.currentModel.get();
    } else {
      return null;
    }
  }

  onAnyCardView() {
    return this.currentModel.get()
      ? this.currentModel.get().typeName === 'Card'
      : false;
  }

  onBoardView(idBoardOrShortLink: string) {
    if (this.onAnyBoardView()) {
      if (isValidObjectID(idBoardOrShortLink)) {
        return this.currentModel.get().id === idBoardOrShortLink;
      } else if (isShortLink(idBoardOrShortLink)) {
        return this.currentModel.get().get('shortLink') === idBoardOrShortLink;
      }
    } else {
      return false;
    }
  }
}

// eslint-disable-next-line @trello/no-module-logic
const currentModelManager = new CurrentModelManager();

// We're a singleton; this should last forever
// eslint-disable-next-line @trello/no-module-logic
currentModelManager.currentModel.use();

export { currentModelManager };
