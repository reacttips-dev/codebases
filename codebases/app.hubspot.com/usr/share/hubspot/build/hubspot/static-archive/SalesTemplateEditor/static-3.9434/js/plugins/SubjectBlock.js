'use es6';

import { createPlugin } from 'draft-extend';
export default createPlugin({
  blockStyleFn: function blockStyleFn() {
    return 'subject-block';
  },
  blockToHTML: {
    unstyled: {
      start: '',
      end: ''
    }
  }
});