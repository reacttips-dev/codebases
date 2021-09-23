'use es6';

import createSearchActionTypes from '../../flux/elasticSearch/createSearchActionTypes';
import { TICKET_PIPELINE_SEARCH } from 'crm_data/actions/ActionNamespaces';
export default createSearchActionTypes(TICKET_PIPELINE_SEARCH);