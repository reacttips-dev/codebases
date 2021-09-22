export type SessionConstructorProps = {
  courseId: string;
  endedAt: number;
  enrollmentEndedAt: number;
  id: string;
  isPrivate: boolean;
  isPreview: boolean;
  startedAt: number;
};

/**
 * Defines the model for a Session
 */
class Session {
  courseId: string;

  endedAt: number;

  enrollmentEndedAt: number;

  id: string;

  isPrivate: boolean;

  isPreview: boolean;

  startedAt: number;

  constructor({ courseId, endedAt, enrollmentEndedAt, id, isPrivate, isPreview, startedAt }: SessionConstructorProps) {
    this.courseId = courseId;
    this.endedAt = endedAt;
    this.enrollmentEndedAt = enrollmentEndedAt;
    this.id = id;
    this.isPrivate = isPrivate;
    this.isPreview = isPreview;
    this.startedAt = startedAt;
  }
}

export default Session;
