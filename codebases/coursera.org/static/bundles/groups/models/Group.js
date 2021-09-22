/**
 * Group model
 */
import CSVConstants from 'bundles/groups-common/constants/CSVConstants';

import $ from 'jquery';
import GroupScope from './GroupScope';

class Group {
  constructor({ id, typeName, definition }) {
    this.id = id;
    this.typeName = typeName;
    this.definition = definition;
    if (typeName === 'programGroup') {
      this.scope = new GroupScope({ id, name: 'program' });
    } else {
      this.scope = new GroupScope(definition.scopeId);
    }
  }

  get name() {
    return this.definition.name;
  }

  set name(value) {
    this.definition.name = value;
  }

  get slug() {
    return this.definition.slug;
  }

  get locale() {
    return this.definition.locale;
  }

  set locale(value) {
    this.definition.locale = value;
  }

  get emailDomain() {
    return this.definition.emailDomain;
  }

  set emailDomain(value) {
    this.definition.emailDomain = value;
  }

  get courseId() {
    return this.scope.courseId;
  }

  get LMSType() {
    let type;
    switch (this.typeName) {
      case 'blackboardPrivateCommunity':
        if (this.emailDomain) {
          type = CSVConstants.Types.BlackboardV2;
        } else {
          type = CSVConstants.Types.BlackboardV1;
        }
        break;
      case 'moodlePrivateCommunity':
        type = CSVConstants.Types.Moodle;
        break;
      case 'sakaiPrivateCommunity':
        type = CSVConstants.Types.Sakai;
        break;
      case 'canvasPrivateCommunity':
        type = CSVConstants.Types.Canvas;
        break;
      case 'betaTesterPrivateCommunity':
        type = CSVConstants.Types.BetaTester;
        break;
      case 'degreePrivateCommunity':
        type = CSVConstants.Types.Degree;
        break;
      default:
        type = CSVConstants.Types.Generic;
    }

    return type;
  }

  isGenericGroup() {
    return this.typeName === 'genericPrivateCommunity';
  }

  isBlackboardGroup() {
    return this.typeName === 'blackboardPrivateCommunity';
  }

  toObject() {
    return {
      id: this.id,
      typeName: this.typeName,
      definition: this.definition,
    };
  }

  toJSON() {
    return {
      ...this.toObject(),
      scope: this.scope.toJSON(),
    };
  }

  clone() {
    return new Group($.extend(true, {}, this));
  }
}

export default Group;
