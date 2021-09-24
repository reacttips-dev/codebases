'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _FLP_REST_TO_GQL_CONS;

import PropTypes from 'prop-types'; // Taken from https://paper.dropbox.com/doc/Include-FLP-data-in-Properties-API-response--Au8CikG9virBm9zJDZMByKbwAg-PUjq2eawoiWBstrC3hTZk

export var NOT_SPECIFIED = 'not_specified';
export var READ_ONLY = 'read_only';
export var HIDDEN = 'hidden'; // Taken from https://git.hubteam.com/HubSpot/CrmPermissions/blob/master/CrmPermissionsCore/src/main/java/com/hubspot/crm/permissions/core/FieldLevelPermissionType.java/

export var NOT_SPECIFIED_REST = '';
export var READ_ONLY_REST = 'readOnly';
export var HIDDEN_REST = 'hidden';
export var FLP_REST_TO_GQL_CONSTANT_MAPPING = (_FLP_REST_TO_GQL_CONS = {}, _defineProperty(_FLP_REST_TO_GQL_CONS, HIDDEN_REST, HIDDEN), _defineProperty(_FLP_REST_TO_GQL_CONS, READ_ONLY_REST, READ_ONLY), _defineProperty(_FLP_REST_TO_GQL_CONS, NOT_SPECIFIED_REST, NOT_SPECIFIED), _FLP_REST_TO_GQL_CONS);
export var AccessLevelPropType = PropTypes.oneOf([NOT_SPECIFIED_REST, READ_ONLY_REST, HIDDEN_REST]);