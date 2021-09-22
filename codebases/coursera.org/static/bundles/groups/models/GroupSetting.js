import _ from 'underscore';
import GroupSettingData from './GroupSettingData';

class GroupSetting {
  constructor(data) {
    Object.assign(this, _(data).pick('groupId', 'id', 'key'));

    this.setting = new GroupSettingData(data.setting);
  }

  get value() {
    return this.setting.value;
  }

  toJSON() {
    return {
      ..._(this).pick('groupId', 'id', 'key'),
      setting: this.setting.toJSON(),
    };
  }
}

export default GroupSetting;
