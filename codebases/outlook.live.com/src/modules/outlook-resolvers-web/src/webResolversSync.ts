import merge from 'lodash-es/merge';
import type { Resolvers } from 'owa-graph-schema';
import { webResolvers as account } from './resolvers/account';
import { webResolvers as appbar } from './resolvers/appbar';
import { webResolvers as attachment } from './resolvers/attachment';
import { webResolvers as calendar } from './resolvers/calendar';
import { webResolvers as common } from './resolvers/common';
import { webResolvers as compose } from './resolvers/compose';
import { webResolvers as configuration } from './resolvers/configuration';
import { webResolvers as conversation } from './resolvers/conversation';
import { webResolvers as groups } from './resolvers/groups';
import { webResolvers as item } from './resolvers/item';
import { webResolvers as mailfolder } from './resolvers/mailfolder';
import { webResolvers as sample } from './resolvers/sample';
import { webResolvers as subscription } from './resolvers/subscription';
import { webResolvers as view } from './resolvers/view';

export const webResolvers: Resolvers = merge(
    {},
    account,
    appbar,
    attachment,
    calendar,
    common,
    compose,
    configuration,
    conversation,
    mailfolder,
    item,
    sample,
    subscription,
    view,
    groups
);
