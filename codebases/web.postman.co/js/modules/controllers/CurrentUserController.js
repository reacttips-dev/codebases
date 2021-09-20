import ModelService from '../services/ModelService';
export default {
  type: 'user',
  get: function () {
    let criteria = { appUserType: 'currentUser' };
    return ModelService.findOne(this.type, criteria);
  }
};
