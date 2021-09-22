import { COURSE, SESSION, S12N, GENERAL } from 'bundles/groups/constants/GroupScopeType';

class GroupScope {
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }

  get courseId() {
    switch (this.name) {
      case COURSE:
        return this.id;
      case SESSION:
        return this.id.split('~')[0];
      default:
        return null;
    }
  }

  get sessionId() {
    if (this.isSession()) {
      return this.id.split('~')[1];
    }

    return null;
  }

  get s12nId() {
    if (this.isS12n()) {
      return this.id;
    }

    return null;
  }

  isCourse() {
    return this.name === COURSE;
  }

  isSession() {
    return this.name === SESSION;
  }

  isS12n() {
    return this.name === S12N;
  }

  isGeneral() {
    return this.name === GENERAL;
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
    };
  }

  toJSON() {
    return this.toObject();
  }
}

export default GroupScope;
