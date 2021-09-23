'use es6';

import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { ObjectTypeIdRecord } from '../records/ObjectTypeIdRecord';
export var ObjectTypeIdContext = /*#__PURE__*/createContext(new ObjectTypeIdRecord());
ObjectTypeIdContext.Provider.propTypes = {
  value: PropTypes.instanceOf(ObjectTypeIdRecord)
};
export var useObjectTypeIdContext = function useObjectTypeIdContext() {
  return useContext(ObjectTypeIdContext);
};