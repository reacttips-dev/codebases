class AliceEvent {
  constructor({ type, courseBranchId, contextType }: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'AliceEvent... Remove this comment to see the full error message
    this.type = type;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'courseBranchId' does not exist on type '... Remove this comment to see the full error message
    this.courseBranchId = courseBranchId;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'contextType' does not exist on type 'Ali... Remove this comment to see the full error message
    this.contextType = contextType;
  }
}

export default AliceEvent;
