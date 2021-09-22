import path from 'js/lib/path';
import NaptimeResource from './NaptimeResource';

const sortAndAttachClientFields = (forums) => {
  const sortedForums = forums.sort((forum1, forum2) => forum1.order - forum2.order);
  const clientFieldsAttachedForums = sortedForums.map((forum) => {
    const splitId = forum.id.split('~');
    return Object.assign(forum, {
      groupId: splitId[0],
      forumId: splitId[1],
      // NOTE: the backend typenames are 'rootForumType' and 'customForumType': the same typenames as the custom
      // forums. We can't change them on the backend, so we'll change it here. Also add the groupId to definition.
      forumType: Object.assign(forum.forumType, {
        typeName: 'groupForumType',
        definition: {
          groupId: splitId[0],
        },
      }),
    });
  });

  return clientFieldsAttachedForums;
};

class GroupForums extends NaptimeResource {
  static RESOURCE_NAME = 'groupForums.v1';

  get urlId() {
    return this.forumType.definition.groupId;
  }

  get link() {
    return path.join('discussions', 'groups', this.urlId);
  }

  /*
   * Gets all group forums for groups that a user belongs to in a course.
   */
  static course(params, dataProcessor = (data) => data) {
    const paramsWithGuaranteedFields = Object.assign({ fields: [] }, params);
    paramsWithGuaranteedFields.fields.push('order');
    paramsWithGuaranteedFields.fields.push('forumType');

    return this.finder('course', paramsWithGuaranteedFields, (forums) =>
      dataProcessor(sortAndAttachClientFields(forums))
    );
  }

  /*
   * Gets all group forums for groups that a user belongs to in a course scoped
   * to a session.
   */
  static courseAndSession(params, dataProcessor = (data) => data) {
    const paramsWithGuaranteedFields = Object.assign({ fields: [] }, params);
    paramsWithGuaranteedFields.fields.push('order');
    paramsWithGuaranteedFields.fields.push('forumType');

    return this.finder('courseAndSession', paramsWithGuaranteedFields, (forums) =>
      dataProcessor(sortAndAttachClientFields(forums))
    );
  }
}

export default GroupForums;
