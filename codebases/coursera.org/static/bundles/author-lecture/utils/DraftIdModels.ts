import _ from 'underscore';
import stringKeyTuple from 'js/lib/stringKeyTuple';

// [be-tech-debt] with 100% atoms we should refactor this model to only use atomId, see CP-4178.
class LectureDraftId {
  id: string;

  branchId: string;

  itemId: string;

  atomId: string;

  constructor(branchId: string, itemId: string, atomId: string) {
    this.branchId = branchId;
    this.itemId = itemId;
    this.atomId = atomId;
    this.id = atomId;
  }

  toString(): string {
    return this.id;
  }

  isValid(): boolean {
    return !_(this.branchId).isEmpty() && !_(this.itemId).isEmpty();
  }
}

class InVideoQuestionDraftId {
  id: string;

  lectureDraftId: string;

  questionId: string;

  constructor(lectureDraftId: string, questionId: string, id: string) {
    this.lectureDraftId = lectureDraftId;
    this.questionId = questionId;
    this.id = id || stringKeyTuple.tupleToStringKey([lectureDraftId, questionId]);
  }

  toString(): string {
    return this.id;
  }

  isValid(): boolean {
    return !_(this.lectureDraftId).isEmpty() && !_(this.questionId);
  }

  static deserialize(id: string): InVideoQuestionDraftId {
    const [lectureDraftId, questionId] = stringKeyTuple.stringKeyToTuple(id);
    return new InVideoQuestionDraftId(lectureDraftId, questionId, id);
  }
}

const exported = {
  LectureDraftId,
  InVideoQuestionDraftId,
};

export default exported;
export { LectureDraftId, InVideoQuestionDraftId };
