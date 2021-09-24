'use es6';

import createSearchActionTypes from '../../flux/elasticSearch/createSearchActionTypes';
import { DEAL_PIPELINE_SEARCH } from 'crm_data/actions/ActionNamespaces';
export default createSearchActionTypes(DEAL_PIPELINE_SEARCH);