import _ from 'underscore';

class GroupSettingData {
  constructor(data) {
    Object.assign(this, _(data).pick('definition', 'typeName'));
  }

  get value() {
    return this.definition.value;
  }

  toJSON() {
    return _(this).pick('definition', 'typeName');
  }
}

export default GroupSettingData;
