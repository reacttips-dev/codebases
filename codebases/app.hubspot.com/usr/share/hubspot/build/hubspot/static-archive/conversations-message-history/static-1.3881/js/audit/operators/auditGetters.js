'use es6';

import get from 'transmute/get';
import { AUDIT_TYPE, AGENT_TYPE } from '../constants/keyPaths';
export var getType = get(AUDIT_TYPE);
export var getAgentType = get(AGENT_TYPE);