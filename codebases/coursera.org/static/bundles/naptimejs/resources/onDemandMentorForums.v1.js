import { naptimeForumTypes } from 'bundles/discussions/constants';
import path from 'js/lib/path';
import NaptimeResource from './NaptimeResource';

class OnDemandMentorForums extends NaptimeResource {
  static RESOURCE_NAME = 'onDemandMentorForums.v1';

  get urlId() {
    switch (this.forumType.typeName) {
      case naptimeForumTypes.mentorForumType:
        return this.legacyForumId || this.forumId;
      default:
        throw new Error(`Cannot create discussions link for forumType: ${this.forumType.typeName}`);
    }
  }

  get link() {
    return path.join('discussions', 'forums', this.urlId);
  }

  static course(params, dataProcessor = (data) => data) {
    const paramsWithGuaranteedFields = Object.assign({ fields: [] }, params);
    paramsWithGuaranteedFields.fields.push('order');
    paramsWithGuaranteedFields.fields.push('legacyForumId');
    paramsWithGuaranteedFields.fields.push('forumType');

    return this.finder('course', paramsWithGuaranteedFields, (forums) =>
      dataProcessor(
        forums
          .sort((forum1, forum2) => forum1.order - forum2.order)
          .map((forum) => {
            const splitId = forum.id.split('~');
            return Object.assign(forum, {
              courseId: splitId[0],
              forumId: splitId[1],
            });
          })
      )
    );
  }
}

export default OnDemandMentorForums;
