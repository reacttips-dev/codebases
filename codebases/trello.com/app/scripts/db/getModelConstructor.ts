import { Action } from 'app/scripts/models/action';
import { Board } from 'app/scripts/models/board';
import { BoardPlugin } from 'app/scripts/models/BoardPlugin';
import { Card } from 'app/scripts/models/card';
import { Checklist } from 'app/scripts/models/checklist';
import { CustomField } from 'app/scripts/models/custom-field';
import { CustomFieldItem } from 'app/scripts/models/custom-field-item';
import { Enterprise } from 'app/scripts/models/enterprise';
import { Label } from 'app/scripts/models/label';
import { List } from 'app/scripts/models/list';
import { Member } from 'app/scripts/models/member';
import { Notification } from 'app/scripts/models/notification';
import { NotificationGroup } from 'app/scripts/models/NotificationGroup';
import { Organization } from 'app/scripts/models/organization';
import { PendingOrganization } from 'app/scripts/models/PendingOrganization';
import { Plugin } from 'app/scripts/models/Plugin';
import { PluginData } from 'app/scripts/models/PluginData';
import { Reaction } from 'app/scripts/models/reaction';

import { ModelName } from './ModelName';

export function getModelConstructor(modelName: ModelName) {
  switch (modelName) {
    case ModelName.ACTION:
      return Action;
    case ModelName.BOARD:
      return Board;
    case ModelName.BOARD_PLUGIN:
      return BoardPlugin;
    case ModelName.CARD:
      return Card;
    case ModelName.CHECKLIST:
      return Checklist;
    case ModelName.CUSTOM_FIELD:
      return CustomField;
    case ModelName.CUSTOM_FIELD_ITEM:
      return CustomFieldItem;
    case ModelName.ENTERPRISE:
      return Enterprise;
    case ModelName.LABEL:
      return Label;
    case ModelName.LIST:
      return List;
    case ModelName.MEMBER:
      return Member;
    case ModelName.NOTIFICATION:
      return Notification;
    case ModelName.NOTIFICATION_GROUP:
      return NotificationGroup;
    case ModelName.ORGANIZATION:
      return Organization;
    case ModelName.PENDING_ORGANIZATION:
      return PendingOrganization;
    case ModelName.PLUGIN:
      return Plugin;
    case ModelName.PLUGIN_DATA:
      return PluginData;
    case ModelName.REACTION:
      return Reaction;
    default:
      throw new Error(`Model named "${modelName}" is not supported`);
  }
}
