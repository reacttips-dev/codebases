import { naptimeForumTypes } from 'bundles/discussions/constants';
import path from 'js/lib/path';
import NaptimeResource from './NaptimeResource';

class OnDemandCourseForums extends NaptimeResource {
  static RESOURCE_NAME = 'onDemandCourseForums.v1';

  get urlId() {
    switch (this.forumType.typeName) {
      case naptimeForumTypes.weekForumType:
        return this.forumType.definition.weekNumber;
      case naptimeForumTypes.itemForumType:
        return this.forumType.definition.itemId;
      case naptimeForumTypes.customForumType:
        return this.legacyForumId || this.forumId;
      case naptimeForumTypes.rootForumType:
        return '';
      default:
        throw new Error(`Cannot create url for forumType: ${this.forumType.typeName}`);
    }
  }

  get link() {
    let prefix;
    switch (this.forumType.typeName) {
      // item forum type is a special case because of assignment forums
      case naptimeForumTypes.itemForumType:
        return path.join('item', this.urlId, 'discussions');
      case naptimeForumTypes.weekForumType:
        prefix = 'weeks';
        break;
      case naptimeForumTypes.customForumType:
        prefix = 'forums';
        break;
      case naptimeForumTypes.rootForumType:
        prefix = 'all';
        break;
      default:
        break;
    }
    return path.join('discussions', prefix, this.urlId);
  }

  static course(params, dataProcessor = (data) => data) {
    // we always want to fetch all course forums at once (BE has max of 500)
    const paramsWithLimit = params;
    paramsWithLimit.params = Object.assign(params.params || {}, { limit: 500 });
    const paramsWithGuaranteedFields = Object.assign({ fields: [] }, paramsWithLimit);
    paramsWithGuaranteedFields.fields.push('order');
    paramsWithGuaranteedFields.fields.push('legacyForumId');
    paramsWithGuaranteedFields.fields.push('forumType');

    // overrideBranchId is optional, remove the field if it is null or undefined
    if (!paramsWithGuaranteedFields.params.overrideBranchId) {
      delete paramsWithGuaranteedFields.params.overrideBranchId;
    }

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

  static courseForumType({ courseId, overrideBranchId }) {
    const finderParams = {
      params: {
        courseId,
        overrideBranchId,
        courseForumType: naptimeForumTypes.rootForumType,
      },
    };

    // overrideBranchId is optional, remove the field if it is null or undefined
    if (!finderParams.params.overrideBranchId) {
      delete finderParams.params.overrideBranchId;
    }

    return this.finder('courseForumType', finderParams, (elements) => {
      return elements[0] ? elements[0].id : null;
    });
  }
}

export default OnDemandCourseForums;
