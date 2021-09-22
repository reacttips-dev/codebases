import SSModel from 'core/src/models/base/ss-model';

const CompletionModel = SSModel.extend({

  urlRoot: '/completions',
  defaults: {
    'completed': false,
  },

});

export default CompletionModel;

