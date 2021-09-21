import { addUnhandledRejectionEventListeners } from './modules/addUnhandledRejectionEventListeners';

const addEventListeners = () => {
  addUnhandledRejectionEventListeners();
};

export { addEventListeners };
